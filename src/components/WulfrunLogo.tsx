import { memo } from 'react';

interface WulfrunLogoProps {
  width?: number;
  color?: string;
}

function isLightColor(color?: string) {
  if (!color) return false;
  return color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff' || color === 'white';
}

function WulfrunLogo({ width = 240, color }: WulfrunLogoProps) {
  const useWhite = isLightColor(color);

  return (
    <img
      src={useWhite ? '/assets/wulfrun-logo-white.svg' : '/assets/wulfrun-logo-black.svg'}
      alt="Wulfrun Group"
      width={width}
      height="auto"
      style={{ display: 'block' }}
    />
  );
}

export default memo(WulfrunLogo);
