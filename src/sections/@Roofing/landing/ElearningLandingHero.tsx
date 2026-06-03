import { useState } from 'react';
// icons
import playIcon from '@iconify/icons-carbon/play';
import chevronRight from '@iconify/icons-carbon/chevron-right';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Container, Box, Grid, Divider, Button } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// theme
import { ColorSchema } from '../../../theme/palette';
// _data
import _mock from '../../../../_data/mock';
// assets
// components
import { Iconify, TextIconLabel, PlayerWithButton, Image } from '../../../components';
import { FabButtonAnimate } from '../../../components/animate';
import Routes from '../../../routes';

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  overflow: 'hidden',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(15),
  },
}));

// ----------------------------------------------------------------------

export default function ElearningLandingHero() {
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  return (
    <>
      <RootStyle>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={5}>
              <Stack
                sx={{
                  textAlign: { xs: 'center', md: 'unset' },
                }}
              >
                <Typography variant="h1">
                  {' '}
                  <Box component="span">
                    About Us
                  </Box>{' '}
                </Typography>

                <Typography sx={{ color: 'text.secondary', mt: 3, mb: 5 }}>
                  K P Young Roofing Ltd is a family-run enterprise that has been providing quality
                  roofing services to the West Midlands since 2002. We specialize in new roofs,
                  re-roofing, repair and maintenance, built-up felt roofing, slating/tiling, and GRP
                  systems. Our commitment to customer service, honesty, and high-quality standards
                  has allowed us to remain successful for over Three decades. To ensure that our team
                  is fully equipped to meet the needs of our customers and the construction
                  industry, all our operatives are CSCS certified. We strive to provide the best
                  possible services to our customers while ensuring the safety and satisfaction of
                  our employees.
                </Typography>

                <Stack spacing={3} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
                  <Button
                    size="large"
                    variant="contained"
                    href={Routes.marketing.caseStudies}
                    endIcon={<Iconify icon={chevronRight} />}
                  >
                    View Portfolio
                  </Button>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed', mt: 8, mb: 6 }} />

                <SummarySection />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} lg={7} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ pl: 15, borderRadius: 50 }}>
                <Image
                  alt="hero"
                  src="https://youngroofingltd.com/assets/Images/Hero11A.jpg"
                />
                <Image
                  alt="hero"
                  src="https://youngroofingltd.com/assets/Images/Hero9.jpeg"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>

    </>
  );
}

// ----------------------------------------------------------------------

function SummarySection() {
  return (
    <Stack
      spacing={{ xs: 3, sm: 10 }}
      direction="row"
      justifyContent={{ xs: 'center', md: 'unset' }}
    >
      {SummaryItem(2000, 'Installations', 'warning')}
      {SummaryItem(5000050, 'Turned over', 'error')}
      {SummaryItem(35, 'Years in experience', 'success')}
    </Stack>
  );
}

function SummaryItem(total: number, label: string, color: ColorSchema) {
  return (
    <Stack spacing={0.5} sx={{ position: 'relative' }}>
      <Box
        sx={{
          top: 8,
          left: -4,
          width: 24,
          height: 24,
          zIndex: -1,
          opacity: 0.24,
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: (theme) => theme.palette[color].main,
        }}
      />
      <Typography variant="h3">{fShortenNumber(total)}+</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Stack>
  );
}
