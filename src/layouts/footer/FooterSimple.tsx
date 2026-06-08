// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';
// components
import { Logo } from '../../components';

// ----------------------------------------------------------------------

export default function FooterSimple() {
  const { t } = useLocales();

  return (
    <Container sx={{ textAlign: 'center', py: 8 }}>
      <Logo isSimple sx={{ mb: 3 }} />
      <Typography variant="body3" sx={{ color: 'text.secondary' }}>
        {t('footer', 'copyright')}
      </Typography>
    </Container>
  );
}
