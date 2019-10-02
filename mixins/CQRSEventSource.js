/* eslint-disable global-require */
// const fs = require("fs");
const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
// const createSnapshotAdapter = require("resolve-snapshot-lite").default;
const createEventStore = require("resolve-es").default;

module.exports = function CQRSEventSource(opts = {}) {
  const { aggregatesDir, withCommandHandler = true } = opts;

  if (withCommandHandler && !aggregatesDir) {
    throw new Error("No aggregate directory specified");
  }

  return {
    aggregatesDir,
    storage: undefined,
    commandHandler: undefined,
    readModel: undefined,
    eventStore: undefined,
    withCommandHandler,

    actions: {
      command: {
        params: { aggregateName: "string" },
        async handler(ctx) {
          try {
            this.logger.info(
              `AggregateName: ${this.name} → ${ctx.params.aggregateId} → ${ctx.params.type}`
            );
            await this.commandHandler(ctx.params);
          } catch (e) {
            this.logger.trace(e.message);
          }
          return `Command handler ${ctx.params.aggregateName}`;
        }
      },
      "read-model": {
        params: { aggregateId: "any" },
        async handler(ctx) {
          const hrstart = process.hrtime();
          const { aggregateId, payload = false, finishTime } = ctx.params;

          this.logger.info(aggregateId, ctx.params);

          this.logger.info(
            `Load event history for aggregate '${this.readModel}' with aggregateId '${aggregateId}'`
          );

          this.logger.info(
            "Options: payload=%s, finishTime=%s",
            payload,
            finishTime
          );

          const eventFilter = {
            // eventTypes: ["news/created"] // Or null to load ALL event types
            aggregateIds: [aggregateId], // Or null to load ALL aggregate ids
            finishTime // Or null to load events to current time
          };

          // const projection = this.app.get(`readModel/${readModel}`);

          const result = await this.materializeReadModelState(eventFilter);

          const hrend = process.hrtime(hrstart);
          this.logger.info(
            `Materialized ${this.readModel} with aggregateId ${aggregateId} %ds %dms`,
            hrend[0],
            hrend[1] / 1000000
          );
          return result;
        }
      },
      history: {
        params: {
          aggregateId: "any"
        },
        async handler(ctx) {
          const hrstart = process.hrtime();
          const {
            aggregateId,
            payload = false,
            startTime,
            finishTime
          } = ctx.params;

          this.logger.info(aggregateId, ctx.params);

          this.logger.info(
            `Load event history for aggregate '${this.readModel}' with aggregateId '${aggregateId}'`
          );

          this.logger.info(
            `Options: payload=%s, startTime=%s, finishTime=%s`,
            payload,
            startTime,
            finishTime
          );

          const eventFilter = {
            // eventTypes: ["news/created"] // Or null to load ALL event types
            aggregateIds: [aggregateId], // Or null to load ALL aggregate ids
            startTime, // Or null to load events from beginning of time
            finishTime // Or null to load events to current time
          };

          const result = await this.loadHistory(eventFilter, payload);

          const hrend = process.hrtime(hrstart);
          this.logger.info(
            `Materialized ${this.readModel} with aggregateId ${aggregateId} %ds %dms`,
            hrend[0],
            hrend[1] / 1000000
          );
          return result;
        }
      }
    },
    methods: {
      async loadHistory(eventFilter, withPayload) {
        let eventCount = 0;
        const state = [];

        const eventHandler = async event => {
          this.logger.debug("→ event", event);
          state.push({
            version: event.aggregateVersion,
            timestamp: event.timestamp,
            datetime: new Date(event.timestamp).toISOString(),
            eventType: event.type,
            ...{ ...(withPayload && { payload: event.payload }) }
          });
          eventCount++;
        };

        await this.eventStore.loadEvents(eventFilter, eventHandler);

        this.logger.info("Loaded %d", eventCount);
        return state;
      },
      async materializeReadModelState(eventFilter) {
        let eventCount = 0;
        const { projection } = this.aggregate;
        let state = projection.Init();

        const eventHandler = event => {
          state = projection[event.type](state, event);
          eventCount++;
        };

        await this.eventStore.loadEvents(eventFilter, eventHandler);

        this.logger.info("Loaded %d events", eventCount);

        return state;
      }
    },

    created() {
      if (!this.schema.storage) {
        this.logger.info("No storage defined, use default memory storage");
        this.storage = createEsStorage({ databaseFile: ":memory:" });
      } else {
        this.storage = this.schema.storage;
      }

      if (this.schema.readModel) {
        this.readModel = this.schema.readModel;
      } else {
        this.readModel = this.name;
      }

      const publishEvent = ctx => event => {
        ctx.broker.broadcast(event.type, event);
      };

      this.eventStore = createEventStore({
        storage: this.storage,
        publishEvent: publishEvent(this)
      });

      if (this.schema.withCommandHandler) {
        // eslint-disable-next-line import/no-dynamic-require
        this.aggregate = require(`../aggregates/${this.name}`);
        this.commandHandler = commandHandler({
          eventStore: this.eventStore,
          aggregates: [this.aggregate]
          // snapshotAdapter
        });
      }
    }
  };
};
