// icons
import checkmarkIcon from '@iconify/icons-carbon/checkmark';
// @mui
import { Typography, Stack, Box } from '@mui/material';
// @types
import { TourProps } from '../../../@types/travel';
// utils
import { TextIconLabel, Iconify } from '../../../components';

// ----------------------------------------------------------------------

type Props = {
  tour: TourProps;
};

export default function TravelTourDetails({ tour }: Props) {
  const {
    includes,
    description,
  } = tour;

  return (
    <Stack spacing={5}>
      {/* -- Tour Description -- */}
      <section>
        <Typography variant="h4" paragraph>
          Project Description
        </Typography>
        <Typography>{description}</Typography>
      </section>

      {/* -- Tour Includes -- */}
      <section>
        <Typography variant="h4" paragraph>
          Project Includes
        </Typography>

        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
            columnGap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          {includes.map((option) => (
            <TextIconLabel
              key={option.label}
              icon={
                <Iconify
                  icon={checkmarkIcon}
                  sx={{
                    mr: 2,
                    width: 20,
                    height: 20,
                    color: 'primary.main',
                    ...(!option.enabled && { color: 'currentColor' }),
                  }}
                />
              }
              value={option.label}
              sx={{
                ...(!option.enabled && { color: 'text.disabled' }),
              }}
            />
          ))}
        </Box>
      </section>

    </Stack>
  );
}