/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
const uuid = require("uuid/v4");
const faker = require("faker");

function chooseWeighted(items, chances) {
  const sum = chances.reduce((acc, el) => acc + el, 0);
  let acc = 0;
  chances = chances.map(el => (acc = el + acc));
  const rand = Math.random() * sum;
  return items[chances.filter(el => el <= rand).length];
}

async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function popElement(array) {
  const len = array.length - 1;
  const rand = Math.floor(Math.random() * len);
  return array.splice(rand, 1);
}

function executeUpVoted(broker, aggregateId, aggregateName, userId) {
  return broker.call("news.command", {
    aggregateId,
    aggregateName,
    type: "upvoteNews",
    payload: {
      userId,
    },
  });
}

function executeUnVoted(broker, aggregateId, aggregateName, userId) {
  return broker.call("news.command", {
    aggregateId,
    aggregateName,
    type: "unvoteNews",
    payload: {
      userId,
    },
  });
}

function executeComment(broker, aggregateId, aggregateName, commentId, userId) {
  return broker.call("news.command", {
    aggregateId,
    aggregateName,
    type: "createComment",
    payload: {
      commentId,
      comment: faker.random.words(25),
      userId,
    },
  });
}

function executeRemoveComment(broker, aggregateId, aggregateName, commentId) {
  return broker.call("news.command", {
    aggregateId,
    aggregateName,
    type: "removeComment",
    payload: {
      commentId,
    },
  });
}

function createUser(broker, aggregateId, aggregateName) {
  return broker.call("user.command", {
    aggregateId,
    aggregateName,
    type: "createUser",
    payload: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
    },
  });
}

async function userIdFactory(broker, userIds) {
  if (userIds.length === 0 || Math.floor(Math.random() * 10) < 3) {
    const userId = uuid().toString();
    await createUser(broker, userId, "user");
    userIds.push(userId);
    return userId;
  }
  return popElement([...userIds])[0];
}

async function* generateNewsAggregate(broker, numCommands, delayMs) {
  const aggregateId = uuid().toString();
  const aggregateName = "news";
  await broker
    .call("news.command", {
      aggregateId,
      aggregateName,
      type: "createNews",
      payload: {
        title: faker.lorem.sentence(),
        userId: uuid().toString(),
        text: faker.lorem.paragraph(),
      },
    })
    .catch(console.error);

  // yield `Aggregate id ${aggregateId}`;
  console.log(aggregateId);
  yield `aggregate`;

  const savedVotedUserIds = [];
  const savedCommnetCommentIds = [];
  for (let e = 0; e < numCommands; e++) {
    try {
      const commands = ["up_voted", "un_voted", "comment", "remove_comment"];
      const weights = [70, 10, 15, 5];

      const command = chooseWeighted(commands, weights);

      if (command === "up_voted") {
        const userId = await userIdFactory(broker, savedVotedUserIds);
        if (savedVotedUserIds[savedVotedUserIds.length - 1] === userId) {
          yield "user_created";
        }
        await executeUpVoted(broker, aggregateId, aggregateName, userId);
        await delay(delayMs);
      } else if (command === "un_voted") {
        const [userId] = popElement(savedVotedUserIds);
        if (!userId) {
          e--;
          // eslint-disable-next-line no-continue
          continue;
        }
        await executeUnVoted(broker, aggregateId, aggregateName, userId);
        await delay(delayMs);
      } else if (command === "comment") {
        const userId = await userIdFactory(broker, savedVotedUserIds);
        const commentId = uuid().toString();
        savedCommnetCommentIds.push(commentId);
        await executeComment(
          broker,
          aggregateId,
          aggregateName,
          commentId,
          userId
        );
        await delay(delayMs);
      } else if (command === "remove_comment") {
        const [commentId] = popElement(savedCommnetCommentIds);
        if (!commentId) {
          e--;
          // eslint-disable-next-line no-continue
          continue;
        }
        await executeRemoveComment(
          broker,
          aggregateId,
          aggregateName,
          commentId
        );
        await delay(delayMs);
      }
      yield command;
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = {
  command: "generate <numCommands>",
  description: "Generate a random number of commands with fake data",
  alias: "gen",
  // options: [{ option: "-u, --uppercase", description: "Uppercase the name" }],
  types: {
    // string: ["name"],
    // boolean: ["u", "uppercase"]
  },
  // parse(command, args) {},
  // validate(args) {},
  // help(args) {},
  // allowUnknownOptions: true,
  async action(broker, args) {
    const { numCommands } = args;
    console.log(`Ok, generate ${numCommands} commands`);
    const stats = {
      aggregate: 0,
      up_voted: 0,
      un_voted: 0,
      comment: 0,
      remove_comment: 0,
      user_created: 0,
    };
    const hrstart = process.hrtime();
    // eslint-disable-next-line no-restricted-syntax
    for await (const itemName of generateNewsAggregate(
      broker,
      numCommands,
      1
    )) {
      stats[itemName]++;
    }
    const hrend = process.hrtime(hrstart);
    const count = Object.keys(stats).reduce((acc, key) => acc + stats[key], 0);
    console.log(
      `Generated ${stats.aggregate} aggregati, 
          ${stats.user_created} user created, 
          ${stats.up_voted} up voted, 
          ${stats.un_voted} un voted, 
          ${stats.comment} comments, 
          ${stats.remove_comment} comments removed,
          ${count} → in ${hrend[0]}s ${hrend[1] / 1000000}ms`
    );
  },
};
