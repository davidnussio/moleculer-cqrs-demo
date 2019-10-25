const { schemas, validate } = require("./validate");
const {
  TodoCreatedEvent,
  TodoDeletedEvent,
  TodoGenericEvent,
} = require("./events");

function createTodo(state, command) {
  validate(state, schemas.createTodo.state);
  validate(command, schemas.createTodo.command);

  return TodoCreatedEvent({ ...command.payload, createdAt: Date.now() });
}

function deleteTodo(state, command) {
  validate(state, schemas.deleteTodo.state);

  return TodoDeletedEvent({ ...command.payload, deletedAt: Date.now() });
}

function genericCommandTodo(state, command) {
  validate(state, schemas.deleteTodo.state);

  return TodoGenericEvent(command.payload);
}

module.exports = {
  createTodo,
  deleteTodo,
  genericCommandTodo,
};
