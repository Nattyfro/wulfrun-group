import { ReactElement } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { styled } from '@mui/material/styles';
import {
  Grid,
  Divider,
  Container,
} from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../../../src/config';
// hooks
import { useRequest } from '../../../src/hooks';
// _data
// layouts
import Layout from '../../../src/layouts';
// components
import {
  Page,
  ErrorScreen,
  LoadingScreen,
} from '../../../src/components';
// sections
import {
  TravelTourHeader,
  TravelTourGallery,
  TravelTourDetails,
  TravelTourSimilar,
} from '../../../src/sections/@travel';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
})); 

// ----------------------------------------------------------------------

export default function TravelTourPage() {
  const router = useRouter();

  const { id } = router.query;

  const { data: tours = [] } = useRequest('/api/travel/tours');

  const {
    data: tour,
    error: tourError,
    isLoading: tourLoading,
  } = useRequest(id ? `/api/travel/tours/${id}` : '');

  if (tourError) {
    return <ErrorScreen />;
  }

  if (tourLoading) {
    return <LoadingScreen />;
  }

  return (
    <Page title={`${tour.slug} - Travel`}>
      <RootStyle>
        <Container>
          <TravelTourHeader tour={tour} />

          <TravelTourDetails tour={tour} />


          <TravelTourGallery gallery={tour.gallery} />

          <Grid container spacing={8} direction="row-reverse">
            <Grid item xs={12} md={7} lg={8}>
              <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

            </Grid>
          </Grid>
        </Container>
        <TravelTourSimilar tours={tours.slice(-4)} />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

TravelTourPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
