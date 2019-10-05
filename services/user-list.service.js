const DbService = require("moleculer-db");

const { events: eventUser } = require("../aggregates/user");

module.exports = {
  name: "user-list",

  mixins: [DbService],

  adapter: new DbService.MemoryAdapter({ filename: "./data/user-list.nedb" }),

  metadata: {
    viewModel: true,
  },

  // storage: EventSourceStorage,
  /**
   *
   * Service settings
   */
  settings: {
    fields: ["_id", "username", "email", "createdAt"],
  },

  /**
   * Service dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    async dispose() {
      this.broker.broadcast("user-list/disposed");
      return this.adapter.removeMany({});
    },
  },

  /**
   * Events
   */
  events: {
    [eventUser.types.CREATED](event) {
      this.actions.create({
        _id: event.aggregateId,
        email: event.payload.email,
        username: event.payload.username,
        createdAt: event.payload.createdAt,
      });
    },
    [eventUser.types.DELETED](event) {
      this.actions.remove(event.aggregateId);
    },
  },

  /**
   * Methods
   */
  methods: {},

  entityCreated(json) {
    this.broker.emit(`view-model.${this.name}.created`, json);
  },

  entityUpdated(json) {
    this.broker.emit(`view-model.${this.name}.updated`, json);
  },

  entityRemoved(json) {
    this.broker.emit(`view-model.${this.name}.removed`, json);
  },

  /**
   * Service created lifecycle event handler
   */
  created() {},

  /**
   * Service started lifecycle event handler
   */
  started() {},

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {},
};
