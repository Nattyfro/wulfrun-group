import { useState } from 'react';
// icons
import contentDeliveryNetwork from '@iconify/icons-carbon/content-delivery-network';
// @mui
import { MenuItem, Box, SxProps, Popover } from '@mui/material';
// hooks
import useLocales from '../hooks/useLocales';
// locales
import { LOCALE_FLAGS, LOCALE_LABELS, Locale, SUPPORTED_LOCALES } from '../locales';
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

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangeLang = (newLang: Locale) => {
    handleClose();
    setLocale(newLang);
  };

  return (
    <>
      <IconButtonAnimate color="inherit" onClick={handleOpen} sx={sx}>
        <Iconify icon={contentDeliveryNetwork} sx={{ width: 20, height: 20 }} />
      </IconButtonAnimate>

      <Popover
        open={Boolean(open)}
        onClose={handleClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { px: 1, width: 220 },
        }}
      >
        {SUPPORTED_LOCALES.map((option) => (
          <MenuItem
            key={option}
            selected={option === locale}
            onClick={() => handleChangeLang(option)}
            sx={{ my: 1 }}
          >
            <Box
              component="img"
              alt={LOCALE_LABELS[option]}
              src={LOCALE_FLAGS[option]}
              sx={{ borderRadius: '50%', width: 28, height: 28, objectFit: 'cover', mr: 1 }}
            />

            {LOCALE_LABELS[option]}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
