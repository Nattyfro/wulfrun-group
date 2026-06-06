import { useState } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Alert, Grid, Stack, TextField, Container, Typography } from '@mui/material';
// components
import { Image } from '../../../components';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().required('Email is required').email('That is not an email'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
});

type FormValuesProps = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_EMAIL = 'myleslewisyoung@gmail.com';

function isFormSubmitSuccess(success: unknown) {
  return success === true || success === 'true';
}

export default function ElearningContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
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
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          _replyto: data.email,
          subject: data.subject,
          message: data.message,
          _subject: `Wulfrun Contact: ${data.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = await response.json();

      if (!isFormSubmitSuccess(result.success)) {
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
      <Container>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Image
              alt="contact"
              src="https://zone-assets-api.vercel.app/assets/illustrations/illustration_courses_contact.svg"
              sx={{ maxWidth: 260 }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Stack
              spacing={2}
              sx={{
                mb: 5,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography variant="h3">Drop Us A Line</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                We normally respond within 24 hours
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5} alignItems="flex-start">
                {submitStatus === 'success' && (
                  <Alert severity="success" sx={{ width: 1 }}>
                    Message sent. We&apos;ll get back to you soon.
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert severity="error" sx={{ width: 1 }}>
                    {errorMessage || 'Something went wrong. Please try again.'}
                  </Alert>
                )}
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full name"
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
                      label="Email"
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
                      label="Subject"
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
                      label="Message"
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
                  Send
                </LoadingButton>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
