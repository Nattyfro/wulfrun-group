// @mui
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
// components
import { PlayerWithImage } from '../../../components';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5),
  },
}));

export default function MarketingAboutOurVision() {
  return (
    <>
      <RootStyle>
        <Container sx={{ position: 'relative' }}>
          <Box
            sx={{
              borderRadius: 5,
              boxShadow: (theme) => theme.customShadows.z24,
            }}
          >
            <PlayerWithImage
              imgPath="https://youngroofingltd.com/assets/Movies/Images/Thumbnail.png"
              videoPath={"https://www.youtube.com/embed/eAgAnhkVvhE"}
            />
          </Box>
        </Container>
      </RootStyle>
    </>
  );
}
