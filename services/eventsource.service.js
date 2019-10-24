const CQRSEventSource = require("moleculer-cqrs");
const EventSourceStorage = require("../event-source-storage");

// call eventsource.replay '{"viewModels": ["news-list", "user-list"]}'
module.exports = {
  name: "eventsource",

  mixins: [CQRSEventSource({ replay: true })],

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
