import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { m, AnimatePresence } from 'framer-motion';
import { IconifyIcon } from '@iconify/react';
import chartRadar from '@iconify/icons-carbon/chart-radar';
import timeIcon from '@iconify/icons-carbon/time';
import categoryIcon from '@iconify/icons-carbon/category';
import lockedIcon from '@iconify/icons-carbon/locked';
import { Provider } from '@supabase/supabase-js';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// components
import { Iconify } from '../../components';
// lib
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  clearPendingIqResults,
  loadPendingIqResults,
  savePendingIqResults,
} from '../../lib/iqTestStorage';
import { saveIqResultToSupabase } from '../../lib/iqTestResults';
import { getAuthDisplayName } from '../../hooks/useSupabaseAuth';
import { SOCIAL_AUTH_PROVIDERS } from '../../config/socialAuth';

// ----------------------------------------------------------------------

type QuestionCategory = 'Pattern' | 'Numerical' | 'Verbal' | 'Logical' | 'Spatial';

type Question = {
  id: number;
  category: QuestionCategory;
  prompt: string;
  options: string[];
  correctIndex: number;
  visual?: React.ReactNode;
};

const CATEGORY_COLORS: Record<QuestionCategory, 'primary' | 'info' | 'secondary' | 'warning' | 'success'> = {
  Pattern: 'primary',
  Numerical: 'info',
  Verbal: 'secondary',
  Logical: 'warning',
  Spatial: 'success',
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Numerical',
    prompt: 'What number comes next in the sequence?',
    options: ['36', '40', '42', '48'],
    correctIndex: 2,
    visual: <SequenceVisual values={['2', '6', '12', '20', '30', '?']} />,
  },
  {
    id: 2,
    category: 'Verbal',
    prompt: 'Book is to Reading as Fork is to…',
    options: ['Kitchen', 'Eating', 'Metal', 'Spoon'],
    correctIndex: 1,
  },
  {
    id: 3,
    category: 'Pattern',
    prompt: 'Which shape completes the pattern?',
    options: ['Filled circle', 'Hollow circle', 'Filled square', 'Hollow square'],
    correctIndex: 1,
    visual: <AlternatingDots />,
  },
  {
    id: 4,
    category: 'Logical',
    prompt: 'All bloops are razzies. Some razzies are lazzies. Which statement must be true?',
    options: [
      'All lazzies are bloops',
      'Some bloops are lazzies',
      'No bloops are lazzies',
      'None of the above must be true',
    ],
    correctIndex: 3,
  },
  {
    id: 5,
    category: 'Numerical',
    prompt: 'What number comes next?',
    options: ['11', '12', '13', '21'],
    correctIndex: 2,
    visual: <SequenceVisual values={['1', '1', '2', '3', '5', '8', '?']} />,
  },
  {
    id: 6,
    category: 'Spatial',
    prompt: 'Which word looks the same when reflected in a mirror?',
    options: ['DOG', 'MOM', 'CAT', 'SUN'],
    correctIndex: 1,
  },
  {
    id: 7,
    category: 'Numerical',
    prompt: 'If 3 workers finish a task in 6 days, how long would 2 workers take (same pace)?',
    options: ['4 days', '8 days', '9 days', '12 days'],
    correctIndex: 2,
  },
  {
    id: 8,
    category: 'Verbal',
    prompt: 'Which word does not belong with the others?',
    options: ['Piano', 'Violin', 'Flute', 'Canvas'],
    correctIndex: 3,
  },
  {
    id: 9,
    category: 'Pattern',
    prompt: 'Which option completes the matrix?',
    options: ['■', '▲', '●', '◆'],
    correctIndex: 0,
    visual: <ShapeMatrix />,
  },
  {
    id: 10,
    category: 'Logical',
    prompt: 'A bat and ball cost £1.10. The bat costs £1 more than the ball. How much is the ball?',
    options: ['5p', '10p', '50p', '£1'],
    correctIndex: 0,
  },
];

// ----------------------------------------------------------------------

