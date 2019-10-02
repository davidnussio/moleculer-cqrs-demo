const projection = require("./projection");
const commands = require("./commands");
const eventTypes = require("./event_types");

module.exports = {
  name: "news",
  projection,
  commands,
  eventTypes,
  invariantHash: null,
  serializeState: state => JSON.stringify(state),
  deserializeState: serializedState => JSON.parse(serializedState)
};
