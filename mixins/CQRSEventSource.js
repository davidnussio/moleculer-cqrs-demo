/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// const fs = require("fs");
const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
// const createSnapshotAdapter = require("resolve-snapshot-lite").default;
const createEventStore = require("resolve-es").default;

module.exports = function CQRSEventSource(opts = {}) {
	const { aggregatesDir } = opts;

	if (!aggregatesDir) {
		throw new Error("No aggregate directory specified");
	}

	return {
		aggregatesDir,
		storage: undefined,
		commandHandler: undefined,

		actions: {
			command: {
				params: { aggregateName: "string" },
				async handler(ctx) {
					this.logger.debug("Prepare command", ctx.params);
					try {
						await this.commandHandler(ctx.params);
					} catch (e) {
						this.logger.error(e.message);
					}
					return `Command handler ${ctx.params.aggregateName}`;
				}
			}
		},
		created() {
			if (!this.schema.storage) {
				this.logger.info("No storage defined, use default memory storage");
				this.storage = createEsStorage({ databaseFile: ":memory:" });
			} else {
				this.storage = this.schema.storage;
			}

			const aggregates = ["news", "user"].map(file => {
				return require(`../aggregates/${file}`);
			});

			const publishEvent = context => async event => {
				console.log("Send event type", event.type);
				// await context.emit(event.type, event);
			};
			const eventStore = createEventStore({
				storage: createEsStorage({ databaseFile: "./data/event-store.sqlite" }),
				publishEvent: publishEvent(this)
			});

			this.commandHandler = commandHandler({
				eventStore,
				aggregates
				// snapshotAdapter
			});
		}
	};
	// app.set("cqrs:internals:aggregates", aggregates);
	// const viewModels = fs
	// 	.readdirSync(`${__dirname}/viewModels`, { withFileTypes: true })
	// 	.map(dirent => {
	// 		if (dirent.isDirectory() === false) {
	// 			return false;
	// 		}
	// 		const requiredFile = `${__brokerdirname}/viewModels/${dirent.name}/index.js`;
	// 		const err = fs.accessSync(requiredFile, fs.constants.F_OK);
	// 		if (err) {
	// 			this.logger.error(`${requiredFile} does not exits`);
	// 			throw new Error(`${requiredFile} does not exits`);
	// 		}
	// 		const requiredViewModel = require(requiredFile);
	// 		this.logger.info(
	// 			`Loaded view model ${requiredViewModel.name} → (route: ${requiredViewModel.route})`
	// 		);
	// 		return requiredViewModel;
	// 	})
	// 	.filter(vm => vm);
	// app.set("cqrs:internals:viewModels", viewModels);
	//
	// // const snapshotAdapter = createSnapshotAdapter({
	// //   databaseFile: "./data/aggregates-snapshot.sqlite",
	// //   bucketSize: 100
	// // });
	//
};