const HeroStyle = styled(Box)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  background: `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.96)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.92
  )} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(5, 4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 5),
  },
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  boxShadow: `0 24px 48px ${alpha(theme.palette.grey[900], 0.08)}`,
  overflow: 'visible',
}));

const OptionCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  border: `1.5px solid ${
    selected ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.16)
  }`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : theme.palette.background.paper,
  boxShadow: selected ? `0 12px 24px ${alpha(theme.palette.primary.main, 0.18)}` : 'none',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'transform', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: selected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.4),
    boxShadow: `0 12px 24px ${alpha(theme.palette.grey[900], 0.08)}`,
  },
}));

const VisualPanel = styled(Box)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  background: `linear-gradient(180deg, ${alpha(theme.palette.grey[500], 0.06)} 0%, ${alpha(
    theme.palette.primary.main,
    0.04
  )} 100%)`,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
  padding: theme.spacing(3),
}));

const ScoreRing = styled(Box)(({ theme }) => ({
  width: 160,
  height: 160,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `conic-gradient(${theme.palette.primary.main} var(--score-deg, 0deg), ${alpha(
    theme.palette.grey[500],
    0.12
  )} 0deg)`,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
  },
}));

// ----------------------------------------------------------------------

function SequenceVisual({ values }: { values: string[] }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
      {values.map((value, index) => (
        <Box
          key={`${value}-${index}`}
          sx={{
            minWidth: 44,
            height: 44,
            px: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.5,
            typography: 'subtitle1',
            fontWeight: 700,
            color: value === '?' ? 'primary.main' : 'text.primary',
            bgcolor: (theme) =>
              value === '?' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.grey[500], 0.08),
          }}
        >
          {value}
        </Box>
      ))}
    </Stack>
  );
}

function AlternatingDots() {
  const dots = ['filled', 'hollow', 'filled', 'hollow', 'filled', 'missing'] as const;

  return (
    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
      {dots.map((dot, index) => (
        <Box
          key={index}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: dot === 'filled' ? 'primary.main' : 'transparent',
            borderStyle: dot === 'missing' ? 'dashed' : 'solid',
            opacity: dot === 'missing' ? 0.45 : 1,
          }}
        />
      ))}
    </Stack>
  );
}

function ShapeMatrix() {
  const shapes = [
    ['●', '■', '▲'],
    ['■', '▲', '●'],
    ['▲', '●', '?'],
  ];

  return (
    <Stack spacing={1} alignItems="center">
      {shapes.map((row, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={1}>
          {row.map((shape, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              sx={{
                width: 52,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.5,
                typography: 'h5',
                color: shape === '?' ? 'primary.main' : 'text.primary',
                bgcolor: (theme) => alpha(theme.palette.grey[500], shape === '?' ? 0.04 : 0.08),
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.grey[500], shape === '?' ? 0.24 : 0.12)}`,
              }}
            >
              {shape}
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().required('Email is required').email('Enter a valid email'),
  consent: Yup.boolean().oneOf([true], 'You must agree to continue'),
});

type SignupValues = {
  fullName: string;
  email: string;
  consent: boolean;
};

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

type Phase = 'intro' | 'quiz' | 'signup' | 'results';

function getIqEstimate(correctCount: number) {
  const estimates = [
    { min: 82, max: 92, label: 'Below average range' },
    { min: 93, max: 104, label: 'Average range' },
    { min: 105, max: 114, label: 'Above average range' },
    { min: 115, max: 124, label: 'High range' },
    { min: 125, max: 135, label: 'Exceptional range' },
  ];

  const index = Math.min(Math.floor(correctCount / 2), estimates.length - 1);
  const estimate = estimates[index];
  const midpoint = Math.round((estimate.min + estimate.max) / 2);

  return { ...estimate, midpoint };
}

// ----------------------------------------------------------------------

