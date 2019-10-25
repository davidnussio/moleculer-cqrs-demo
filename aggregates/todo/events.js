const CREATED = "aggregate.todo.created";
const DELETED = "aggregate.todo.deleted";
const GENERIC = "aggregate.todo.generic";

function TodoCreatedEvent(payload) {
  return {
    type: CREATED,
    payload,
  };
}

function TodoDeletedEvent(payload) {
  return {
    type: DELETED,
    payload,
  };
}

function TodoGenericEvent(payload) {
  return {
    type: GENERIC,
    payload,
  };
}

module.exports = {
  types: {
    CREATED,
    DELETED,
    GENERIC,
  },
  TodoCreatedEvent,
  TodoDeletedEvent,
  TodoGenericEvent,
};
