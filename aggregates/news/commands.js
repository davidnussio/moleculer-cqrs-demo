const validate = require("../validation");
const {
  CREATED,
  DELETED,
  UPVOTED,
  UNVOTED,
  COMMENT_CREATED,
  COMMENT_REMOVED
} = require("./event_types");

function createNews(state, command) {
  validate(state, { createdAt: { type: "forbidden" } });
  validate(command, {
    payload: {
      type: "object",
      props: {
        title: { type: "string" },
        userId: { type: "string" }
      }
    }
  });

  const { title, userId, text, link = "", voted = [] } = command.payload;

  return {
    type: CREATED,
    payload: {
      title,
      text,
      link,
      userId,
      voted,
      createdAt: Date.now(),
      createdBy: userId
    }
  };
}

function deleteNews(state) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    }
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });

  return {
    type: DELETED,
    payload: {
      removedAt: Date.now()
    }
  };
}

function upvoteNews(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    }
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        userId: { type: "any" }
      }
    }
  });

  const { userId } = command.payload;

  return {
    type: UPVOTED,
    payload: {
      userId
    }
  };
}

function unvoteNews(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    }
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });

  validate(command, {
    payload: {
      type: "object",
      props: {
        userId: { type: "any" }
      }
    }
  });

  const { userId } = command.payload;

  validate(state, {
    voted: {
      type: "array",
      contains: userId,
      messages: { contains: "User does not exit" }
    }
  });

  return {
    type: UNVOTED,
    payload: {
      userId
    }
  };
}

function createComment(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    }
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        commentId: { type: "any" },
        comment: { type: "string" },
        userId: { type: "any" }
      }
    }
  });

  // logger.warn(command.payload);

  const { comment, userId, commentId } = command.payload;

  return {
    type: COMMENT_CREATED,
    payload: {
      commentId,
      comment,
      createdAt: Date.now(),
      createdBy: userId
    }
  };
}

function removeComment(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    }
  });
  validate(state, {
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });
  validate(command, {
    payload: {
      type: "object",
      props: {
        commentId: { type: "any" }
      }
    }
  });

  const { commentId } = command.payload;

  validate(state, {
    comments: {
      type: "object",
      props: { [commentId]: { type: "object" } },
      messages: { [commentId]: "Comment does not exist" }
    }
  });

  return {
    type: COMMENT_REMOVED,
    payload: {
      commentId
    }
  };
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
  }
};
