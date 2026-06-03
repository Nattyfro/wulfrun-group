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
          <Logo onDark={transparent && !isScrolling} />
          <Box sx={{ flexGrow: 1 }} />

          <Stack spacing={5} direction="row" alignItems="center">
            {!isMobile ? (
              <Typography
                sx={{
                  fontSize:'14px',
                  ...(isScrolling && { color: 'text.primary' }),
                }}
              >
                <b>01902 567278</b>
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
