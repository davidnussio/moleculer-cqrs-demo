const projection = require("./projection");
const commands = require("./commands");
const events = require("./events");

module.exports = {
  name: "news",
  projection,
  commands,
  events,
  invariantHash: null,
  serializeState: state => JSON.stringify(state),
  deserializeState: serializedState => JSON.parse(serializedState),
};
