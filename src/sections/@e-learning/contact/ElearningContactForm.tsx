import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// config
import { HEADER_DESKTOP_HEIGHT } from '../../../config';
// hooks
import useLocales from '../../../hooks/useLocales';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Alert, Link, Stack, TextField, Typography } from '@mui/material';
// ----------------------------------------------------------------------

const brushFadeMask = 'url(/assets/masks/brush-fade-split.svg)';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(8, 3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: `calc(100vh - ${HEADER_DESKTOP_HEIGHT}px)`,
    padding: 0,
  },
}));

const ImagePanel = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
    flex: '0 0 50vw',
    maxWidth: '50vw',
    minHeight: `calc(100vh - ${HEADER_DESKTOP_HEIGHT}px)`,
  },
}));

const BrushContactImage = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  minHeight: `calc(100vh - ${HEADER_DESKTOP_HEIGHT}px)`,
  objectFit: 'cover',
  objectPosition: 'center',
  WebkitMaskImage: brushFadeMask,
  maskImage: brushFadeMask,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
});

const FormPanel = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 520,
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 'none',
    margin: 0,
    padding: theme.spacing(10, 8),
  },
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

// Public key from Web3Forms — safe to use in the browser.
const WEB3FORMS_ACCESS_KEY = '66d18c61-b34f-4ee3-ba66-7a3fbc82d2b2';

export default function ElearningContactForm() {
  const { t } = useLocales();
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const formSchema = useMemo(
    () =>
      Yup.object().shape({
        fullName: Yup.string().required(t('contact', 'fullNameRequired')),
        email: Yup.string()
          .required(t('contact', 'emailRequired'))
          .email(t('contact', 'emailInvalid')),
        subject: Yup.string().required(t('contact', 'subjectRequired')),
        message: Yup.string().required(t('contact', 'messageRequired')),
      }),
    [t]
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: '',
      subject: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValuesProps) => {
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: data.fullName,
          email: data.email,
          subject: `Wulfrun Contact: ${data.subject}`,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to send email');
      }

      reset();
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email');
    }
  };

  return (
    <RootStyle>
      <ImagePanel>
        <BrushContactImage
          src="/assets/Contact-us.png"
          alt="Contact Wulfrun Group"
          loading="eager"
        />
      </ImagePanel>

      <FormPanel>
        <Stack
          spacing={2}
          sx={{
            mb: 5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h3">{t('contact', 'title')}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('contact', 'subtitle')}</Typography>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5} alignItems="flex-start">
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ width: 1 }}>
                {t('contact', 'successMessage')}
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert severity="error" sx={{ width: 1 }}>
                {errorMessage || t('contact', 'errorMessage')}
              </Alert>
            )}
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('contact', 'fullName')}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('contact', 'email')}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="subject"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('contact', 'subject')}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label={t('contact', 'message')}
                  error={Boolean(error)}
                  helperText={error?.message}
                  sx={{ pb: 2.5 }}
                />
              )}
            />

            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disableElevation
              sx={{
                mx: { xs: 'auto !important', md: 'unset !important' },
                px: 4,
                bgcolor: 'grey.900',
                color: 'common.white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.800',
                },
              }}
            >
              {t('contact', 'send')}
            </LoadingButton>

            <Link
              component={NextLink}
              href="/experiment"
              underline="hover"
              sx={{
                mx: { xs: 'auto', md: 0 },
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {t('contact', 'experiment')}
            </Link>
          </Stack>
        </form>
      </FormPanel>
    </RootStyle>
  );
}
