import directionStraightRight from '@iconify/icons-carbon/direction-straight-right';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Stack, Container, Typography, Button, Divider } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
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
              About Us
            </Typography>

            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              Who Are We
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              We are are a family-run business passionate about delivering the highest quality of
              roofing services to our valued customers. Our commitment to customer satisfaction and
              excellence in customer service is what sets us apart from other roofers in the area.
            </Typography>

            <Button size="large" endIcon={<Iconify icon={directionStraightRight} />} href={Routes.componentsUI} sx={{ mt: 5 }}>
              Learn more
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={5}>
              <LineItem
                total={fShortenNumber(2000)}
                label="Happy clients"
                text="Our clients are always left feeling satisfied with the quality of our work, and with over 2000 happy customers, it's no wonder why!"
              />
              <LineItem
                total="30"
                label="years of experience"
                text="We've been in the roofing for over 30 years and with that kind of experience, you can be sure that we know what we're doing!"
              />
              <LineItem
                total={fShortenNumber(1000000)}
                label="Tiles Laid"
                text="We've laid down over a million tiles and counting! Whether it's a single house or an entire complex, you can be sure that we're the best in the business."
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
