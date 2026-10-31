import React from 'react';

interface BrushShapeProps {
  className?: string;
}

export const BrushShape: React.FC<BrushShapeProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 640 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="brushGlow"
          cx="0.5"
          cy="0.45"
          r="0.55"
          fx="0.4"
          fy="0.35"
        >
          <stop offset="0%" stopColor="#d85a24" />
          <stop offset="65%" stopColor="#bf4a1a" />
          <stop offset="100%" stopColor="#8c330e" />
        </radialGradient>
      </defs>

      {/* Primary Organic Paint/Brush Shape */}
      <path
        d="M320 40
           C460 25, 570 95, 600 230
           C625 345, 590 480, 520 575
           C455 660, 310 685, 205 650
           C105 615, 40 520, 30 405
           C20 280, 95 160, 190 90
           C235 55, 275 45, 320 40 Z"
        fill="url(#brushGlow)"
        opacity="0.94"
      />

      {/* Dynamic secondary textured paint swashes */}
      <path
        d="M170 120
           C280 60, 480 70, 560 180
           C620 270, 610 420, 540 530
           C480 620, 370 650, 260 620
           C140 590, 60 480, 70 340
           C80 210, 120 145, 170 120 Z"
        fill="#bf4a1a"
        opacity="0.55"
      />

      {/* Artistic paint splatter droplets */}
      <circle cx="95" cy="180" r="14" fill="#bf4a1a" opacity="0.8" />
      <circle cx="65" cy="225" r="8" fill="#bf4a1a" opacity="0.7" />
      <circle cx="120" cy="130" r="9" fill="#bf4a1a" opacity="0.65" />
      <circle cx="560" cy="140" r="16" fill="#bf4a1a" opacity="0.8" />
      <circle cx="595" cy="185" r="10" fill="#bf4a1a" opacity="0.75" />
      <circle cx="580" cy="490" r="18" fill="#bf4a1a" opacity="0.8" />
      <circle cx="615" cy="450" r="9" fill="#bf4a1a" opacity="0.6" />
      <circle cx="150" cy="620" r="15" fill="#bf4a1a" opacity="0.85" />
      <circle cx="110" cy="590" r="9" fill="#bf4a1a" opacity="0.7" />
      <circle cx="490" cy="635" r="13" fill="#bf4a1a" opacity="0.75" />
    </svg>
  );
};

export default BrushShape;
