// @mui
import { Box, Stack, Button, AppBar, Divider, Container } from '@mui/material';
// hooks
import { useOffSetTop, useResponsive } from '../../hooks';
// routes
import Routes from '../../routes'; // hey
// config
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// components
import { Logo } from '../../components';
//
import { NavMobile, NavDesktop, navConfig } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';
import HeaderAuth from './HeaderAuth';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
};

export default function Header({ transparent }: Props) {
  const isDesktop = useResponsive('up', 'md');
  const isMobile = useResponsive('only', 'xs');

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: { xs: 1, md: 0 },
            pl: { xs: 'max(20px, env(safe-area-inset-left))', md: 2.5 },
            pr: { xs: 'max(20px, env(safe-area-inset-right))', md: 2.5 },
          }}
        >
          {isDesktop && (
            <NavDesktop
              isScrolling={isScrolling}
              isTransparent={transparent}
              navConfig={navConfig}
            />
          )}

          {isDesktop && <Box sx={{ flexGrow: 1 }} />}
          <Logo onDark={transparent && !isScrolling} sx={{ mr: { xs: 0.5, md: 0 } }} />
          <Box sx={{ flexGrow: 1, minWidth: { xs: 8, md: 0 } }} />

          <Stack spacing={2} direction="row" alignItems="center">
            <HeaderAuth onDark={transparent && !isScrolling} />

            {!isMobile ? (
              <Typography
                sx={{
                  fontSize:'14px',
                  ...(isScrolling && { color: 'text.primary' }),
                }}
              >
                <b>+44 7966 031331</b>
              </Typography>
            ) : (
              <Button
                variant="outlined"
                size="small"
                href={Routes.eLearning.contact}
                sx={{ fontSize: 10, borderRadius: 50 }}
              >
                Careers
              </Button>
            )}
            {!isMobile && (
              <Divider
                orientation="vertical"
                {...(isScrolling ? { color: '#212B36' } : { color: '#fff' })}
                sx={{ height: 30 }}
              />
            )}

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                <Button variant="contained" href={Routes.eLearning.contact}>
                  Contact Us
                </Button>
              </Stack>
            )}
          </Stack>

          {!isDesktop && (
            <NavMobile
              navConfig={navConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: 'text.primary' }),
              }}
            />
          )}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}
    </AppBar>
  );
}
