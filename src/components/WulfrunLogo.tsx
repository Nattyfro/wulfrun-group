import { memo } from 'react';
// @mui
import { Box, Stack, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';

// ----------------------------------------------------------------------

interface WulfrunLogoProps {
  width?: number;
  color?: string;
}

function isLightColor(color?: string) {
  if (!color) return false;
  return color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff' || color === 'white';
}

function WulfrunLogo({ width = 240, color }: WulfrunLogoProps) {
  const isMobile = useResponsive('down', 'md');
  const useWhite = isLightColor(color);
  const textColor = useWhite ? '#FFFFFF' : '#212B36';
  const subtextColor = useWhite ? 'rgba(255,255,255,0.72)' : '#919EAB';

  if (isMobile) {
    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          minWidth: 0,
          maxWidth: 168,
        }}
      >
        <Box
          component="img"
          src="/assets/wulfrun-wolf.png"
          alt=""
          aria-hidden
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'block',
            objectFit: 'contain',
            filter: useWhite ? 'brightness(0) invert(1)' : 'none',
          }}
        />
        <Stack spacing={0} sx={{ minWidth: 0, lineHeight: 1.05 }}>
          <Typography
            component="span"
            sx={{
              fontSize: 14.5,
              color: textColor,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '0.04em',
            }}
          >
            <Box component="span" sx={{ fontWeight: 700 }}>
              Wulfrun
            </Box>
            <Box component="span" sx={{ fontWeight: 300 }}>
              Group
            </Box>
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: 7,
              fontWeight: 300,
              color: subtextColor,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Roofing Contractors
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Box
      component="img"
      src={useWhite ? '/assets/wulfrun-logo-white.svg' : '/assets/wulfrun-logo-black.svg'}
      alt="Wulfrun Group"
      sx={{
        display: 'block',
        width,
        height: 'auto',
        aspectRatio: '796 / 135',
        maxHeight: 52,
        objectFit: 'contain',
      }}
    />
  );
}

export default memo(WulfrunLogo);
