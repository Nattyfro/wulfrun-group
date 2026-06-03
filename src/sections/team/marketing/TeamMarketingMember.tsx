import { m } from 'framer-motion';
// @mui
import { Typography, Box } from '@mui/material';
// @types
import { TeamMemberProps } from '../../../@types/team';
// components
import { Image, SocialsButton, BgOverlay } from '../../../components';
import { varHover, varTranHover } from '../../../components/animate';

// ----------------------------------------------------------------------

type TeamMarketingMemberProps = {
  member: TeamMemberProps;
};

export default function TeamMarketingMember({ member }: TeamMarketingMemberProps) {
  const { name, role, photo} = member;

  return (
    <div>
      <Box
        component={m.div}
        whileHover="hover"
        sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}
      >

          <Image src={photo} alt={name} ratio="3/4" />
      </Box>

      <Typography variant="h6" sx={{ mt: 2.5, mb: 0.5, textAlign: 'center' }}>
        {name}
      </Typography>
      <Typography variant="body3" sx={{ color: 'text.disabled', textAlign: 'center' }}>
        {role}
      </Typography>
    </div>
  );
}
