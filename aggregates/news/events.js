const CREATED = "aggregate.news.created";
const DELETED = "aggregate.news.deleted";
const UPVOTED = "aggregate.news.upvoted";
const UNVOTED = "aggregate.news.unvoted";
const COMMENT_CREATED = "aggregate.news.comment_created";
const COMMENT_REMOVED = "aggregate.news.comment_removed";

function NewsCreatedEvent(title, text, link, votes, userId, createdAt) {
  return {
    type: CREATED,
    payload: {
      title,
      text,
      link,
      votes,
      createdAt,
      createdBy: userId,
    },
  };
}

function NewsDeletedEvent(removedAt) {
  return {
    type: DELETED,
    payload: {
      removedAt,
    },
  };
}

function NewsUpvotedEvent(userId) {
  return {
    type: UPVOTED,
    payload: {
      userId,
    },
  };
}

function NewsUnvotedEvent(userId) {
  return {
    type: UNVOTED,
    payload: {
      userId,
    },
  };
}

function NewsCommentCreatedEvent(commentId, comment, createdBy, createdAt) {
  return {
    type: COMMENT_CREATED,
    payload: {
      commentId,
      comment,
      createdBy,
      createdAt,
    },
  };
}
function NewsCommentDeletedEvent(commentId) {
  return {
    type: COMMENT_REMOVED,
    payload: {
      commentId,
    },
  };
}

module.exports = {
  types: {
    CREATED,
    DELETED,
    UPVOTED,
    UNVOTED,
    COMMENT_CREATED,
    COMMENT_REMOVED,
  },
  NewsCreatedEvent,
  NewsDeletedEvent,
  NewsUpvotedEvent,
  NewsUnvotedEvent,
  NewsCommentCreatedEvent,
  NewsCommentDeletedEvent,
};
