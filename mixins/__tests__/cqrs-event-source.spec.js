const { ServiceBroker } = require("moleculer");
const CQRSEventSource = require("../cqrs-event-source");
// const TestService = require("../news");

describe("Configuration", () => {
  const broker = new ServiceBroker({ logger: false });
  // broker.createService(TestService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  test("should valid", () => {
    expect(() =>
      CQRSEventSource({
        aggregate: {
          name: "abc",
          commands: {},
          projection: {},
          events: { types: {} },
        },
      })
    ).toThrow();
  });
});
