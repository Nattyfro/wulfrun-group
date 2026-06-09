import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Card,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// lib
import { IqComment, postIqComment } from '../../lib/iqComments';

// ----------------------------------------------------------------------

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  boxShadow: `0 16px 32px ${alpha(theme.palette.grey[900], 0.06)}`,
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const CommentCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
  boxShadow: 'none',
  padding: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.grey[500], 0.03),
}));

// ----------------------------------------------------------------------

const CommentSchema = Yup.object().shape({
  authorName: Yup.string().required('Name is required').max(80, 'Name is too long'),
  body: Yup.string()
    .required('Comment is required')
    .min(2, 'Comment is too short')
    .max(1000, 'Comment is too long'),
});

type CommentFormValues = {
  authorName: string;
  body: string;
};

type Props = {
  initialComments?: IqComment[];
  initialError?: string | null;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

// ----------------------------------------------------------------------

export default function IqCommentsSection({
  initialComments = [],
  initialError = null,
}: Props) {
  const theme = useTheme();
  const [comments, setComments] = useState<IqComment[]>(initialComments);
  const [error, setError] = useState<string | null>(initialError);
  const [submitError, setSubmitError] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CommentFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(CommentSchema),
    defaultValues: {
      authorName: '',
      body: '',
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    setSubmitError('');

    const response = await postIqComment({
      authorName: data.authorName,
      body: data.body,
    });

    if (response.error || !response.comment) {
      setSubmitError(response.error || 'Failed to post comment');
      return;
    }

    setComments((current) => [response.comment as IqComment, ...current]);
    setError(null);
    reset();
  };

  return (
    <SectionCard>
      <Stack spacing={3}>
        <Stack spacing={0.75}>
          <Typography variant="h5">Comments</Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 560 }}>
            Share thoughts on the experiment, the results, or what you would try next.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="warning">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Controller
              name="authorName"
              control={control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Your name"
                  error={Boolean(fieldError)}
                  helperText={fieldError?.message}
                />
              )}
            />

            <Controller
              name="body"
              control={control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={3}
                  label="Comment"
                  placeholder="What do you think of the IQ challenge results?"
                  error={Boolean(fieldError)}
                  helperText={fieldError?.message}
                />
              )}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                alignSelf: 'flex-start',
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Post comment
            </LoadingButton>
          </Stack>
        </form>

        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Recent comments
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Typography>
          </Stack>

          {!comments.length && !error && (
            <Typography sx={{ color: 'text.secondary', py: 2 }}>
              No comments yet. Be the first to leave one.
            </Typography>
          )}

          {comments.map((comment) => (
              <CommentCard key={comment.id}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main',
                    }}
                  >
                    {getInitials(comment.author_name) || '?'}
                  </Avatar>

                  <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {comment.author_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                      {comment.body}
                    </Typography>
                  </Stack>
                </Stack>
              </CommentCard>
            ))}
        </Stack>
      </Stack>
    </SectionCard>
  );
}
