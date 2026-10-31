import React from 'react';

interface SkillIconProps {
  name: string;
  className?: string;
}

/**
 * High-fidelity vector logos for each technology within circular colored icon badges.
 */
export const SkillIcon: React.FC<SkillIconProps> = ({
  name,
  className = 'size-4 shrink-0',
}) => {
  const normalized = name.toLowerCase().replace(/[\s.-]/g, '');

  switch (normalized) {
    case 'react':
    case 'reactjs':
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={className}>
          <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'nextjs':
    case 'next':
      return (
        <svg viewBox="0 0 180 180" className={className}>
          <circle cx="90" cy="90" r="90" fill="#000000" />
          <path
            d="M149.508 157.438L69.141 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
            fill="url(#next_grad)"
          />
          <rect x="115" y="54" width="12" height="72" fill="#FFFFFF" />
          <defs>
            <linearGradient
              id="next_grad"
              x1="109"
              y1="116.5"
              x2="144.5"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg viewBox="0 0 105 105" className={className}>
          <rect width="105" height="105" rx="16" fill="#F7DF1E" />
          <path
            d="M26.25 78.75l10.5-6.3c2.1 3.68 4.2 6.82 8.92 6.82 4.73 0 7.88-2.1 7.88-10.5v-36.75h11.55v36.75c0 14.7-8.4 20.48-19.42 20.48-10.5 0-16.8-5.78-19.43-10.5zm42-1.05l10.5-6.3c3.15 5.25 7.88 8.92 14.17 8.92 6.3 0 10.5-3.15 10.5-7.35 0-5.25-4.2-7.35-11.55-10.5-10.5-4.73-15.75-9.45-15.75-18.38 0-8.92 6.82-16.27 17.32-16.27 7.88 0 13.65 3.15 17.85 9.98l-9.98 6.3c-2.62-4.2-5.25-5.78-8.4-5.78-4.2 0-7.35 2.62-7.35 6.3 0 4.2 2.62 6.3 9.98 9.45 11.55 4.73 17.32 9.45 17.32 18.9 0 10.5-8.4 17.85-21 17.85-11.55 0-19.42-5.78-23.62-13.92z"
            fill="#000000"
          />
        </svg>
      );

    case 'typescript':
    case 'ts':
      return (
        <svg viewBox="0 0 105 105" className={className}>
          <rect width="105" height="105" rx="16" fill="#3178C6" />
          <path
            d="M36.75 39.38h-10.5v-7.88h32.55v7.88h-10.5v44.1h-11.55v-44.1zm28.35 34.65l10.5-5.78c2.62 4.2 5.78 6.82 10.5 6.82 4.2 0 7.35-2.1 7.35-5.25 0-3.68-3.15-5.25-8.92-7.35-8.92-3.15-14.7-6.82-14.7-14.7 0-7.88 6.3-13.65 15.75-13.65 6.82 0 12.08 2.62 15.75 7.88l-8.4 5.78c-2.1-3.15-4.73-4.73-7.88-4.73-3.68 0-5.78 1.58-5.78 4.2 0 2.62 2.1 4.2 7.35 5.78 10.5 3.68 16.27 7.35 16.27 15.75 0 9.45-7.35 15.22-18.38 15.22-10.5 0-17.85-4.73-21.42-12.6z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'vite':
      return (
        <svg viewBox="0 0 410 404" className={className}>
          <path
            d="M399.641 59.525l-183.74 331.6a12.87 12.87 0 01-22.39.37L10.28 60.1a12.87 12.87 0 018.66-18.79l175.76-38.38a12.87 12.87 0 015.54 0l190.8 41.7a12.87 12.87 0 018.6 14.89z"
            fill="url(#vite_bg)"
          />
          <path
            d="M285.87 39.58L160.7 75.87a6.43 6.43 0 00-4.63 6.17l-3.32 120.48a6.43 6.43 0 008.38 6.13l38.27-11.83a6.43 6.43 0 018.17 7.51l-14.47 62.43a6.43 6.43 0 0010.56 5.89l121.36-124.6a6.43 6.43 0 00-4.5-10.74l-42.54-.73a6.43 6.43 0 01-6.19-7.79l16.14-81.8a6.43 6.43 0 00-8.26-7.44z"
            fill="url(#vite_bolt)"
          />
          <defs>
            <linearGradient
              id="vite_bg"
              x1="0"
              y1="0"
              x2="400"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#41D1FF" />
              <stop offset="1" stopColor="#BD34FE" />
            </linearGradient>
            <linearGradient
              id="vite_bolt"
              x1="160"
              y1="40"
              x2="280"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFEA83" />
              <stop offset=".5" stopColor="#FFDD35" />
              <stop offset="1" stopColor="#FFA800" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'tailwindcss':
    case 'tailwind':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M25 45c3.333-10 10-15 20-15 15 0 17.5 15 27.5 15 6.667 0 11.667-3.333 15-10-3.333 10-10 15-20 15-15 0-17.5-15-27.5-15-6.667 0-11.667 3.333-15 10zm-15 25c3.333-10 10-15 20-15 15 0 17.5 15 27.5 15 6.667 0 11.667-3.333 15-10-3.333 10-10 15-20 15-15 0-17.5-15-27.5-15-6.667 0-11.667 3.333-15 10z"
            fill="#38BDF8"
          />
        </svg>
      );

    case 'html':
    case 'html5':
      return (
        <svg viewBox="0 0 512 512" className={className}>
          <path d="M107.6 461l-33.2-372.6h363.2l-33.2 372.6L256 502.8 107.6 461z" fill="#E44D26" />
          <path d="M256 470.9l121.2-33.6 27.8-311.9H256v345.5z" fill="#F16529" />
          <path
            d="M256 208.6h-59.8l-4.1-46.1H256v-45.2H142.9l12.4 136.5H256v-45.2zm0 137.2l-.4.1-39.7-10.7-2.5-28.5h-45.3l5 56.1 82.5 22.9.4-.1v-39.8z"
            fill="#EBEBEB"
          />
          <path
            d="M256 208.6v45.2h55.6l-5.3 58.7-50.3 13.6v40l82.4-22.9 1-11.3 9.4-105.7 1.6-17.6H256zm0-91.3v45.2h109l-4-45.2H256z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg viewBox="0 0 512 512" className={className}>
          <path d="M107.6 461l-33.2-372.6h363.2l-33.2 372.6L256 502.8 107.6 461z" fill="#264DE4" />
          <path d="M256 470.9l121.2-33.6 27.8-311.9H256v345.5z" fill="#2965F1" />
          <path
            d="M256 208.6h-59.8l-4.1-46.1H256v-45.2H142.9l12.4 136.5H256v-45.2zm0 137.2l-.4.1-39.7-10.7-2.5-28.5h-45.3l5 56.1 82.5 22.9.4-.1v-39.8z"
            fill="#EBEBEB"
          />
          <path
            d="M256 298.9l-50.3-13.6-3.2-36.2h-45.4l6.4 71.9 92.5 25.7v-47.8zm0-181.6v45.2h109l-4-45.2H256zm0 91.3v45.2h55.6l-5.3 58.7-50.3 13.6v40l82.4-22.9 1-11.3 9.4-105.7 1.6-17.6H256z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'zustand':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#443E38" />
          <circle cx="35" cy="42" r="5" fill="#FFFFFF" />
          <circle cx="65" cy="42" r="5" fill="#FFFFFF" />
          <ellipse cx="50" cy="60" rx="14" ry="10" fill="#E5B582" />
          <ellipse cx="50" cy="56" rx="6" ry="4" fill="#231F20" />
        </svg>
      );

    case 'redux':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M50 15c-19.3 0-35 15.7-35 35s15.7 35 35 35c7.3 0 14.1-2.3 19.7-6.2l-6-7.3C59.5 74 54.9 75.3 50 75.3c-14 0-25.3-11.3-25.3-25.3S36 24.7 50 24.7c11.9 0 21.8 8.2 24.5 19.3H63l17 17 17-17H84.3C81.4 27.2 67 15 50 15z"
            fill="#764ABC"
          />
        </svg>
      );

    case 'nodejs':
    case 'node':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M50 8l38 22v44L50 96 12 74V30L50 8z"
            fill="#339933"
          />
          <path
            d="M50 15L82 34v36L50 89 18 70V34L50 15z"
            fill="#026E00"
          />
          <text
            x="50"
            y="58"
            fontSize="28"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            JS
          </text>
        </svg>
      );

    case 'express':
    case 'expressjs':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" />
          <text
            x="50"
            y="62"
            fontSize="36"
            fontWeight="900"
            fill="#000000"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ex
          </text>
        </svg>
      );

    case 'socketio':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#010101" stroke="#FFFFFF" strokeWidth="4" />
          <path
            d="M54 22L28 54h18l-4 24 26-32H50l4-24z"
            fill="#010101"
            stroke="#000000"
          />
          <path
            d="M54 22L28 54h18l-4 24 26-32H50l4-24z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'mongodb':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M50 10c0 0-25 35-25 55 0 18 11.2 32 25 35 13.8-3 25-17 25-35 0-20-25-55-25-55z"
            fill="#47A248"
          />
          <path
            d="M50 10v90c13.8-3 25-17 25-35 0-20-25-55-25-55z"
            fill="#499D4A"
          />
          <path
            d="M50 15v80c-2 0-3-2-3-4 0-15 3-76 3-76z"
            fill="#FFFFFF"
            opacity="0.3"
          />
        </svg>
      );

    case 'redis':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#DC382D" />
          <path
            d="M50 20L20 35v30l30 15 30-15V35L50 20zm0 8l20 10-20 10-20-10 20-10z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'git':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#F05032" />
          <circle cx="36" cy="64" r="8" fill="#FFFFFF" />
          <circle cx="64" cy="36" r="8" fill="#FFFFFF" />
          <circle cx="64" cy="64" r="8" fill="#FFFFFF" />
          <path
            d="M36 64L64 36M64 36v28"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 98 96" className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'vscode':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M74 12l18 9v58l-18 9L44 59 26 73 8 62V38l18-11 18 14 30-29z"
            fill="#007ACC"
          />
          <path d="M74 12L44 41 26 27 8 38v24l18 11 18-14 30 29 18-9V21L74 12z" fill="#007ACC" />
          <path d="M74 12L44 41v18l30 29 18-9V21L74 12z" fill="#1F9CF0" />
        </svg>
      );

    case 'postman':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FF6C37" />
          <path
            d="M62 38c-3-3-8-3-11 0L33 56c-2 2-2 6 0 8 2 2 6 2 8 0l18-18c3-3 3-8 0-11z"
            fill="#FFFFFF"
          />
          <circle cx="68" cy="32" r="6" fill="#FFFFFF" />
        </svg>
      );

    case 'vercel':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,15 90,85 10,85" fill="#FFFFFF" />
        </svg>
      );

    case 'render':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
          <rect x="35" y="35" width="30" height="30" rx="6" fill="#FFFFFF" />
        </svg>
      );

    case 'netlify':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#00C7B7" />
          <path
            d="M32 50l18-18 18 18-18 18-18-18z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'gsap':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#0AE448" />
          <text
            x="50"
            y="65"
            fontSize="32"
            fontWeight="900"
            fill="#000000"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            G
          </text>
        </svg>
      );

    case 'reactrouter':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#CA4245" />
          <path
            d="M30 35h20c8 0 14 5 14 12 0 6-4 10-10 11l14 17H55L43 60h-5v15H30V35zm8 17h12c4 0 6-2 6-5s-2-5-6-5H38v10z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'reacthookform':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#EC5990" />
          <path
            d="M50 25c-8 0-14 6-14 14 0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'restapis':
    case 'restapi':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#23272F" />
          <text
            x="50"
            y="62"
            fontSize="28"
            fontWeight="bold"
            fill="#61DAFB"
            textAnchor="middle"
            fontFamily="monospace"
          >
            API
          </text>
        </svg>
      );

    case 'jwt':
    case 'jwtauth':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FB015B" />
          <text
            x="50"
            y="62"
            fontSize="24"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            JWT
          </text>
        </svg>
      );

    case 'bullmq':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FF5E00" />
          <text
            x="50"
            y="62"
            fontSize="24"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            MQ
          </text>
        </svg>
      );

    case 'zod':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#3068B7" />
          <text
            x="50"
            y="64"
            fontSize="36"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Z
          </text>
        </svg>
      );

    case 'razorpay':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#0C2340" />
          <path d="M42 25l-12 50h14l8-25 16-25H42z" fill="#02042B" />
          <path d="M50 25l-18 25h20l18-25H50z" fill="#3395FF" />
        </svg>
      );

    case 'cloudinary':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#3448C5" />
          <path
            d="M62 42c0-8-6-14-14-14-6 0-11 4-13 9-1 0-2 0-3 0-7 0-12 5-12 12s5 12 12 12h30c7 0 12-5 12-12 0-6-4-11-10-12z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'axios':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#5A29E4" />
          <path
            d="M52 28L28 72h12l5-11h14l-4-9h-6l7-16h-4z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'bootstrap':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#7952B3" />
          <text
            x="50"
            y="70"
            fontSize="52"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            B
          </text>
        </svg>
      );

    case 'mongoose':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#880000" />
          <text
            x="50"
            y="68"
            fontSize="48"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            M
          </text>
        </svg>
      );

    case 'firebase':
    case 'firebasedb':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M22 75L38 18l14 26-10 13z" fill="#FFA000" />
          <path d="M78 75L58 35l-16 30 16 10z" fill="#F57C00" />
          <path d="M22 75l56 0-36 15z" fill="#FFCA28" />
        </svg>
      );

    case 'supabase':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#1C1C1C" />
          <path
            d="M52 18L26 58h22L38 82l36-44H52l8-20z"
            fill="#3ECF8E"
          />
        </svg>
      );

    case 'mysql':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#00758F" />
          <text
            x="50"
            y="64"
            fontSize="26"
            fontWeight="bold"
            fill="#F29111"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            SQL
          </text>
        </svg>
      );

    case 'figma':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="35" cy="25" r="15" fill="#F24E1E" />
          <circle cx="65" cy="25" r="15" fill="#FF7262" />
          <circle cx="35" cy="50" r="15" fill="#A259FF" />
          <circle cx="65" cy="50" r="15" fill="#1ABCFE" />
          <circle cx="35" cy="75" r="15" fill="#0ACF83" />
        </svg>
      );

    case 'npm':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="16" fill="#CB3837" />
          <text
            x="50"
            y="65"
            fontSize="32"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="monospace"
          >
            npm
          </text>
        </svg>
      );

    case 'aos':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#1E293B" />
          <text
            x="50"
            y="62"
            fontSize="24"
            fontWeight="bold"
            fill="#38BDF8"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            AOS
          </text>
        </svg>
      );

    case 'framermotion':
    case 'framer':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#0055FF" />
          <path d="M30 25h40L50 45H30zM50 45l20 20H30zM50 65l-20 20v-20z" fill="#FFFFFF" />
        </svg>
      );

    case 'railway':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#131415" stroke="#FFFFFF" strokeWidth="3" />
          <text
            x="50"
            y="65"
            fontSize="34"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            R
          </text>
        </svg>
      );

    case 'websocket':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#00599C" />
          <path
            d="M32 50h36M56 38l12 12-12 12M44 62l-12-12 12-12"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'mongodbatlas':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#001E2B" />
          <path
            d="M50 15c0 0-20 28-20 44 0 14 9 25 20 27 11-2 20-13 20-27 0-16-20-44-20-44z"
            fill="#00ED64"
          />
        </svg>
      );

    case 'pm2':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#2B037A" />
          <text
            x="50"
            y="64"
            fontSize="26"
            fontWeight="bold"
            fill="#2BD67B"
            textAnchor="middle"
            fontFamily="monospace"
          >
            PM2
          </text>
        </svg>
      );

    case 'pwa':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#5A0FC8" />
          <text
            x="50"
            y="64"
            fontSize="24"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            PWA
          </text>
        </svg>
      );

    case 'helmet':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#1C3D5A" />
          <path
            d="M50 22l24 9v18c0 17-10 30-24 35-14-5-24-18-24-35V31l24-9z"
            fill="#E2E8F0"
          />
        </svg>
      );

    case 'rbac':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#0F172A" />
          <path
            d="M50 25a12 12 0 100 24 12 12 0 000-24zm-22 46c0-9 10-15 22-15s22 6 22 15v4H28v-4z"
            fill="#38BDF8"
          />
        </svg>
      );

    case 'bcrypt':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#1E293B" />
          <path
            d="M50 22a14 14 0 00-14 14v10h-4v30h36V46h-4V36a14 14 0 00-14-14zm-8 24V36a8 8 0 0116 0v10H42z"
            fill="#F59E0B"
          />
        </svg>
      );

    case 'nodecron':
    case 'cron':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#0284C7" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M50 32v20l12 6" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'faceverification':
    case 'faceapi':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#4338CA" />
          <path
            d="M32 28h-8v8M68 28h8v8M32 72h-8v-8M68 72h8v-8"
            stroke="#A5B4FC"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="42" cy="46" r="4" fill="#FFFFFF" />
          <circle cx="58" cy="46" r="4" fill="#FFFFFF" />
          <path d="M42 60c2 4 14 4 16 0" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'nodemailer':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#2563EB" />
          <path d="M25 32h50v36H25z" fill="none" stroke="#FFFFFF" strokeWidth="6" rx="4" />
          <path d="M26 34l24 20 24-20" fill="none" stroke="#FFFFFF" strokeWidth="6" />
        </svg>
      );

    case 'ratelimiting':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#0D9488" />
          <path
            d="M26 68A32 32 0 1174 68"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="M50 50l14-16" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'auditlogging':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#334155" />
          <rect x="28" y="24" width="44" height="52" rx="6" fill="#F8FAFC" />
          <path d="M36 40h28M36 50h28M36 60h18" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <span className="size-2 rounded-full bg-[#bf4a1a] shrink-0" />
      );
  }
};

export default SkillIcon;