export default function IqTest() {
  const theme = useTheme();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [signupError, setSignupError] = useState('');
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<Provider | null>(null);

  const {
    control: signupControl,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
    formState: { isSubmitting: isSigningUp },
  } = useForm<SignupValues>({
    mode: 'onTouched',
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      consent: false,
    },
  });

  const currentQuestion = QUESTIONS[currentIndex];
  const progress =
    phase === 'signup' || phase === 'results'
      ? 100
      : phase === 'quiz'
        ? ((currentIndex + 1) / QUESTIONS.length) * 100
        : 0;

  const correctCount = useMemo(
    () =>
      answers.reduce(
        (total, answer, index) => total + (answer === QUESTIONS[index].correctIndex ? 1 : 0),
        0
      ),
    [answers]
  );

  const iqResult = useMemo(() => getIqEstimate(correctCount), [correctCount]);

  const unlockResults = async (
    answersToUse: number[],
    options: {
      authProvider: string;
      userId?: string | null;
      email?: string | null;
      fullName?: string | null;
    }
  ) => {
    const score = answersToUse.reduce(
      (total, answer, index) => total + (answer === QUESTIONS[index].correctIndex ? 1 : 0),
      0
    );
    const estimate = getIqEstimate(score);

    const saveResult = await saveIqResultToSupabase({
      userId: options.userId ?? null,
      email: options.email ?? null,
      fullName: options.fullName ?? null,
      authProvider: options.authProvider,
      answers: answersToUse,
      score,
      totalQuestions: QUESTIONS.length,
      estimatedIq: estimate.midpoint,
      iqLabel: estimate.label,
    });

    if (!saveResult.saved) {
      console.error('Failed to save IQ result:', saveResult.error);
    }

    setAnswers(answersToUse);
    clearPendingIqResults();
    setPhase('results');
  };

  useEffect(() => {
    if (!router.isReady) return;

    let subscription: { unsubscribe: () => void } | undefined;

    const tryUnlockGoogleResults = async () => {
      const pending = loadPendingIqResults();
      const shouldShowResults = router.query.show === 'results';

      if (!pending && !shouldShowResults) return;
      if (!isSupabaseConfigured) return;

      const supabase = getSupabase();
      if (!supabase) return;

      const unlockIfReady = async () => {
        const currentPending = loadPendingIqResults();
        if (!currentPending) return;

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const authProvider =
          session.user.app_metadata?.provider ||
          session.user.identities?.[0]?.provider ||
          'oauth';

        await unlockResults(currentPending.answers, {
          userId: session.user.id,
          email: session.user.email,
          fullName: getAuthDisplayName(session.user),
          authProvider,
        });

        if (router.query.show) {
          router.replace('/experiment', undefined, { shallow: true });
        }
      };

      await unlockIfReady();

      if (loadPendingIqResults()) {
        const authListener = supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_IN') {
            unlockIfReady();
          }
        });
        subscription = authListener.data.subscription;
      }
    };

    tryUnlockGoogleResults();

    if (router.query.error === 'auth') {
      setSignupError('Google sign-in failed. Please try again.');
      setPhase('signup');
    }

    if (router.query.error === 'supabase') {
      setSignupError('Google sign-in is not configured yet. Use email signup for now.');
      setPhase('signup');
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [router.isReady, router.query.show, router.query.error]);

  const handleOAuthSignIn = async (provider: Provider) => {
    setSignupError('');

    if (!isSupabaseConfigured) {
      setSignupError(
        'Social sign-in is not set up yet. Add your Supabase keys to .env.local, or use email signup.'
      );
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setSignupError('Social sign-in is unavailable right now.');
      return;
    }

    if (answers.length !== QUESTIONS.length) {
      setSignupError('Complete the test before signing in.');
      return;
    }

    setActiveOAuthProvider(provider);

    try {
      savePendingIqResults(answers);

      const redirectTo = `${window.location.origin}/experiment/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      clearPendingIqResults();
      setSignupError(
        error instanceof Error ? error.message : 'Sign-in failed. Please try again.'
      );
      setActiveOAuthProvider(null);
    }
  };

  const handleStart = () => {
    setPhase('quiz');
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;

    const nextAnswers = [...answers, selectedIndex];
    setAnswers(nextAnswers);

    if (currentIndex === QUESTIONS.length - 1) {
      setPhase('signup');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
  };

  const onSignup = async (data: SignupValues) => {
    setSignupError('');

    const score = answers.reduce(
      (total, answer, index) => total + (answer === QUESTIONS[index].correctIndex ? 1 : 0),
      0
    );
    const estimate = getIqEstimate(score);

    try {
      if (!WEB3FORMS_ACCESS_KEY) {
        throw new Error('Email signup is not configured yet.');
      }

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
          subject: 'IQ Challenge signup',
          message: [
            `Name: ${data.fullName}`,
            `Email: ${data.email}`,
            `Score: ${score}/${QUESTIONS.length}`,
            `Estimated IQ: ${estimate.midpoint}`,
            `Range: ${estimate.label}`,
          ].join('\n'),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Signup failed');
      }

      await unlockResults(answers, {
        authProvider: 'email',
        email: data.email,
        fullName: data.fullName,
      });
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setSignupError('');
    setActiveOAuthProvider(null);
    clearPendingIqResults();
    resetSignup();
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={4}>
        <HeroStyle>
          <Stack spacing={1.5}>
            <Chip
              label="Cognitive assessment"
              size="small"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: alpha(theme.palette.common.white, 0.12),
                color: 'common.white',
                fontWeight: 600,
              }}
            />
            <Typography variant="h3">IQ Challenge</Typography>
            <Typography sx={{ color: alpha(theme.palette.common.white, 0.76), maxWidth: 560 }}>
              Ten quick questions across pattern recognition, logic, language, and spatial
              reasoning. Modern, focused, and designed to be completed in about five minutes.
            </Typography>
          </Stack>
        </HeroStyle>

        {phase !== 'intro' && (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {phase === 'results'
                  ? 'Assessment complete'
                  : phase === 'signup'
                    ? 'Sign up to unlock results'
                    : `Question ${currentIndex + 1} of ${QUESTIONS.length}`}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 99,
                bgcolor: alpha(theme.palette.grey[500], 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />
          </Stack>
        )}

        <AnimatePresence>
          {phase === 'intro' && (
            <m.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <QuestionCard sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="h5">Before you begin</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Work through each question at your own pace. There is no time limit, but
                      first instincts often work best on puzzles like these.
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {(
                      [
                        { icon: chartRadar, label: '10 questions' },
                        { icon: timeIcon, label: '~5 minutes' },
                        { icon: categoryIcon, label: '5 skill areas' },
                      ] as { icon: IconifyIcon; label: string }[]
                    ).map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          flex: 1,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.06),
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Iconify icon={item.icon} width={22} sx={{ color: 'primary.main' }} />
                          <Typography variant="subtitle2">{item.label}</Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleStart}
                    sx={{
                      alignSelf: 'flex-start',
                      px: 4,
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Start IQ test
                  </Button>
                </Stack>
              </QuestionCard>
            </m.div>
          )}

          {phase === 'quiz' && currentQuestion && (
            <m.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              <QuestionCard sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={1.5}>
                    <Chip
                      label={currentQuestion.category}
                      color={CATEGORY_COLORS[currentQuestion.category]}
                      size="small"
                      sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                    />
                    <Typography variant="h5">{currentQuestion.prompt}</Typography>
                  </Stack>

                  {currentQuestion.visual && <VisualPanel>{currentQuestion.visual}</VisualPanel>}

                  <Stack spacing={1.5}>
                    {currentQuestion.options.map((option, index) => (
                      <OptionCard
                        key={option}
                        selected={selectedIndex === index}
                        onClick={() => handleSelect(index)}
                        sx={{ p: 2 }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              typography: 'subtitle2',
                              fontWeight: 700,
                              color: selectedIndex === index ? 'primary.main' : 'text.secondary',
                              bgcolor: (muiTheme) =>
                                selectedIndex === index
                                  ? alpha(muiTheme.palette.primary.main, 0.12)
                                  : alpha(muiTheme.palette.grey[500], 0.08),
                            }}
                          >
                            {String.fromCharCode(65 + index)}
                          </Box>
                          <Typography variant="subtitle1">{option}</Typography>
                        </Stack>
                      </OptionCard>
                    ))}
                  </Stack>

                  <Button
                    size="large"
                    variant="contained"
                    disabled={selectedIndex === null}
                    onClick={handleNext}
                    sx={{
                      alignSelf: 'flex-end',
                      px: 4,
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    {currentIndex === QUESTIONS.length - 1 ? 'Finish test' : 'Next question'}
                  </Button>
                </Stack>
              </QuestionCard>
            </m.div>
          )}

          {phase === 'signup' && (
            <m.div
              key="signup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <QuestionCard sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
                        theme.palette.secondary.main,
                        0.08
                      )} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      }}
                    >
                      <Iconify icon={lockedIcon} width={24} sx={{ color: 'primary.main' }} />
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="h5">Your results are ready</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        Create a free account to unlock your IQ score and personalised breakdown.
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack spacing={2.5}>
                    {signupError && <Alert severity="error">{signupError}</Alert>}

                    {SOCIAL_AUTH_PROVIDERS.map((socialProvider) => (
                      <LoadingButton
                        key={socialProvider.id}
                        size="large"
                        variant="outlined"
                        loading={activeOAuthProvider === socialProvider.id}
                        disabled={
                          activeOAuthProvider !== null && activeOAuthProvider !== socialProvider.id
                        }
                        onClick={() => handleOAuthSignIn(socialProvider.id)}
                        startIcon={
                          socialProvider.icon ? (
                            <Iconify icon={socialProvider.icon} width={20} />
                          ) : undefined
                        }
                        sx={{
                          py: 1.4,
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: alpha(theme.palette.grey[500], 0.24),
                          color: 'text.primary',
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.grey[500], 0.06),
                            borderColor: alpha(theme.palette.grey[500], 0.4),
                          },
                        }}
                      >
                        {socialProvider.label}
                      </LoadingButton>
                    ))}

                    <Divider>
                      <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                        or sign up with email
                      </Typography>
                    </Divider>
                  </Stack>

                  <form onSubmit={handleSignupSubmit(onSignup)}>
                    <Stack spacing={2.5} sx={{ mt: 2.5 }}>
                      <Controller
                        name="fullName"
                        control={signupControl}
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
                        control={signupControl}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email address"
                            error={Boolean(error)}
                            helperText={error?.message}
                          />
                        )}
                      />

                      <Controller
                        name="consent"
                        control={signupControl}
                        render={({ field, fieldState: { error } }) => (
                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={(event) => field.onChange(event.target.checked)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  I agree to receive my results and occasional updates from Wulfrun
                                  Group.
                                </Typography>
                              }
                            />
                            {error && (
                              <Typography variant="caption" color="error" sx={{ pl: 1.5 }}>
                                {error.message}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />

                      <LoadingButton
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSigningUp}
                        sx={{
                          alignSelf: 'flex-start',
                          px: 4,
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                      >
                        View my results
                      </LoadingButton>
                    </Stack>
                  </form>
                </Stack>
              </QuestionCard>
            </m.div>
          )}

          {phase === 'results' && (
            <m.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <QuestionCard sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={4} alignItems="center" textAlign="center">
                  <ScoreRing
                    sx={{
                      '--score-deg': `${(correctCount / QUESTIONS.length) * 360}deg`,
                    }}
                  >
                    <Stack spacing={0.25} sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h3">{iqResult.midpoint}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        Estimated IQ
                      </Typography>
                    </Stack>
                  </ScoreRing>

                  <Stack spacing={1}>
                    <Typography variant="h4">
                      {correctCount} / {QUESTIONS.length} correct
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', maxWidth: 480 }}>
                      {iqResult.label}. This is a simplified recreational estimate — not a
                      clinically validated IQ score.
                    </Typography>
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ width: 1 }}
                  >
                    {Object.keys(CATEGORY_COLORS).map((category) => {
                      const categoryQuestions = QUESTIONS.filter((q) => q.category === category);
                      const categoryCorrect = categoryQuestions.reduce((total, question) => {
                        const answerIndex = answers[question.id - 1];
                        return total + (answerIndex === question.correctIndex ? 1 : 0);
                      }, 0);

                      return (
                        <Box
                          key={category}
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.grey[500], 0.06),
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {category}
                          </Typography>
                          <Typography variant="h6">
                            {categoryCorrect}/{categoryQuestions.length}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>

                  <Button
                    size="large"
                    variant="outlined"
                    onClick={handleRetake}
                    sx={{ px: 4, textTransform: 'none', fontWeight: 700 }}
                  >
                    Retake test
                  </Button>
                </Stack>
              </QuestionCard>
            </m.div>
          )}
        </AnimatePresence>
      </Stack>
    </Container>
  );
}
