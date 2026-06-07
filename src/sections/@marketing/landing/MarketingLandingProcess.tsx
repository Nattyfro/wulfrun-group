import directionStraightRight from '@iconify/icons-carbon/direction-straight-right';
import taskIcon from '@iconify/icons-carbon/task';
import documentIcon from '@iconify/icons-carbon/document';
import buildingIcon from '@iconify/icons-carbon/building';
import checkmarkFilled from '@iconify/icons-carbon/checkmark-filled';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Stack, Container, Typography, Card, Box } from '@mui/material';
// components
import { Iconify } from '../../../components';

// ----------------------------------------------------------------------

const SERVICES = [
  {
    name: 'Survey',
    description: 'We assess your roof, discuss requirements, and provide honest advice.',
    icon: taskIcon,
  },
  {
    name: 'Quote',
    description: 'You receive a clear, detailed quote with no hidden surprises.',
    icon: documentIcon,
  },
  {
    name: 'Installation',
    description: 'Our skilled team completes the work safely, cleanly, and on schedule.',
    icon: buildingIcon,
  },
  {
    name: 'Completion',
    description: 'We inspect everything, tidy the site, and leave you with total peace of mind.',
    icon: checkmarkFilled,
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 0),
  },
}));

// ----------------------------------------------------------------------

export default function MarketingLandingProcess() {
  return (
    <RootStyle>
      <Container>
        <Stack
          sx={{
            maxWidth: 560,
            mb: { xs: 6, md: 8 },
            mx: { xs: 'auto', md: 'unset' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Work Flow
          </Typography>

          <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
            Working Process
          </Typography>

          <Typography sx={{ color: 'text.secondary', fontSize: { md: 18 }, lineHeight: 1.8 }}>
            We have developed a highly efficient procedure to ensure that your roof is completed as
            seamlessly as possible. Our process is designed to minimise disruption and maximise
            satisfaction, resulting in a stress-free experience for you.
          </Typography>
        </Stack>

        <Box
          sx={{
            alignItems: 'stretch',
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {SERVICES.map((service, index) => (
            <ServiceItem key={service.name} service={service} index={index} />
          ))}
        </Box>
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

type ServiceItemProps = {
  service: {
    name: string;
    description: string;
    icon: typeof taskIcon;
  };
  index: number;
};

function ServiceItem({ service, index }: ServiceItemProps) {
  const { name, description, icon } = service;

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        height: 1,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.grey[500], 0.08)}`,
        transition: (theme) =>
          theme.transitions.create(['transform', 'box-shadow'], { duration: theme.transitions.duration.shorter }),
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.grey[500], 0.14)}`,
        },
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 56,
          height: 56,
          mb: 3,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          color: 'primary.main',
        }}
      >
        <Iconify icon={icon} sx={{ width: 28, height: 28 }} />
      </Stack>

      <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        Step {index + 1}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 1.5, typography: 'h5' }}>
        {name}
        {index !== SERVICES.length - 1 && (
          <Iconify icon={directionStraightRight} sx={{ width: 20, height: 20, color: 'text.disabled' }} />
        )}
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Card>
  );
}
