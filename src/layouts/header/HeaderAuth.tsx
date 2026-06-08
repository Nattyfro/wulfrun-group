import { useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
// hooks
import useSupabaseAuth, { getAuthAvatarUrl, getAuthDisplayName } from '../../hooks/useSupabaseAuth';
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

type Props = {
  onDark?: boolean;
};

const UserChip = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 0.5, 0.5, 0.75),
  borderRadius: 999,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
  backgroundColor: alpha(theme.palette.grey[500], 0.06),
}));

export default function HeaderAuth({ onDark = false }: Props) {
  const { t } = useLocales();
  const isMobile = useResponsive('only', 'xs');
  const { user, loading, signOut, isConfigured } = useSupabaseAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!isConfigured || loading || !user) {
    return null;
  }

  const displayName = getAuthDisplayName(user);
  const avatarUrl = getAuthAvatarUrl(user);
  const textColor = onDark ? 'common.white' : 'text.primary';
  const subtextColor = onDark ? 'rgba(255,255,255,0.72)' : 'text.secondary';

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  if (isMobile) {
    return (
      <>
        <IconButton onClick={openMenu} sx={{ p: 0.25 }}>
          <Avatar src={avatarUrl || undefined} alt={displayName} sx={{ width: 30, height: 30 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, maxWidth: 220 }}>
            <Typography variant="subtitle2" noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleSignOut}>{t('header', 'signOut')}</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <UserChip
        direction="row"
        spacing={1}
        alignItems="center"
        onClick={openMenu}
        sx={{
          cursor: 'pointer',
          borderColor: onDark ? alpha('#fff', 0.24) : undefined,
          bgcolor: onDark ? alpha('#fff', 0.08) : undefined,
        }}
      >
        <Avatar src={avatarUrl || undefined} alt={displayName} sx={{ width: 32, height: 32 }}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ pr: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ color: subtextColor, display: 'block', lineHeight: 1.2 }}
          >
            {t('header', 'signedIn')}
          </Typography>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: textColor, maxWidth: 140, lineHeight: 1.2 }}
          >
            {displayName}
          </Typography>
        </Box>
      </UserChip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, maxWidth: 260 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleSignOut}>{t('header', 'signOut')}</MenuItem>
      </Menu>
    </>
  );
}
