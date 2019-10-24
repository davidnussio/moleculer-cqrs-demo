const CQRSEventSource = require("moleculer-cqrs");
const EventSourceStorage = require("../event-source-storage");
const aggregate = require("../aggregates/news");

module.exports = {
  name: "news",

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
