const ApiGateway = require("moleculer-web");
const IO = require("socket.io");

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
  settings: {
    port: process.env.PORT || 3030,

    routes: [
      {
        path: "/api",
        aliases: {
          "POST command-handler": async function(req, res) {
            await this.broker.call(
              `${req.$params.aggregateName}.command`,
              req.$params
            );
            res.end("Command handler dipatched");
          },
          // "GET news-list": "news-list.mapReq",
          // "GET user-list": "user-list.mapReq",
        },
        whitelist: [
          // Access to any actions in all services under "/api" URL
          "**",
        ],
      },
    ],

    // Serve assets from "public" folder
    assets: {
      folder: "public",
    },
  },

  events: {
    "view-model.**": function(payload, sender, event) {
      // this.logger.info("event → payload", sender, event);
      if (this.io) {
        this.io.emit("server.event", {
          sender,
          event,
          payload,
        });
        this.io.emit(event, {
          sender,
          event,
          payload,
        });
      }
    },
  },

  started() {
    // Create a Socket.IO instance, passing it our server
    this.io = IO({ path: "/api/socket.io" });
    this.io.attach(this.server);
    // this.io.path
    // Add a connect listener
    this.io.on("connection", client => {
      this.logger.info("Client connected via websocket!");

      client.on("call", ({ action, params, opts }, done) => {
        this.logger.debug(
          "Received request from client! Action:",
          action,
          ", Params:",
          params
        );

        this.broker
          .call(action, params, opts)
          .then(res => {
            if (done) done(res);
          })
          .catch(err => this.logger.error(err));
      });

      client.on("disconnect", () => {
        this.logger.info("Client disconnected");
      });
    });
  },
};
