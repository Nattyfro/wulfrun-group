import { ReactElement } from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
// icons
// @mui
import { styled } from '@mui/material/styles';
import { HEADER_MOBILE_HEIGHT } from '../../src/config';
// utils
import { getAllComponents } from '../../src/utils/get-mardown/components-ui';
// layouts
import Layout from '../../src/layouts';
// components
import { Page } from '../../src/components';
import { ElearningLandingHero } from '../../src/sections/@Roofing';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT * 1.5,
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export type ComponentProps = {
  slug: string;
  content: MDXRemoteSerializeResult;
  frontmatter: {
    title: string;
    link: string;
  };
};


export default function ComponentsUIPage() {
  return (
    <Page title="Components">
      <RootStyle>
          <ElearningLandingHero/>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------
ComponentsUIPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
  return {
    props: {
      components: getAllComponents(),
    },
  };
}
