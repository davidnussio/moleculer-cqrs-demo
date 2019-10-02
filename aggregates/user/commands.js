const validate = require("../validation");
const { CREATED, DELETED, BLOCKED, ELECTED } = require("./event_types");

function createUser(state, command) {
  validate(state, { createdAt: { type: "forbidden" } });
  validate(command, {
    payload: {
      type: "object",
      props: {
        username: { type: "string", min: "4" },
        email: { type: "email" }
      }
    }
  });

  const { username, email, privileges } = command.payload;

  return {
    type: CREATED,
    payload: {
      username,
      email,
      privileges,
      createdAt: Date.now()
    }
  };
}

function deleteUser(state) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    },
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

function blockUser(state) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    },
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });

  return {
    type: BLOCKED,
    payload: {
      blockedAt: Date.now()
    }
  };
}

function electUser(state, command) {
  validate(state, {
    createdAt: {
      type: "any",
      messages: { required: "Aggregate does not exist" }
    },
    removedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" }
    }
  });

  validate(command, {
    payload: {
      type: "object",
      props: {
        privileges: { type: "arrayEmpty" }
      }
    }
  });

  const { privileges } = command.payload;

  return {
    type: ELECTED,
    payload: {
      privileges
    }
  };
}

module.exports = {
  createUser,
  deleteUser,
  blockUser,
  electUser
};
