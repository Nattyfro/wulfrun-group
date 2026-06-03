import Slider from 'react-slick';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Stack, Container } from '@mui/material';
// @types
import { BrandProps } from '../../../@types/brand';
// components
import { SvgIconStyle } from '../../../components';

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
  const theme = useTheme();

  const carouselSettings = {
    arrows: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 4 },
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
        <Stack spacing={3} sx={{ mb: 8, mx: 'auto', maxWidth: 600, textAlign: 'center' }}>
          <Typography variant="h2">We Work With</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
          Over the years we have built up a collection of creditable building contracts, feel free to contact them and ask about our workmanship
          </Typography>
        </Stack>

        <Slider {...carouselSettings}>
          {brands.map((brand) => (
            <SvgIconStyle key={brand.id} src={brand.image} sx={{ width: 106, height: 32 }} />
          ))}
        </Slider>
      </Container>
    </RootStyle>
  );
}
