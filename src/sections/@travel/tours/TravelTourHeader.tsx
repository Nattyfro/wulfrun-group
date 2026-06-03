import { Typography, Stack } from '@mui/material';
// @types
import { TourProps } from '../../../@types/travel';
// components

// ----------------------------------------------------------------------

type Props = {
  tour: TourProps;
};

export default function TravelTourHeader({ tour }: Props) {
  const { slug } = tour;

  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        mt: { xs:3, md:5},
        mb: { xs: 3, md: 5 },
      }}
    >
      <Typography variant="h3" component="h1">
        {slug}
      </Typography>
    </Stack>
  );
}
