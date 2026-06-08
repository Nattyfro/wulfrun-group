import { useMemo, useState } from 'react';
// icons
import checkmark from '@iconify/icons-carbon/checkmark';
import search from '@iconify/icons-carbon/search';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  InputAdornment,
  MenuItem,
  Stack,
  SxProps,
  TextField,
  Typography,
  Popover,
} from '@mui/material';
// hooks
import useLocales from '../hooks/useLocales';
// locales
import {
  filterLocales,
  LOCALE_EMOJIS,
  LOCALE_LABELS,
  LOCALE_NATIVE_LABELS,
  Locale,
} from '../locales';
// components
import { Iconify } from '../components';
import { IconButtonAnimate } from '../components/animate';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps;
};

export default function LanguagePopover({ sx }: Props) {
  const theme = useTheme();
  const { locale, setLocale } = useLocales();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocales = useMemo(() => filterLocales(searchQuery), [searchQuery]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    setSearchQuery('');
  };

  const handleChangeLang = (newLang: Locale) => {
    handleClose();
    setLocale(newLang);
  };

  return (
    <>
      <IconButtonAnimate
        color="inherit"
        onClick={handleOpen}
        aria-label="Select language"
        sx={{
          ...sx,
          width: 40,
          height: 40,
        }}
      >
        <Box component="span" role="img" aria-hidden sx={{ fontSize: 22, lineHeight: 1 }}>
          {LOCALE_EMOJIS[locale]}
        </Box>
      </IconButtonAnimate>

      <Popover
        open={Boolean(open)}
        onClose={handleClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            py: 1,
            px: 0.5,
            borderRadius: 2,
            boxShadow: `0 8px 24px ${alpha(theme.palette.grey[900], 0.12)}`,
            border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 0.75,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            fontSize: '0.65rem',
          }}
        >
          Language
        </Typography>

        <TextField
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search e.g. Hrvatski, Bosanski, Español..."
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={search} sx={{ width: 18, height: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            px: 1,
            mb: 0.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.grey[500], 0.06),
              '& fieldset': {
                borderColor: alpha(theme.palette.grey[500], 0.16),
              },
            },
          }}
        />

        <Box
          sx={{
            maxHeight: 320,
            overflowY: 'auto',
            px: 0.5,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 3,
              bgcolor: alpha(theme.palette.grey[500], 0.24),
            },
          }}
        >
          {filteredLocales.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ px: 1.5, py: 2, color: 'text.secondary', textAlign: 'center' }}
            >
              No languages found
            </Typography>
          ) : (
            filteredLocales.map((option) => {
              const isSelected = option === locale;
              const nativeLabel = LOCALE_NATIVE_LABELS[option];
              const englishLabel = LOCALE_LABELS[option];

              return (
                <MenuItem
                  key={option}
                  selected={isSelected}
                  onClick={() => handleChangeLang(option)}
                  sx={{
                    mx: 0.5,
                    my: 0.25,
                    py: 1.25,
                    px: 1.5,
                    borderRadius: 1.5,
                    gap: 1.5,
                    minHeight: 48,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.grey[500], 0.08),
                    },
                  }}
                >
                  <Box
                    component="span"
                    role="img"
                    aria-hidden
                    sx={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      lineHeight: 1,
                    }}
                  >
                    {LOCALE_EMOJIS[option]}
                  </Box>

                  <Stack flex={1} spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: 'text.primary',
                        lineHeight: 1.3,
                      }}
                    >
                      {nativeLabel}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        letterSpacing: 0.5,
                        lineHeight: 1.2,
                      }}
                    >
                      {englishLabel} · {option.toUpperCase()}
                    </Typography>
                  </Stack>

                  {isSelected && (
                    <Iconify
                      icon={checkmark}
                      sx={{ width: 18, height: 18, color: 'primary.main', flexShrink: 0 }}
                    />
                  )}
                </MenuItem>
              );
            })
          )}
        </Box>
      </Popover>
    </>
  );
}
