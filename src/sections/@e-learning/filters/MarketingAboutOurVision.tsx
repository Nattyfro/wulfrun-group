// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// components
import { PlayerWithImage } from '../../../components';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0),
  },
}));

interface Props {
  video: string;
  coverImg: string;
}

export default function MarketingAboutOurVision({ video, coverImg }: Props) {
  return (
    <>
      <RootStyle>
        <Box
          sx={{
            borderRadius: 5,
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          <PlayerWithImage
            imgPath={coverImg}
            videoPath={video}
          />
        </Box>
      </RootStyle>
    </>
  );
}
