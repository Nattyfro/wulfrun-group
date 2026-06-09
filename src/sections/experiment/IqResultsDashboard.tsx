import { useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { IconifyIcon } from '@iconify/react';
import chartRadar from '@iconify/icons-carbon/chart-radar';
import userMultiple from '@iconify/icons-carbon/user-multiple';
import trophy from '@iconify/icons-carbon/trophy';
import activity from '@iconify/icons-carbon/activity';
import timeIcon from '@iconify/icons-carbon/time';
import chartLine from '@iconify/icons-carbon/chart-line';
import certificate from '@iconify/icons-carbon/certificate';
import logoGoogle from '@iconify/icons-carbon/logo-google';
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
import { IqComment } from '../../lib/iqComments';
import IqCommentsSection from './IqCommentsSection';
import ChallengeShareButton from './ChallengeShareButton';

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

const PortraitCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'topIq',
})<{ topIq?: boolean }>(({ theme, topIq }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20,
  width: '100%',
  maxWidth: 360,
  mx: 'auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: topIq
    ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.common.white} 42%)`
    : `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${alpha(
        theme.palette.grey[500],
        0.04
      )} 100%)`,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.14)}`,
  boxShadow: `0 16px 32px ${alpha(theme.palette.grey[900], 0.06)}`,
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(topIq && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 4,
      background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 24px 44px ${alpha(theme.palette.grey[900], 0.1)}`,
  },
}));

const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 360px))',
  justifyContent: 'center',
  gap: theme.spacing(3.5),
}));

const IqBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'highlighted',
})<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  flexShrink: 0,
  minWidth: 56,
  padding: theme.spacing(1.25, 1.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  textAlign: 'center',
  backgroundColor: highlighted
    ? alpha(theme.palette.primary.main, 0.14)
    : alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, highlighted ? 0.28 : 0.16)}`,
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

function getAuthIcon(provider: string): IconifyIcon | null {
  if (provider === 'google') return logoGoogle;
  return null;
}

function formatCompletedAt(dateString: string) {
  const date = new Date(dateString);
  return {
    short: format(date, 'd MMM yyyy'),
    relative: formatDistanceToNow(date, { addSuffix: true }),
  };
}

function shortenIqLabel(label: string) {
  return label.replace(/\s*range$/i, '').trim();
}

type CardStatProps = {
  icon: IconifyIcon;
  label: string;
  value: string;
  iconColor?: string;
};

function CardStat({ icon, label, value, iconColor = 'text.secondary' }: CardStatProps) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
      <Iconify icon={icon} width={18} sx={{ color: iconColor, flexShrink: 0, mt: 0.5 }} />
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type Props = {
  initialResults?: IqTestResult[];
  initialError?: string | null;
  initialComments?: IqComment[];
  initialCommentsError?: string | null;
};

export default function IqResultsDashboard({
  initialResults = [],
  initialError = null,
  initialComments = [],
  initialCommentsError = null,
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

  const topIqScore = useMemo(
    () => (results.length ? Math.max(...results.map((result) => result.estimated_iq)) : 0),
    [results]
  );

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
            <Box sx={{ pt: 1, maxWidth: 360 }}>
              <ChallengeShareButton />
            </Box>
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

            <CardGrid>
              {results.map((result) => {
                const displayName = getDisplayName(result);
                const completedAt = formatCompletedAt(result.created_at);
                const accuracy = Math.round((result.score / result.total_questions) * 100);
                const isTopIq = result.estimated_iq === topIqScore;
                const authIcon = getAuthIcon(result.auth_provider);

                return (
                  <PortraitCard key={result.id} topIq={isTopIq}>
                      <Stack spacing={3} sx={{ p: 3, flexGrow: 1 }}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={result.avatar_url || undefined}
                            alt={displayName}
                            imgProps={{
                              referrerPolicy: 'no-referrer',
                              style: { objectFit: 'cover' },
                            }}
                            sx={{
                              width: 72,
                              height: 72,
                              flexShrink: 0,
                              borderRadius: 1.5,
                              fontSize: 24,
                              fontWeight: 700,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              border: `2px solid ${alpha(theme.palette.common.white, 0.9)}`,
                              boxShadow: `0 8px 20px ${alpha(theme.palette.grey[900], 0.1)}`,
                            }}
                          >
                            {getInitials(displayName) || '?'}
                          </Avatar>

                          <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                                {displayName}
                              </Typography>
                              {isTopIq && (
                                <Chip
                                  icon={<Iconify icon={trophy} width={12} />}
                                  label="Top IQ"
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontWeight: 700,
                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                    color: 'primary.main',
                                    '& .MuiChip-icon': { color: 'primary.main' },
                                  }}
                                />
                              )}
                            </Stack>
                            {result.email && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {result.email}
                              </Typography>
                            )}
                          </Stack>

                          <IqBadge highlighted={isTopIq}>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1.2 }}
                            >
                              IQ
                            </Typography>
                            <Typography variant="h5" sx={{ lineHeight: 1, color: 'primary.main' }}>
                              {result.estimated_iq}
                            </Typography>
                          </IqBadge>
                        </Stack>

                        <Box
                          sx={{
                            borderTop: `1px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
                            pt: 2.5,
                          }}
                        >
                          <Stack spacing={2.5}>
                            <Stack direction="row" spacing={3}>
                              <CardStat
                                icon={chartLine}
                                label="Score"
                                value={`${result.score}/${result.total_questions}`}
                              />
                              <CardStat
                                icon={activity}
                                label="Accuracy"
                                value={`${accuracy}%`}
                                iconColor="primary.main"
                              />
                            </Stack>

                            <Stack direction="row" spacing={3}>
                              <CardStat
                                icon={certificate}
                                label="Range"
                                value={shortenIqLabel(result.iq_label)}
                              />
                              <CardStat
                                icon={timeIcon}
                                label="Completed"
                                value={completedAt.short}
                              />
                            </Stack>
                          </Stack>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            mt: 'auto',
                            pt: 1.5,
                            color: 'text.secondary',
                          }}
                        >
                          {authIcon ? (
                            <Iconify icon={authIcon} width={14} sx={{ flexShrink: 0 }} />
                          ) : (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.grey[500], 0.4),
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {getAuthLabel(result.auth_provider)} · {completedAt.relative}
                          </Typography>
                        </Stack>
                      </Stack>
                    </PortraitCard>
                );
              })}
            </CardGrid>
          </Stack>
        )}

        <IqCommentsSection
          initialComments={initialComments}
          initialError={initialCommentsError}
        />
      </Stack>
    </Container>
  );
}
