import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Custom geometric lettermark "L" for Lekhraj with a modernist diagonal cut.
 */
export const Logo: React.FC<LogoProps> = ({
  className = 'w-10 sm:w-11 h-auto text-[#161616]',
  ...props
}) => {
  return (
    <svg
      data-brand-logo="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 325 390"
      fill="currentColor"
      aria-label="Lekhraj brand mark"
      role="img"
      className={className}
      {...props}
    >
      {/* Top vertical stem with semicircle cap & 45-degree angled bottom */}
      <path d="M 10,65 A 55,55 0 0,1 120,65 L 120,250 L 10,360 Z" />
      {/* Bottom horizontal foot with 45-degree angled corner & semicircle right tip */}
      <path d="M 30,380 L 140,270 L 260,270 A 55,55 0 0,1 260,380 Z" />
    </svg>
  );
};

export default Logo;
