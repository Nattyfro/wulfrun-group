import Slider from 'react-slick';
import { useRef } from 'react';
// icons
import quotesIcon from '@iconify/icons-carbon/quotes';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Typography, Grid, Container, Stack, Box } from '@mui/material';
// @types
import { TestimonialProps } from '../../../@types/testimonial';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { Image, Iconify, CarouselArrows } from '../../../components';
import cssStyles from '../../../utils/cssStyles';

// ----------------------------------------------------------------------

const TESTIMONIAL_BG =
  'https://youngroofingltd.com/assets/Sambourne/5.jpg';

const RootStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  padding: theme.spacing(10, 0),
  ...cssStyles(theme).bgImage({
    url: TESTIMONIAL_BG,
    startColor: alpha(theme.palette.grey[900], 0.9),
    endColor: alpha(theme.palette.grey[900], 0.78),
  }),
  [theme.breakpoints.up('md')]: {
    position: 'relative',
    padding: theme.spacing(14, 0),
  },
}));

const CarouselArrowsStyle = styled(CarouselArrows)(({ theme }) => ({
  display: 'none',
  '& button': {
    borderRadius: '50%',
    color: theme.palette.primary.main,
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.24)}`,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    bottom:40,
    display: 'block',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  testimonials: TestimonialProps[];
};

export default function TestimonialsTravel({ testimonials }: Props) {
  const { t } = useLocales();
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);

  const carouselSettings = {
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.light',
                fontWeight: 700,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {t('home', 'testimonialsLabel')}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: 'common.white',
                mt: 2,
                mb: 5,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {t('home', 'testimonialsTitle')}
            </Typography>

            <Slider ref={carouselRef} {...carouselSettings}>
              {testimonials.map((testimonial) => (
                <TestimonialItem key={testimonial.id} testimonial={testimonial} />
              ))}
            </Slider>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Image
              alt="Completed roofing project"
              src="https://youngroofingltd.com/assets/Images/Hero4.jpg"
              ratio="3/4"
              disabledEffect
              visibleByDefault
              sx={{
                maxWidth: 360,
                ml: 'auto',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: (theme) => `0 24px 48px ${alpha(theme.palette.common.black, 0.35)}`,
              }}
            />
          </Grid>
        </Grid>

        <CarouselArrowsStyle
          onNext={handleNext}
          onPrevious={handlePrevious}
          sx={{
            mt: 10,
            justifyContent: { xs: 'center', md: 'unset' },
          }}
        />
        
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

type TestimonialItemProps = {
  testimonial: TestimonialProps;
};

function TestimonialItem({ testimonial }: TestimonialItemProps) {
  const { name, review } = testimonial;

  return (
    <Stack
      alignItems={{ xs: 'center', md: 'flex-start' }}
      sx={{ textAlign: { xs: 'center', md: 'left' } }}
    >
      <Iconify
        icon={quotesIcon}
        sx={{ width: 48, height: 48, opacity: 0.72, color: 'primary.light' }}
      />
      <Typography
        sx={{
          mt: 2,
          mb: 5,
          lineHeight: 1.75,
          fontSize: { md: 20 },
          color: 'grey.100',
        }}
      >
        {review}
      </Typography>

      <Stack spacing={1.5} alignItems="center" direction="row">
        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.light', borderRadius: '50%' }} />
        <Typography variant="h6" sx={{ color: 'common.white' }}>
          {name}
        </Typography>
      </Stack>
    </Stack>
  );
}
