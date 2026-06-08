import { useRef } from 'react';
import Slider from 'react-slick';
import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  List,
  ListItem,
  BoxProps,
  ListItemProps,
  ListSubheader,
  ListSubheaderProps,
  Button,
  Stack,
} from '@mui/material';
// config
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// hooks
import useLocales from '../../hooks/useLocales';
// @types
import { NavDesktopMenuProps } from '../../@types/layout';
//
import { Image, CarouselDots, Iconify } from '../../components';
import { DialogAnimate, MotionContainer, varFade } from '../../components/animate';
import launchIcon from '@iconify/icons-carbon/launch';
import Routes from '../../routes';

// ----------------------------------------------------------------------

interface SubLinkStyleProps extends ListItemProps {
  active?: boolean;
}

interface IconBulletStyleProps extends BoxProps {
  active?: boolean;
}

const SubLinkStyle = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<SubLinkStyleProps>(({ active, theme }) => ({
  ...theme.typography.body3,
  padding: 0,
  width: 'auto',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color'),
  '&:hover': {
    color: theme.palette.text.primary,
  },
  ...(active && {
    ...theme.typography.subtitle3,
    color: theme.palette.text.primary,
  }),
}));

const ListSubheaderStyled = styled((props: ListSubheaderProps) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.h5,
  marginBottom: theme.spacing(2.5),
  color: theme.palette.text.primary,
}));

// ----------------------------------------------------------------------

export default function NavDesktopMenu({
  lists,
  isOpen,
  onClose,
  isScrolling,
}: NavDesktopMenuProps) {
  const { t } = useLocales();
  const theme = useTheme();

  const carouselRef = useRef<Slider | null>(null);

  const carouselList = lists.filter((list) => list.subheader !== 'Common');

  const carouselSettings = {
    arrows: false,
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots(),
  };


  return (
    <DialogAnimate
      hideBackdrop
      maxWidth={false}
      open={isOpen}
      onClose={onClose}
      variants={
        varFade({
          distance: 80,
          durationIn: 0.16,
          durationOut: 0.24,
          easeIn: 'easeIn',
          easeOut: 'easeOut',
        }).inRight
      }
      PaperProps={{
        sx: {
          m: 0,
          maxWidth: 1,
          position: 'absolute',
          borderRadius: '0 !important',
          top: isScrolling ? HEADER_DESKTOP_HEIGHT - 20 : HEADER_DESKTOP_HEIGHT,
          // Fix scroll on window
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        },
      }}
    >
      <Grid container columns={12} spacing={0}>
        <Grid item xs={12}>
          <Stack sx={{ position: 'relative', px: 2, py: 6 }}>
            <Box>
            <Slider ref={carouselRef} {...carouselSettings}>
              {carouselList.map((list) => {
                const { subheader, items, cover } = list;

                const path = items.length > 0 ? items[0].path : '';

                return (
                  <List key={subheader} disablePadding sx={{ px: 2 }} component={MotionContainer}>
                    <m.div variants={varFade({ distance: 80 }).inLeft}>
                      <ListSubheaderStyled>{subheader}</ListSubheaderStyled>
                    </m.div>

                    <NextLink href={path} passHref>
                      <Box
                        component={m.a}
                        variants={varFade({ distance: 80 }).inLeft}
                        sx={{ display: 'block' }}
                      >
                        <Image
                          alt={cover}
                          src={cover}
                          sx={{
                            mb: 2.5,
                            width: '300px',
                            height: '180px',
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            transition: theme.transitions.create('opacity'),
                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                            '&:hover': { opacity: 0.8 },
                          }}
                        />
                      </Box>
                    </NextLink>
                  </List>
                );
              })}
            </Slider>
            </Box>
            
            <Box alignItems="center"
        justifyContent="center" display="flex" sx={{py:3}}>
          <Button
                size="large"
                variant="contained"
                endIcon={<Iconify icon={launchIcon} />}
                href={Routes.marketing.caseStudies}
                color="inherit"
              >
                {t('nav', 'viewAllProjects')}
              </Button>
              </Box>
          </Stack>
        </Grid>
      </Grid>
    </DialogAnimate>
  );
}


