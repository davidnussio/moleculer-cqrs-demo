const DbService = require("moleculer-db");

module.exports = {
  name: "user-list",

  mixins: [DbService],

  adapter: new DbService.MemoryAdapter({ filename: "./data/user-list.nedb" }),

  // mixins: [CQRSEventSource({ aggregatesDir: "../aggregates" })],

  // storage: EventSourceStorage,
  /**
   *
   * Service settings
   */
  settings: { fields: ["_id", "title", "voted", "comments"] },

  /**
   * Service dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    /**
     * Welcome a username
     *
     * @param {String} name - User name
     */
    async mapReq(ctx) {
      this.logger.info(ctx.params, ctx.query);
      await this.actions.create({
        _id: Date.now(),
        title: "fdiof",
        voted: 6,
        comments: 100
      });
      return { data: await this.actions.find() };
    }
  },

  /**
   * Events
   */
  events: {
    "user/created": function(/* event */) {
      // this.logger.info("ok...", event.type);
    },
    "news/created": function(/* event */) {
      // this.logger.info("ok...", event.type);
    }
  },

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
  stopped() {}
};
