import { ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// utils
import { getAllPosts } from '../src/utils/get-mardown/e-learning/posts';
// _data
import { _members, _brandsColor, _testimonials } from '../_data/mock';
// layouts
import Layout from '../src/layouts';
// components
import { ErrorScreen, Page } from '../src/components';
// sections
import { TeamMarketingLangding } from '../src/sections/team';
import { OurClientsElearning } from '../src/sections/our-clients';
import { ElearningLandingHero } from '../src/sections/@e-learning';
import {
  CaseStudiesGallery,
  MarketingAboutOurVision,
  MarketingLandingAbout,
  MarketingLandingProcess,
  MarketingServicesBenefits,
} from '../src/sections/@marketing';
import { Box } from '@mui/material';
import { TestimonialsTravel } from '../src/sections/testimonials/travel';

// ----------------------------------------------------------------------

const SectionBand = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'muted',
})<{ muted?: boolean }>(({ theme, muted }) => ({
  backgroundColor: muted ? theme.palette.grey[50] : theme.palette.background.default,
  ...(muted && {
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  }),
}));

const galleryImgs = [
  'https://youngroofingltd.com/assets/Images/Hero9.jpeg',
  'https://youngroofingltd.com/assets/Images/Hero10.jpg',
  // 'https://youngroofingltd.com/assets/Images/Hero3.png',
  'https://youngroofingltd.com/assets/Images/Hero4.jpg',
  'https://youngroofingltd.com/assets/Images/Hero5.jpg',
  // 'https://youngroofingltd.com/assets/Images/Hero6.jpg',
  'https://youngroofingltd.com/assets/Images/Hero7.jpg',
];

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="K P Young Roofing Limited">
      <ElearningLandingHero />

      <SectionBand muted>
        <MarketingLandingAbout />
      </SectionBand>

      <CaseStudiesGallery images={galleryImgs} />

      <SectionBand muted>
        <MarketingLandingProcess />
      </SectionBand>

      <TestimonialsTravel testimonials={_testimonials} />

      <SectionBand muted>
        <OurClientsElearning brands={_brandsColor} />
      </SectionBand>
    </Page>
  );
}
 
// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout transparentHeader simpleFooter>
      {page}
    </Layout>
  );
};
