const {
  CREATED,
  DELETED,
  UPVOTED,
  UNVOTED,
  COMMENT_CREATED,
  COMMENT_REMOVED
} = require("./event_types");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload }) => ({
    ...state,
    ...payload
  }),

  [UPVOTED]: (state, { payload: { userId } }) => ({
    ...state,
    voted: [...state.voted, userId]
  }),

  [UNVOTED]: (state, { payload: { userId } }) => ({
    ...state,
    voted: [...state.voted.filter(votedUserId => votedUserId !== userId)]
  }),

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
        comment
      }
    }
  }),

  [COMMENT_REMOVED]: (state, { payload: { commentId } }) => {
    const { [commentId]: _, ...comments } = state.comments;
    return {
      ...state,
      comments
    };
  },

  [DELETED]: (state, { payload }) => ({
    ...state,
    removedAt: payload.removedAt
  })
};
