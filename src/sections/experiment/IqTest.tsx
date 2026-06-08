import { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { IconifyIcon } from '@iconify/react';
import chartRadar from '@iconify/icons-carbon/chart-radar';
import timeIcon from '@iconify/icons-carbon/time';
import categoryIcon from '@iconify/icons-carbon/category';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
// components
import { Iconify } from '../../components';

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

type Phase = 'intro' | 'quiz' | 'results';

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
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + (phase === 'results' ? 1 : 0)) / QUESTIONS.length) * 100;

  const correctCount = useMemo(
    () =>
      answers.reduce(
        (total, answer, index) => total + (answer === QUESTIONS[index].correctIndex ? 1 : 0),
        0
      ),
    [answers]
  );

  const iqResult = useMemo(() => getIqEstimate(correctCount), [correctCount]);

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
      setPhase('results');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
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
                    {currentIndex === QUESTIONS.length - 1 ? 'See results' : 'Next question'}
                  </Button>
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
