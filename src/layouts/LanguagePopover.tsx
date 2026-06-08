import { useMemo, useState } from 'react';
// icons
import checkmark from '@iconify/icons-carbon/checkmark';
import search from '@iconify/icons-carbon/search';
import translate from '@iconify/icons-carbon/translate';
// @mui
import {
  alpha,
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
      <IconButtonAnimate color="inherit" onClick={handleOpen} sx={sx}>
        <Iconify icon={translate} sx={{ width: 20, height: 20 }} />
      </IconButtonAnimate>

      <Popover
        open={Boolean(open)}
        onClose={handleClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            p: 1,
            width: 280,
            borderRadius: 2,
            border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            boxShadow: (theme) => `0 12px 40px ${alpha(theme.palette.grey[900], 0.16)}`,
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            px: 1.5,
            pt: 0.5,
            pb: 1,
            color: 'text.disabled',
            letterSpacing: 1.2,
          }}
        >
          Language
        </Typography>

        <TextField
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search e.g. Español, Polski, العربية..."
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
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06),
              '& fieldset': {
                borderColor: (theme) => alpha(theme.palette.grey[500], 0.16),
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
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            },
          }}
        >
        {filteredLocales.length === 0 ? (
          <Typography variant="body2" sx={{ px: 1.5, py: 2, color: 'text.secondary', textAlign: 'center' }}>
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
                  px: 1.5,
                  py: 1.25,
                  mb: 0.5,
                  borderRadius: 1.5,
                  '&:last-of-type': { mb: 0 },
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: 22,
                      lineHeight: 1,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      flexShrink: 0,
                    }}
                  >
                    {LOCALE_EMOJIS[option]}
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {nativeLabel}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {englishLabel} · {option.toUpperCase()}
                    </Typography>
                  </Box>

                  {isSelected && (
                    <Iconify
                      icon={checkmark}
                      sx={{ width: 18, height: 18, color: 'primary.main', flexShrink: 0 }}
                    />
                  )}
                </Stack>
              </MenuItem>
            );
          })
        )}
        </Box>
      </Popover>
    </>
  );
}
