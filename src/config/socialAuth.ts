import { Provider } from '@supabase/supabase-js';
import { IconifyIcon } from '@iconify/react';
import logoGoogle from '@iconify/icons-carbon/logo-google';
import logoFacebook from '@iconify/icons-carbon/logo-facebook';

// ----------------------------------------------------------------------

export type SocialAuthProvider = {
  id: Provider;
  label: string;
  icon?: IconifyIcon;
  /** Shown in UI when Supabase provider still needs dashboard setup */
  setupHint: string;
};

/** Providers Supabase supports out of the box — enable each in Supabase → Authentication → Providers */
export const SOCIAL_AUTH_PROVIDERS: SocialAuthProvider[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: logoGoogle,
    setupHint: 'Supabase → Authentication → Providers → Google',
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    icon: logoFacebook,
    setupHint: 'Supabase → Authentication → Providers → Facebook',
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    setupHint: 'Supabase → Authentication → Providers → Apple',
  },
];
