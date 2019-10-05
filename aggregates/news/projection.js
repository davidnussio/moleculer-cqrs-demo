const {
  types: {
    CREATED,
    DELETED,
    UPVOTED,
    UNVOTED,
    COMMENT_CREATED,
    COMMENT_REMOVED,
  },
} = require("./events");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [UPVOTED]: (state, { payload: { userId } }) => ({
    ...state,
    votes: [...state.votes, userId],
  }),

  [UNVOTED]: (state, { payload: { userId } }) => {
    const votes = [...state.votes];
    votes.splice(votes.lastIndexOf(userId), 1);
    return {
      ...state,
      votes,
    };
  },

  [COMMENT_CREATED]: (
    state,
    { payload: { commentId, createdBy, createdAt, comment } }
  ) => ({
    ...state,
    comments: {
      ...state.comments,
      [commentId]: {
        createdAt,
        createdBy,
        comment,
      },
    },
  }),

  [COMMENT_REMOVED]: (state, { payload: { commentId } }) => {
    const { [commentId]: _, ...comments } = state.comments;
    return {
      ...state,
      comments,
    };
  },

  [DELETED]: (state, { payload }) => ({
    ...state,
    removedAt: payload.removedAt,
  }),
};
