// @mui
import { styled } from '@mui/material/styles';
import { Typography, Container, Stack, Button, Box } from '@mui/material';
// @types
import { TeamMemberProps } from '../../../@types/team';
//
import TeamElearningMember from './TeamElearningMember';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  members: TeamMemberProps[];
};

export default function TeamElearningLanding({ members }: Props) {
  return (
    <RootStyle>
      <Container>
        <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h2">Meet Our Team</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
          We pride ourselves on creating a competent, efficient team so that your building requirements are met to a high-quality standard.
          </Typography>
        </Stack>

        <Box
          sx={{
            py: { xs: 8, md: 10 },
            display: 'grid',
            gap: { xs: 4, md: 3 },
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {members.map((member) => (
            <TeamElearningMember key={member.id} member={member} />
          ))}
        </Box>

        <Button variant="outlined" size="large" color="inherit">
          View All Teachers
        </Button>
      </Container>
    </RootStyle>
  );
}
