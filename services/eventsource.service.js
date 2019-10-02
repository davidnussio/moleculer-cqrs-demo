const EventSourceStorage = require("../event-source-storage");
const CQRSEventSource = require("../mixins/CQRSEventSource");

// call eventsource.replay '{"viewModels": ["news-list", "user-list"]}'
module.exports = {
  name: "eventsource",

  mixins: [CQRSEventSource({ withCommandHandler: false })],

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
  actions: {
    replay: {
      params: {
        viewModels: { type: "array" }
      },
      async handler(ctx) {
        const hrstart = process.hrtime();

        const events = this.broker.registry.getEventList({
          onlyLocal: false,
          onlyAvailable: true,
          skipInternal: true,
          withEndpoints: false
        });

        const { viewModels, startTime, finishTime } = ctx.params;

        const eventTypes = [
          ...new Set(
            events.filter(e => viewModels.includes(e.group)).map(e => e.name)
          )
        ];

        this.logger.info(viewModels, ctx.params);

        this.logger.info(
          `Options: , startTime=%s, finishTime=%s`,
          startTime,
          finishTime
        );

        const eventFilter = {
          eventTypes, // Or null to load ALL event types
          startTime, // Or null to load events from beginning of time
          finishTime // Or null to load events to current time
        };

        let eventCount = 0;

        const eventHandler = async event => {
          this.broker.broadcast(event.type, event);
          eventCount++;
        };

        await Promise.all(
          viewModels.map(viewModel => {
            return this.broker.call(`${viewModel}.dispose`).catch(e => {
              if (e.code !== 404) {
                this.logger.error(e);
              }
            });
          })
        );

        await this.eventStore.loadEvents(eventFilter, eventHandler);

        this.logger.info("Loaded %d events", eventCount);
        const result = eventFilter;

        const hrend = process.hrtime(hrstart);
        this.logger.info(
          `Materialized ${this.readModel} with xxxxxxxx %ds %dms`,
          hrend[0],
          hrend[1] / 1000000
        );
        return { ...result, eventCount };
      }
    }
  },

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
  stopped() {}
};
