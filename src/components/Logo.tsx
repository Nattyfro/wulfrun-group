import { memo } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { BoxProps, Link } from '@mui/material';
import { useResponsive } from '../hooks';
import WulfrunLogo from './WulfrunLogo';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  onDark?: boolean;
  isSimple?: boolean;
}

function Logo({ onDark = false, isSimple = false, sx }: LogoProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const PRIMARY_MAIN = theme.palette.primary.main;
  const LIGHT_COLOR = theme.palette.common.white;
  const DARK_COLOR = theme.palette.grey[800];

  const isMobile = useResponsive('only', 'xs')

  return (
    <NextLink href="/" passHref>
      <Link
        underline="none"
        sx={{
          display: 'inline-flex',
          lineHeight: 0,
          ...sx,
        }}
      >
        <WulfrunLogo width={!isMobile ? 240 : 160} color={onDark ? LIGHT_COLOR : DARK_COLOR} />
      </Link>
    </NextLink>
  );
}

export default memo(Logo);