import { useState } from 'react';
// icons
import playIcon from '@iconify/icons-carbon/video-filled';
import chevronRight from '@iconify/icons-carbon/chevron-right';
// @mui
import { Typography, Stack, Box, Button } from '@mui/material';
// _data
import _mock from '../../../../_data/mock';
// assets
// components
import { Iconify, TextIconLabel, PlayerWithButton, Image, BgOverlay } from '../../../components';
import { FabButtonAnimate } from '../../../components/animate';
import { alpha, useTheme } from '@mui/material/styles';
import useResponsive from '../../../hooks/useResponsive';
import useLocales from '../../../hooks/useLocales';
import Routes from '../../../routes';

// ----------------------------------------------------------------------

export default function ElearningLandingHero() {
  const theme = useTheme();
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          textAlign: 'left',
          alignItems: { xs: 'end', md: 'end' },
          width: '99.99vw',
          height: '100vh',
          overflow: 'hidden',
          position: {
            xs: 'relative',
            md: 'relative',
          },
        }}
      >
        <Content />

        <BgOverlay
          startColor={alpha(theme.palette.grey[900], 0)}
          endColor={alpha(theme.palette.grey[900], 0.3)}
        />
        <BgOverlay />
        <Image
          sx={{
            position: 'absolute',
            height: 1,
            maxWidth: 1,
            webkitTransform: 'scaleX(-1)',
            transform: 'scaleX(-1)',
          }}
          alt="hero"
          // src="https://youngroofingltd.com/assets/Sambourne/17.jpg"
          src='https://youngroofingltd.com/assets/CherryHill/9.jpg'  // 3 4 5 6 9
          // src='https://kpyoungroofing.vercel.app/assets/Sambourne/5.jpg' 10,7,4,5,18,17,29
        />
      </Box>

      <PlayerWithButton open={openVideo} onClose={handleCloseVideo} videoPath={_mock.video} />
    </>
  );
}

// ----------------------------------------------------------------------

function Content() {
  const { t } = useLocales();
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };
  const isMobile = useResponsive('only', 'xs');

  return (
    <Stack
      alignItems="left"
      sx={{
        mx: { xs: 2, md: 20 },
        zIndex: 9,
        width: '650px',
        mb: { xs: 3, md: 15 },
        p: 2,
        position: { md: 'absolute' },
        color: 'common.white',
      }}
    >
      <Typography variant="h2">{t('home', 'heroTitle')}</Typography>
      <Typography sx={{ color: 'grey.300', mt: 3, mb: 5 }}>
        {t('home', 'heroDescription')}
      </Typography>

      <Stack
        spacing={3}
        alignItems={{ xs: 'left', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={handleOpenVideo}
          endIcon={<Iconify icon={playIcon} />}
        >
          {t('home', 'watchVideo')}
        </Button>
        <Button
          size="large"
          color="inherit"
          variant="text"
          href={Routes.marketing.caseStudies}
          endIcon={!isMobile && <Iconify icon={chevronRight} />}
        >
          {t('home', 'viewPortfolio')}
        </Button>
        <PlayerWithButton open={openVideo} onClose={handleCloseVideo} videoPath={_mock.video} />
      </Stack>
    </Stack>
  );
}
