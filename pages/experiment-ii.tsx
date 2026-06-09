import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../src/config';
// layouts
import Layout from '../src/layouts';
// components
import { Page } from '../src/components';
// sections
import IqResultsDashboard from '../src/sections/experiment/IqResultsDashboard';
// lib
import { getIqResultsServer } from '../src/lib/getIqResultsServer';
import { IqTestResult } from '../src/lib/iqTestResults';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type PageProps = {
  initialResults: IqTestResult[];
  initialError: string | null;
};

export default function ExperimentIIPage({ initialResults, initialError }: PageProps) {
  return (
    <Page title="Experiment II — IQ Results">
      <RootStyle>
        <IqResultsDashboard initialResults={initialResults} initialError={initialError} />
      </RootStyle>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const { results, error } = await getIqResultsServer();

  return {
    props: {
      initialResults: results,
      initialError: error,
    },
  };
};

// ----------------------------------------------------------------------

ExperimentIIPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
