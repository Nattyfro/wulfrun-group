import { useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import { Box, CircularProgress, Typography } from '@mui/material';
// lib
import { getSupabase, isSupabaseConfigured } from '../../../src/lib/supabase';

// ----------------------------------------------------------------------

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

    const finishSignIn = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace('/experiment');
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          subscription.unsubscribe();
          clearTimeout(timeoutId);
          router.replace('/experiment');
        }
      });

      timeoutId = setTimeout(() => {
        subscription.unsubscribe();
        router.replace('/experiment?error=auth');
      }, 12000);
    };

    finishSignIn();

    return () => {
      clearTimeout(timeoutId);
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
      <Typography sx={{ color: 'text.secondary' }}>Signing you in with Google...</Typography>
    </Box>
  );
}
