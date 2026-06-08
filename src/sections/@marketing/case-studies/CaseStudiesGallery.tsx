import { m } from 'framer-motion';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { Image, LightboxModal } from '../../../components';
import { varTranHover } from '../../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  images: string[];
};

export default function TravelTourGallery({ images }: Props) {
  const { t } = useLocales();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = images.findIndex((index) => url === index);

    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <RootStyle>
      <Container>
        <Stack
          spacing={3}
          sx={{
            mb: { xs: 5, md: 7 },
            maxWidth: 560,
            mx: { xs: 'auto', md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {t('home', 'portfolioLabel')}
          </Typography>
          <Typography variant="h2">{t('home', 'portfolioTitle')}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { md: 18 }, lineHeight: 1.8 }}>
            {t('home', 'portfolioDescription')}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <PhotoItem photo={images[0]} onOpenLightbox={() => handleOpenLightbox(images[0])} />

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {images.slice(1, 5).map((photo) => (
              <PhotoItem
                key={photo}
                photo={photo}
                onOpenLightbox={() => handleOpenLightbox(photo)}
              />
            ))}
          </Box>
        </Box>

        <LightboxModal
          images={images}
          mainSrc={images[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        />
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

type PhotoItemProps = {
  photo: string;
  onOpenLightbox: VoidFunction;
};

function PhotoItem({ photo, onOpenLightbox }: PhotoItemProps) {
  return (
    <m.div
      whileHover="hover"
      variants={{
        hover: { opacity: 0.8 },
      }}
      transition={varTranHover()}
    >
      <Image
        alt="photo"
        src={photo}
        ratio="1/1"
        onClick={onOpenLightbox}
        sx={{
          borderRadius: 3,
          cursor: 'pointer',
          overflow: 'hidden',
          boxShadow: (theme) => `0 16px 32px ${alpha(theme.palette.grey[900], 0.12)}`,
        }}
      />
    </m.div>
  );
}
