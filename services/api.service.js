"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,

    routes: [
      {
        path: "/api",
        aliases: {
          async "POST command-handler"(req, res) {
            await this.broker.call(
              `${req.$params.aggregateName}.command`,
              req.$params
            );
            res.end("Command handler dipatched");
          }
        },
        whitelist: [
          // Access to any actions in all services under "/api" URL
          "**"
        ]
      }
    ],

    // Serve assets from "public" folder
    assets: {
      folder: "public"
    }
  }
};
