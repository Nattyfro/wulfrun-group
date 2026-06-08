import Slider from 'react-slick';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Typography, Stack, Container, Box } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// @types
import { BrandProps } from '../../../@types/brand';

// ----------------------------------------------------------------------

const RootStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  brands: BrandProps[];
};

export default function CustomerElearning({ brands }: Props) {
  const { t } = useLocales();
  const theme = useTheme();

  const carouselSettings = {
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <RootStyle>
      <Container>
        <Stack spacing={3} sx={{ mb: 8, mx: 'auto', maxWidth: 640, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {t('home', 'partnersLabel')}
          </Typography>
          <Typography variant="h2">{t('home', 'partnersTitle')}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { md: 18 }, lineHeight: 1.8 }}>
            {t('home', 'partnersDescription')}
          </Typography>
        </Stack>

        <Slider {...carouselSettings}>
          {brands.map((brand) => (
            <Box key={brand.id} sx={{ px: 2, py: 1 }}>
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.grey[500], 0.08)}`,
                  transition: (theme) =>
                    theme.transitions.create('box-shadow', { duration: theme.transitions.duration.shorter }),
                  '&:hover': {
                    boxShadow: (theme) => `0 14px 28px ${alpha(theme.palette.grey[500], 0.12)}`,
                  },
                }}
              >
                <Box
                  component="img"
                  alt={brand.name}
                  src={brand.image}
                  loading="eager"
                  sx={{
                    width: { xs: 160, sm: 200, md: 220 },
                    height: { xs: 48, sm: 56, md: 64 },
                    mx: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Slider>
      </Container>
    </RootStyle>
  );
}
