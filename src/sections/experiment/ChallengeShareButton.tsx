import { useState } from 'react';
import shareIcon from '@iconify/icons-carbon/share';
import chatIcon from '@iconify/icons-carbon/chat';
import copyIcon from '@iconify/icons-carbon/copy';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Alert,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
// components
import { Iconify } from '../../components';

// ----------------------------------------------------------------------

type Props = {
  score?: number;
  totalQuestions?: number;
  estimatedIq?: number;
  size?: 'medium' | 'large';
  fullWidth?: boolean;
};

function buildShareMessage(score?: number, totalQuestions?: number, estimatedIq?: number) {
  if (
    score !== undefined &&
    totalQuestions !== undefined &&
    estimatedIq !== undefined
  ) {
    return `I scored ${score}/${totalQuestions} on the Wulfrun IQ Challenge (est. IQ ${estimatedIq}). Think your construction mates can beat that?`;
  }

  return 'Think your construction mates can beat you? Take the Wulfrun IQ Challenge — 10 quick questions, about 5 minutes.';
}

export default function ChallengeShareButton({
  score,
  totalQuestions,
  estimatedIq,
  size = 'large',
  fullWidth = false,
}: Props) {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState('');

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '/experiment';
    return `${window.location.origin}/experiment`;
  };

  const getShareText = () => buildShareMessage(score, totalQuestions, estimatedIq);

  const handlePrimaryClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const url = getShareUrl();
    const text = getShareText();

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Wulfrun IQ Challenge',
          text,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }

    setMenuAnchor(event.currentTarget);
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    const text = `${getShareText()} ${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setSnackbar('Copied — paste it to your construction buddies!');
    } catch {
      setSnackbar('Could not copy. Try WhatsApp instead.');
    }

    setMenuAnchor(null);
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const text = `${getShareText()} ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setMenuAnchor(null);
  };

  return (
    <>
      <Button
        size={size}
        variant="contained"
        fullWidth={fullWidth}
        onClick={handlePrimaryClick}
        startIcon={<Iconify icon={shareIcon} width={20} />}
        sx={{
          px: 3,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.24)}`,
        }}
      >
        Challenge your construction buddies
      </Button>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: { width: 280, mt: 1 },
        }}
      >
        <MenuItem onClick={handleWhatsApp}>
          <ListItemIcon>
            <Iconify icon={chatIcon} width={22} sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText primary="Share on WhatsApp" secondary="Perfect for the group chat" />
        </MenuItem>
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <Iconify icon={copyIcon} width={22} />
          </ListItemIcon>
          <ListItemText primary="Copy message & link" secondary="Paste anywhere you like" />
        </MenuItem>
      </Menu>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar('')} sx={{ width: '100%' }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </>
  );
}
