export type IqComment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export type PostIqCommentInput = {
  authorName: string;
  body: string;
};

export async function fetchIqComments() {
  try {
    const response = await fetch('/api/iq-comments');
    const result = await response.json();

    if (!response.ok) {
      return {
        comments: [] as IqComment[],
        error: result.error || 'Failed to load comments',
      };
    }

    return {
      comments: (result.comments || []) as IqComment[],
      error: null as string | null,
    };
  } catch (error) {
    return {
      comments: [] as IqComment[],
      error: error instanceof Error ? error.message : 'Failed to load comments',
    };
  }
}

export async function postIqComment(input: PostIqCommentInput) {
  try {
    const response = await fetch('/api/iq-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        comment: null as IqComment | null,
        error: result.error || 'Failed to post comment',
      };
    }

    return {
      comment: (result.comment || null) as IqComment | null,
      error: null as string | null,
    };
  } catch (error) {
    return {
      comment: null as IqComment | null,
      error: error instanceof Error ? error.message : 'Failed to post comment',
    };
  }
}
