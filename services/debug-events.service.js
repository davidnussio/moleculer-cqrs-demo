module.exports = {
  name: "debug-events",

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
  actions: {
    /**
     * Welcome a username
     *
     * @param {String} name - User name
     */
    welcome() {
      return `Welcome, events`;
    },
  },

  /**
   * Events
   */
  events: {
    "xxx*": function(payload) {
      this.logger.info(
        "Event received type:",
        payload.type,
        " payload size: ",
        JSON.stringify(payload, "", 0).length
      );
    },
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
  stopped() {},
};
