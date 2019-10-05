const Validator = require("fastest-validator");

class ValidationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ValidationError";
    this.cause = cause;
  }
}

const v = new Validator();

module.exports = function validate(object, schema) {
  const result = v.validate(object, schema);

  if (result === true) {
    return true;
  }

  const messages = result.map(({ message }) => message).join("\n 🔥 ");

  throw new ValidationError(
    `Aggregate validation error 😭\n🔥  ${messages}`,
    result
  );
};
