import { useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { IconifyIcon } from '@iconify/react';
import chartRadar from '@iconify/icons-carbon/chart-radar';
import userMultiple from '@iconify/icons-carbon/user-multiple';
import trophy from '@iconify/icons-carbon/trophy';
import activity from '@iconify/icons-carbon/activity';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Alert,
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
// components
import { Iconify } from '../../components';
// lib
import { fetchIqResults, IqTestResult } from '../../lib/iqTestResults';

// ----------------------------------------------------------------------

const HeroStyle = styled(Box)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  background: `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.96)} 0%, ${alpha(
    theme.palette.secondary.dark,
    0.9
  )} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(5, 4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 5),
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  boxShadow: `0 16px 32px ${alpha(theme.palette.grey[900], 0.06)}`,
  padding: theme.spacing(3),
  height: '100%',
}));

const ResultCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  boxShadow: `0 12px 24px ${alpha(theme.palette.grey[900], 0.05)}`,
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.grey[900], 0.08)}`,
  },
}));

// ----------------------------------------------------------------------

type StatItem = {
  label: string;
  value: string;
  icon: IconifyIcon;
  color: 'primary' | 'secondary' | 'info' | 'success';
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function getDisplayName(result: IqTestResult) {
  if (result.full_name?.trim()) return result.full_name.trim();
  if (result.email?.trim()) return result.email.trim();
  return 'Anonymous participant';
}

function getAuthLabel(provider: string) {
  if (provider === 'email') return 'Email';
  if (provider === 'google') return 'Google';
  if (provider === 'facebook') return 'Facebook';
  if (provider === 'apple') return 'Apple';
  return provider;
}

function getScoreColor(score: number, total: number) {
  const ratio = score / total;
  if (ratio >= 0.8) return 'success';
  if (ratio >= 0.6) return 'info';
  if (ratio >= 0.4) return 'warning';
  return 'default';
}

function formatCompletedAt(dateString: string) {
  const date = new Date(dateString);
  return {
    absolute: format(date, 'd MMM yyyy, HH:mm'),
    relative: formatDistanceToNow(date, { addSuffix: true }),
  };
}

// ----------------------------------------------------------------------

type Props = {
  initialResults?: IqTestResult[];
  initialError?: string | null;
};

export default function IqResultsDashboard({
  initialResults = [],
  initialError = null,
}: Props) {
  const theme = useTheme();
  const [results, setResults] = useState<IqTestResult[]>(initialResults);
  const [loading, setLoading] = useState(!initialResults.length && !initialError);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    if (initialResults.length || initialError) {
      return undefined;
    }

    let active = true;

    const loadResults = async () => {
      setLoading(true);
      const response = await fetchIqResults();

      if (!active) return;

      setResults(response.results);
      setError(response.error);
      setLoading(false);
    };

    loadResults();

    return () => {
      active = false;
    };
  }, [initialResults.length, initialError]);

  const stats = useMemo(() => {
    if (!results.length) {
      return {
        total: 0,
        averageScore: 0,
        averageIq: 0,
        topScore: 0,
      };
    }

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const totalIq = results.reduce((sum, result) => sum + result.estimated_iq, 0);

    return {
      total: results.length,
      averageScore: Math.round((totalScore / results.length) * 10) / 10,
      averageIq: Math.round(totalIq / results.length),
      topScore: Math.max(...results.map((result) => result.score)),
    };
  }, [results]);

  const statItems: StatItem[] = [
    {
      label: 'Participants',
      value: String(stats.total),
      icon: userMultiple,
      color: 'primary',
    },
    {
      label: 'Average score',
      value: results.length ? `${stats.averageScore}/10` : '—',
      icon: chartRadar,
      color: 'info',
    },
    {
      label: 'Average IQ',
      value: results.length ? String(stats.averageIq) : '—',
      icon: activity,
      color: 'secondary',
    },
    {
      label: 'Top score',
      value: results.length ? `${stats.topScore}/10` : '—',
      icon: trophy,
      color: 'success',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={4}>
        <HeroStyle>
          <Stack spacing={1.5}>
            <Chip
              label="Experiment II"
              size="small"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: alpha(theme.palette.common.white, 0.12),
                color: 'common.white',
                fontWeight: 600,
              }}
            />
            <Typography variant="h3">IQ Challenge results</Typography>
            <Typography sx={{ color: alpha(theme.palette.common.white, 0.76), maxWidth: 640 }}>
              Everyone who completed the first experiment and unlocked their results. Scores,
              estimated IQ, sign-up method, and completion time in one place.
            </Typography>
          </Stack>
        </HeroStyle>

        <Grid container spacing={2.5}>
          {statItems.map((item) => (
            <Grid key={item.label} item xs={12} sm={6} md={3}>
              <StatCard>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette[item.color].main, 0.12),
                    }}
                  >
                    <Iconify icon={item.icon} width={22} sx={{ color: `${item.color}.main` }} />
                  </Box>
                  <Stack spacing={0.25}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h4">{item.value}</Typography>
                  </Stack>
                </Stack>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
            <CircularProgress />
            <Typography sx={{ color: 'text.secondary' }}>Loading quiz results…</Typography>
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error">
            <Stack spacing={1}>
              <Typography variant="subtitle2">Could not load quiz results</Typography>
              <Typography variant="body2">{error}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Fix: in Supabase go to Project Settings → API, copy the service role key, and add
                `SUPABASE_SERVICE_ROLE_KEY=...` to `.env.local`. Then restart the dev server.
              </Typography>
            </Stack>
          </Alert>
        )}

        {!loading && !error && results.length === 0 && (
          <StatCard>
            <Stack spacing={1.5} alignItems="flex-start">
              <Typography variant="h5">No results yet</Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>
                Once someone finishes the IQ Challenge on the first experiment page and unlocks
                their results, they will appear here automatically.
              </Typography>
            </Stack>
          </StatCard>
        )}

        {!loading && !error && results.length > 0 && (
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">All participants</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {results.length} {results.length === 1 ? 'entry' : 'entries'}
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {results.map((result, index) => {
                const displayName = getDisplayName(result);
                const completedAt = formatCompletedAt(result.created_at);
                const accuracy = Math.round((result.score / result.total_questions) * 100);

                return (
                  <ResultCard key={result.id} sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={2.5}
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar
                          src={result.avatar_url || undefined}
                          alt={displayName}
                          imgProps={{ referrerPolicy: 'no-referrer' }}
                          sx={{
                            width: 52,
                            height: 52,
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                          }}
                        >
                          {getInitials(displayName) || '?'}
                        </Avatar>

                        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography variant="h6" noWrap>
                              {displayName}
                            </Typography>
                            {index === 0 && (
                              <Chip
                                label="Latest"
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 700 }}
                              />
                            )}
                          </Stack>

                          {result.email && result.full_name && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {result.email}
                            </Typography>
                          )}

                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
                            <Chip
                              label={getAuthLabel(result.auth_provider)}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={completedAt.relative}
                              size="small"
                              sx={{ color: 'text.secondary' }}
                            />
                          </Stack>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={{ xs: 'row', md: 'row' }}
                        spacing={2}
                        alignItems="center"
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                      >
                        <Box
                          sx={{
                            minWidth: 88,
                            textAlign: 'center',
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.grey[500], 0.06),
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Score
                          </Typography>
                          <Typography variant="h5">
                            {result.score}/{result.total_questions}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            minWidth: 88,
                            textAlign: 'center',
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Est. IQ
                          </Typography>
                          <Typography variant="h5" sx={{ color: 'primary.main' }}>
                            {result.estimated_iq}
                          </Typography>
                        </Box>

                        <Stack spacing={0.5} sx={{ minWidth: { md: 180 } }}>
                          <Chip
                            label={`${accuracy}% accuracy`}
                            size="small"
                            color={getScoreColor(result.score, result.total_questions)}
                            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                          />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {result.iq_label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {completedAt.absolute}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </ResultCard>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
