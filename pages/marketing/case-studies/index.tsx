import { ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack, Box } from '@mui/material';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../../../src/config';
// utils
import { getAllPosts } from '../../../src/utils/get-mardown/marketing/posts';
import { getAllCaseStudies } from '../../../src/utils/get-mardown/marketing/case-studies';
// _data
// @types
import { BlogPostProps } from '../../../src/@types/blog';
import { CaseStudyProps } from '../../../src/@types/marketing';
// layouts
import Layout from '../../../src/layouts';
// components
import { Page } from '../../../src/components';
// sections
import { NewsletterMarketing } from '../../../src/sections/newsletter';
import { MarketingCaseStudiesList } from '../../../src/sections/@marketing';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  posts: BlogPostProps[];
  caseStudies: CaseStudyProps[];
};

export default function MarketingCaseStudiesPage({ caseStudies }: Props) {
  return (
    <Page title="Portfolio">
      <RootStyle>
        <Container>
          <Stack
            spacing={3}
            sx={{
              mt: { xs: 8, md: 10 },
              textAlign: { xs: 'center', md: 'left' },
              maxWidth:800
            }}
          >
            <Box  sx={{width:24, height:4, bgcolor:"primary.main"}}/>
            <Typography variant="h2">Our Portfolio</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Welcome to our portfolio page where you can view our impressive collection of roofing
              work we have completed over the years. Our experienced team of roofers strives to
              provide the highest quality of work, and this page showcases a range of projects that
              demonstrate our dedication to excellence.
            </Typography>
          </Stack>

          <MarketingCaseStudiesList caseStudies={caseStudies} />
        </Container>

        <NewsletterMarketing />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MarketingCaseStudiesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
      caseStudies: getAllCaseStudies(),
    },
  };
}
