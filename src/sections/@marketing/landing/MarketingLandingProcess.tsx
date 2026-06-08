import directionStraightRight from '@iconify/icons-carbon/direction-straight-right';
import taskIcon from '@iconify/icons-carbon/task';
import documentIcon from '@iconify/icons-carbon/document';
import buildingIcon from '@iconify/icons-carbon/building';
import checkmarkFilled from '@iconify/icons-carbon/checkmark-filled';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Stack, Container, Typography, Card, Box } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { Iconify } from '../../../components';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 0),
  },
}));

// ----------------------------------------------------------------------

export default function MarketingLandingProcess() {
  const { t } = useLocales();

  const services = [
    {
      name: t('home', 'survey'),
      description: t('home', 'surveyDescription'),
      icon: taskIcon,
    },
    {
      name: t('home', 'quote'),
      description: t('home', 'quoteDescription'),
      icon: documentIcon,
    },
    {
      name: t('home', 'installation'),
      description: t('home', 'installationDescription'),
      icon: buildingIcon,
    },
    {
      name: t('home', 'completion'),
      description: t('home', 'completionDescription'),
      icon: checkmarkFilled,
    },
  ];

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
            {t('home', 'processLabel')}
          </Typography>

          <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
            {t('home', 'processTitle')}
          </Typography>

          <Typography sx={{ color: 'text.secondary', fontSize: { md: 18 }, lineHeight: 1.8 }}>
            {t('home', 'processDescription')}
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
          {services.map((service, index) => (
            <ServiceItem
              key={service.name}
              service={service}
              index={index}
              total={services.length}
              stepLabel={t('home', 'step')}
            />
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
  total: number;
  stepLabel: string;
};

function ServiceItem({ service, index, total, stepLabel }: ServiceItemProps) {
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
        {stepLabel} {index + 1}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 1.5, typography: 'h5' }}>
        {name}
        {index !== total - 1 && (
          <Iconify icon={directionStraightRight} sx={{ width: 20, height: 20, color: 'text.disabled' }} />
        )}
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Card>
  );
}
