import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Grid, Stack, TextField, Container, Typography } from '@mui/material';
// components
import { Image } from '../../../components';
import axios from 'axios';

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

const requestOptions = {
  action:"https://formsubmit.co/myleslewisyoung@gmail.com",
  method:"POST"
};

export default function ElearningContactForm() {
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    // alert(JSON.stringify(data, null, 2));
 
    const response = await fetch('https://formsubmit.io/send/a94ccae7-be6b-4f03-b342-8759974fa02b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      console.log('Email sent successfully');
      // Reset the form fields here if needed
    } else {
      console.error('Failed to send email');
      // Handle the error condition here
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

            <form
              onSubmit={handleSubmit(onSubmit)}
            >
              <Stack spacing={2.5} alignItems="flex-start">
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
                  color='error'
                  sx={{
                    mx: { xs: 'auto !important', md: 'unset !important' },
                  }}
                >
                  Unavaiable
                </LoadingButton>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
