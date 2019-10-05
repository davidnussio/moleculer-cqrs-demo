const { ServiceBroker } = require("moleculer");
const createEsStorage = require("resolve-storage-lite").default;

const NewsService = require("../../services/news.service");

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2019-05-14T11:01:58.135Z").valueOf());

const inmemoryStorage = createEsStorage({
  databaseFile: ":memory:",
});

describe("News service", () => {
  const broker = new ServiceBroker({ logger: console });
  broker.createService(NewsService, { storage: inmemoryStorage });

  beforeEach(() => broker.start());
  afterEach(() => broker.stop());

  test("should 3", async () => {
    await broker.call("news.command", {
      aggregateName: "news",
      aggregateId: "aggregate-1",
      type: "createNews",
      payload: { title: "Title...", text: "Text text...", userId: "user-1" },
    });

    await broker.call("news.command", {
      aggregateName: "news",
      aggregateId: "aggregate-1",
      type: "upvoteNews",
      payload: { userId: "user-2" },
    });

    await broker.call("news.command", {
      aggregateName: "news",
      aggregateId: "aggregate-1",
      type: "createComment",
      payload: {
        commentId: "comment-1",
        comment: "Comment comment...",
        userId: "user-2",
      },
    });

    const materializedState = await broker.call("news.read-model", {
      aggregateId: "aggregate-1",
    });

    expect(materializedState).toMatchSnapshot();
  });
});
//
