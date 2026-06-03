import { ReactElement } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// utils
import {
  getCaseStudyData,
  getAllCaseStudies,
  getCaseStudiesSlugs,
} from '../../../src/utils/get-mardown/marketing/case-studies';
// config
import { HEADER_MOBILE_HEIGHT } from '../../../src/config';
// @types
import { CaseStudyProps } from '../../../src/@types/marketing';
// layouts
import Layout from '../../../src/layouts';
// components
import { Page, varFade } from '../../../src/components';
// sections
import { MarketingCaseStudiesSimilar, CaseStudiesGallery } from '../../../src/sections/@marketing';
import { m } from 'framer-motion';
import ProjectSummary from '../../../src/sections/@Roofing/landing/ProjectSummary';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
    // paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  caseStudy: CaseStudyProps;
  caseStudies: CaseStudyProps[];
};

export default function MarketingCaseStudyPage({ caseStudies, caseStudy }: Props) {
  const { frontmatter } = caseStudy;

  const { title, description, coverImg, galleryImgs, includes, video, summary } = frontmatter;

  return (
    <Page
      title={`${title} - Case Study`}
      meta={
        <>
          <meta property="og:image" content={coverImg} />
        </>
      }
    >
      <RootStyle>
        <ProjectSummary
          summary={summary}
          includes={includes}
          coverImg={coverImg}
          title={title}
          video={video}
        />

        <Container sx={{ py: 10 }}>
          <Box
            sx={{
              mb: { xs: 8, md: 10 },
              textAlign: 'center',
            }}
          >
            <m.div variants={varFade().inDown}>
              <Typography variant="h3" sx={{ mt: 2, mb: 3 }}>
                {title}
              </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography sx={{ color: 'text.secondary' }}>{description}</Typography>
            </m.div>
          </Box>

          <CaseStudiesGallery images={galleryImgs} />
        </Container>
        <MarketingCaseStudiesSimilar caseStudies={caseStudies.slice(0, 3)} />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

MarketingCaseStudyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const caseStudy = getCaseStudyData(params.slug);

  return {
    props: {
      caseStudies: getAllCaseStudies(),
      caseStudy: {
        ...caseStudy,
        content: await serialize(caseStudy.content),
      },
    },
  };
}

export async function getStaticPaths() {
  const files = getCaseStudiesSlugs();

  return {
    paths: files,
    fallback: false,
  };
}
