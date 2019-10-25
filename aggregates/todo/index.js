const projection = require("./projection");
const commands = require("./commands");
const events = require("./events");

/**
 * todo aggregate
 */

module.exports = {
  name: "todo",
  projection,
  commands,
  events,
  invariantHash: null,
  serializeState: state => JSON.stringify(state),
  deserializeState: serializedState => JSON.parse(serializedState),
};
