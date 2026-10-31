const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '..', 'public');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#141414" stroke="#2b2b2b" stroke-width="12"/>
  <g transform="translate(93, 61)">
    <!-- Top vertical stem with semicircle cap & 45-degree angled bottom -->
    <path d="M 10,65 A 55,55 0 0,1 120,65 L 120,250 L 10,360 Z" fill="#f4f3ef"/>
    <!-- Bottom horizontal foot with 45-degree angled corner & semicircle right tip -->
    <path d="M 30,380 L 140,270 L 260,270 A 55,55 0 0,1 260,380 Z" fill="#bf4a1a"/>
  </g>
</svg>`;

function createIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirSize = 16 * numImages;
  let offset = 6 + dirSize;

  const dirBuffers = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size
    entry.writeUInt32LE(offset, 12); // Offset
    dirBuffers.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirBuffers, ...pngBuffers.map(img => img.buffer)]);
}

async function main() {
  console.log('Generating favicons for public directory:', publicDir);

  // 1. Write SVG
  const svgPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log('Wrote favicon.svg');

  // 2. Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  const icoFrames = [];

  for (const item of sizes) {
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    const targetPath = path.join(publicDir, item.name);
    fs.writeFileSync(targetPath, pngBuffer);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);

    if ([16, 32, 48].includes(item.size)) {
      icoFrames.push({ width: item.size, height: item.size, buffer: pngBuffer });
    }
  }

  // 3. Generate multi-resolution favicon.ico
  const icoBuffer = createIco(icoFrames);
  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Generated favicon.ico with 16x16, 32x32, and 48x48 frames');

  // 4. Generate site.webmanifest for PWA / Mobile browsers
  const manifest = {
    name: "Lekhraj | MERN Stack Developer",
    short_name: "Lekhraj",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#141414",
    background_color: "#e5e3dc",
    display: "standalone"
  };

  const manifestPath = path.join(publicDir, 'site.webmanifest');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Generated site.webmanifest');

  console.log('All favicon assets successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
