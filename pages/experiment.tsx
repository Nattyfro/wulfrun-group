import { ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import IqTest from '../src/sections/experiment/IqTest';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

export default function ExperimentPage() {
  return (
    <Page title="IQ Challenge">
      <RootStyle>
        <IqTest />
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

ExperimentPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
