const validate = require("../validation");
const {
  NewsCreatedEvent,
  NewsDeletedEvent,
  NewsUpvotedEvent,
  NewsUnvotedEvent,
  NewsCommentCreatedEvent,
  NewsCommentDeletedEvent,
} = require("./events");

function createNews(state, command) {
  validate(state, { createdAt: { type: "forbidden" } });
  validate(command, {
    payload: {
      type: "object",
      props: {
        title: { type: "string" },
        text: { type: "string" },
        userId: { type: "string" },
      },
    },
  });

  const { title, userId, text, link = "", votes = [] } = command.payload;

  return NewsCreatedEvent(title, text, link, votes, userId, Date.now());
}

function deleteNews(state) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" },
    },
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  });

  return NewsDeletedEvent(Date.now());
}

function upvoteNews(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" },
    },
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        userId: { type: "any" },
      },
    },
  });

  const { userId } = command.payload;

  return NewsUpvotedEvent(userId);
}

function unvoteNews(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" },
    },
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  });

  validate(command, {
    payload: {
      type: "object",
      props: {
        userId: { type: "any" },
      },
    },
  });

  const { userId } = command.payload;

  validate(state, {
    votes: {
      type: "array",
      contains: userId,
      messages: { contains: "User does not exit" },
    },
  });

  return NewsUnvotedEvent(userId);
}

function createComment(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" },
    },
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        commentId: { type: "any" },
        comment: { type: "string" },
        userId: { type: "any" },
      },
    },
  });

  const { comment, userId, commentId } = command.payload;

  return NewsCommentCreatedEvent(commentId, comment, userId, Date.now());
}

function removeComment(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" },
    },
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        commentId: { type: "any" },
      },
    },
  });

  const { commentId } = command.payload;

  validate(state, {
    comments: {
      type: "object",
      props: { [commentId]: { type: "object" } },
      messages: { [commentId]: "Comment does not exist" },
    },
  });

  return NewsCommentDeletedEvent(commentId);
}

module.exports = {
  createNews,
  deleteNews,
  upvoteNews,
  unvoteNews,
  createComment,
  removeComment,

  updateComment: () => {
    throw new Error("Not implemented");
  },
};
