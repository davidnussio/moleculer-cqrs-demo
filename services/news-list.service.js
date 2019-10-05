const DbService = require("moleculer-db");

const { events: eventNews } = require("../aggregates/news");

module.exports = {
  name: "news-list",

  mixins: [DbService],

  adapter: new DbService.MemoryAdapter({ filename: "./data/news-list.nedb" }),

  metadata: {
    viewModel: true,
  },
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
    incrVotes(ctx) {
      return this.adapter
        .updateById(ctx.params.aggregateId, {
          $inc: { votes: 1 },
        })
        .then(doc => this.transformDocuments(ctx, {}, doc))
        .then(json =>
          this.entityChanged("created", json, ctx).then(() => json)
        );
    },
    decrVotes(ctx) {
      return this.adapter
        .updateById(ctx.params.aggregateId, {
          $inc: { votes: -1 },
        })
        .then(doc => this.transformDocuments(ctx, {}, doc))
        .then(json =>
          this.entityChanged("created", json, ctx).then(() => json)
        );
    },
    incrComment(ctx) {
      return this.adapter
        .updateById(ctx.params.aggregateId, {
          $inc: { comments: 1 },
        })
        .then(doc => this.transformDocuments(ctx, {}, doc))
        .then(json =>
          this.entityChanged("created", json, ctx).then(() => json)
        );
    },
    decrComment(ctx) {
      return this.adapter
        .updateById(ctx.params.aggregateId, {
          $inc: { comments: -1 },
        })
        .then(doc => this.transformDocuments(ctx, {}, doc))
        .then(json =>
          this.entityChanged("created", json, ctx).then(() => json)
        );
    },
    dispose() {
      return this.adapter.removeMany({});
    },
  },

  /**
   * Events
   */
  events: {
    [eventNews.types.CREATED](event) {
      this.actions.create({
        _id: event.aggregateId,
        title: event.payload.title,
        votes: 0,
        comments: 0,
      });
    },
    [eventNews.types.DELETED](event) {
      this.actions.remove({ id: event.aggregateId });
    },
    [eventNews.types.UPVOTED](event) {
      this.actions.incrVotes(event);
    },
    [eventNews.types.UNVOTED](event) {
      this.actions.decrVotes(event);
    },
    [eventNews.types.COMMENT_CREATED](event) {
      this.actions.incrComment(event);
    },
    [eventNews.types.COMMENT_REMOVED](event) {
      this.actions.decrComment(event);
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
