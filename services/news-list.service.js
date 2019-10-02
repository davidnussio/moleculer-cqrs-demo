const DbService = require("moleculer-db");
const { eventTypes: eventNews } = require("../aggregates/news");

module.exports = {
  name: "news-list",

  mixins: [DbService],

  adapter: new DbService.MemoryAdapter({ filename: "./data/news-list.nedb" }),

  /**
   *
   * Service settings
   */
  settings: { fields: ["_id", "title", "votes", "comments"] },

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
      return { data: await this.actions.find() };
    },

    async upvote(ctx) {
      return this.adapter.updateById(ctx.params.aggregateId, {
        $inc: { votes: 1 }
      });
    },
    async dispose() {
      return this.adapter.removeMany({});
    }
  },

  /**
   * Events
   */
  events: {
    [eventNews.CREATED](event) {
      this.actions.create({
        _id: event.aggregateId,
        title: event.payload.title,
        votes: 0,
        comments: 0
      });
    },
    [eventNews.DELETED](event) {
      this.actions.remove(event.aggregateId);
    },
    async [eventNews.UPVOTED](event) {
      // const view = await this.actions.get({ id: event.aggregateId });

      // await this.actions.patch(event.aggregateId, {
      //   ...view,
      //   voted: view.voted + 1
      // });
      return this.actions.upvote(event);
    },
    async [eventNews.COMMENT_CREATED]() {
      // const view = await app.service("news-list").get(event.aggregateId);
      // await app.service("news-list").patch(event.aggregateId, {
      //   ...view,
      //   comments: view.comments + 1
      // });
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
