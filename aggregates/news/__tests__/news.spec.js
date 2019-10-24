const { CQRSFixture } = require("moleculer-cqrs");

const aggregate = require("..");

const {
  commands: { createNews, upvoteNews },
  events: { NewsCreatedEvent, NewsDeletedEvent },
} = aggregate;

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2019-05-14T11:01:58.135Z").valueOf());

describe("Testing aggregate commands in isolation", () => {
  test("should commands with empty payload throw error", () => {
    expect(() => createNews({}, {})).toThrow("Aggregate validation error");
  });

  test("should createNews command return an NewsCreatedEvent", () => {
    expect(
      createNews(
        {},
        {
          payload: {
            title: "Title news",
            userId: "user-id-1",
            text:
              "Asperiores nam tempora qui et provident temporibus illo et fugit.",
          },
        }
      )
    ).toMatchSnapshot();
  });
});

describe("Testing news aggregate with cqrs fixture", () => {
  let fixture;

  beforeEach(() => {
    fixture = new CQRSFixture(aggregate);
  });

  test("should call raw command", () => {
    fixture
      .givenEvents([])
      .when({
        aggregateId: "12345",
        aggregateName: "news",
        type: "createNews",
        payload: {
          title: "Title news... title...",
          text: "Text text... text... text...",
          userId: "user-id-1abc2def3",
        },
      })
      .expectEvents(
        NewsCreatedEvent(
          "Title news... title...",
          "Text text... text... text...",
          "",
          [],
          "user-id-1abc2def3",
          Date.now()
        )
      );
  });

  test("should command function", () => {
    fixture
      .givenEvents()
      .when(createNews, {
        title: "Title news... title...",
        text: "Text text... text... text...",
        userId: "user-id-1abc2def3",
      })
      .expectEvents(
        NewsCreatedEvent(
          "Title news... title...",
          "Text text... text... text...",
          "",
          [],
          "user-id-1abc2def3",
          Date.now()
        )
      );
  });

  test("should reject upvode command when news already deleted", () => {
    fixture
      .givenEvents([
        NewsCreatedEvent(
          "Title news... title...",
          "Text text... text... text...",
          "",
          [],
          "user-id-1abc2def3",
          Date.now()
        ),
        NewsDeletedEvent(Date.now()),
      ])
      .whenThrow(upvoteNews, { userId: "user-1234" })
      .toThrow("Aggregate is already deleted");
  });
});
