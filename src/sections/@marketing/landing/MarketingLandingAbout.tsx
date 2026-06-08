import directionStraightRight from '@iconify/icons-carbon/direction-straight-right';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Stack, Container, Typography, Button, Divider } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { Iconify } from '../../../components';
import Routes from '../../../routes';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    paddingBottom: 0,
    paddingTop: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function MarketingLandingAbout() {
  const { t } = useLocales();

  return (
    <RootStyle>
      <Container>
        <Grid
          container
          rowSpacing={{ xs: 5, md: 0 }}
          columnSpacing={{ md: 3 }}
          justifyContent="space-between"
        >
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              {t('home', 'aboutLabel')}
            </Typography>

            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              {t('home', 'aboutTitle')}
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              {t('home', 'aboutDescription')}
            </Typography>

            <Button size="large" endIcon={<Iconify icon={directionStraightRight} />} href={Routes.componentsUI} sx={{ mt: 5 }}>
              {t('home', 'learnMore')}
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={5}>
              <LineItem
                total={fShortenNumber(2000)}
                label={t('home', 'happyClients')}
                text={t('home', 'happyClientsText')}
              />
              <LineItem
                total="30"
                label={t('home', 'yearsExperience')}
                text={t('home', 'yearsExperienceText')}
              />
              <LineItem
                total={fShortenNumber(1000000)}
                label={t('home', 'tilesLaid')}
                text={t('home', 'tilesLaidText')}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

type LineItemProps = {
  total: string;
  label: string;
  text: string;
};

function LineItem({ total, label, text }: LineItemProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      divider={<Divider orientation="vertical" flexItem sx={{ ml: 3, mr: 5 }} />}
    >
      <Stack spacing={1} sx={{ width: 1, maxWidth: 100 }}>
        <Stack direction="row">
          <Typography variant="h2">{total}</Typography>
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            +
          </Typography>
        </Stack>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          {label}
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {text}
      </Typography>
    </Stack>
  );
}
