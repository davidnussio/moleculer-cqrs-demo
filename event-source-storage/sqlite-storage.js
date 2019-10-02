const createEsStorage = require("resolve-storage-lite").default;

const eventStore = createEsStorage({
  databaseFile: "./data/event-store.sqlite"
});

module.exports = eventStore;
