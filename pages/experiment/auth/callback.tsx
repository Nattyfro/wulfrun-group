import { useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import { Box, CircularProgress, Typography } from '@mui/material';
// lib
import { getSupabase, isSupabaseConfigured } from '../../../src/lib/supabase';

// ----------------------------------------------------------------------

const RESULTS_REDIRECT = '/experiment?show=results';

export default function ExperimentAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      router.replace('/experiment?error=supabase');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      router.replace('/experiment?error=supabase');
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let subscription: { unsubscribe: () => void } | undefined;

    const goToResults = () => {
      router.replace(RESULTS_REDIRECT);
    };

    const finishSignIn = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        goToResults();
        return;
      }

      const authListener = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          authListener.data.subscription.unsubscribe();
          clearTimeout(timeoutId);
          goToResults();
        }
      });

      subscription = authListener.data.subscription;

      timeoutId = setTimeout(() => {
        subscription?.unsubscribe();
        router.replace('/experiment?error=auth');
      }, 12000);
    };

    finishSignIn();

    return () => {
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 3,
      }}
    >
      <CircularProgress />
      <Typography sx={{ color: 'text.secondary' }}>
        Signing you in — taking you back to your results...
      </Typography>
    </Box>
  );
}
