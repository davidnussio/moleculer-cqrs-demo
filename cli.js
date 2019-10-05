/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
const vorpal = require("vorpal")();

// eslint-disable-next-line import/no-extraneous-dependencies
// const uuid = require("uuid/v4");
// const faker = require("faker");

const generateAggregate = require("./registered-commands/generate-aggregate");

vorpal
  .command("create aggregate")
  .autocomplete(["aggregate"])
  .action(function(args, callback) {
    generateAggregate.action(callback, args);
  });

vorpal.show().parse(process.argv);
