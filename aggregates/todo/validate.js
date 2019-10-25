const Validator = require("fastest-validator");

class TodoValidationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ValidationError";
    this.cause = cause;
  }
}

const v = new Validator();

function validate(object, schema) {
  const result = v.validate(object, schema);

  if (result === true) {
    return true;
  }

  const messages = result.map(({ message }) => message).join("\n 🔥 ");

  throw new TodoValidationError(
    `Aggregate validation error 😭\n🔥  ${messages}`,
    result
  );
}

const createTodo = {
  state: {
    createdAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already created" },
    },
    deletedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  },
  command: { payload: { type: "object" } },
};

const deleteTodo = {
  state: {
    deletedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  },
  command: {},
};

const genericCommand = {
  state: {
    deletedAt: {
      type: "forbidden",
      messages: { forbidden: "Aggregate is already deleted" },
    },
  },
  command: { payload: { type: "object" } },
};

module.exports = {
  schemas: { createTodo, deleteTodo, genericCommand },
  validate,
};
