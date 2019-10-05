const EventSourceStorage = require("../event-source-storage");
const CQRSEventSource = require("../mixins/cqrs-event-source");
const aggregate = require("../aggregates/user");

module.exports = {
  name: "user",

  mixins: [CQRSEventSource({ aggregate })],

  storage: EventSourceStorage,
  /**
   *
   * Service settings
   */
  settings: {},

  /**
   * Service dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {},

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {},

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
