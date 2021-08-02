import https from "https";
import * as http from "http";
import * as core from 'express-serve-static-core';
import { PathParams } from "express-serve-static-core";

import { execute, subscribe } from 'graphql';
import ws from "ws";
import schema from "./src/graphql/schemasMap";
import { PubSubSingleton } from "./src/graphql/PubSubSingleton";
import { EnvLoader } from "./src/utils/env-loader";
import { graphqlHTTP } from 'express-graphql';
import { useServer } from "graphql-ws/lib/use/ws"
import cors from "cors";
require('dotenv').config();

async function handle(event: any, context: any, cb: any) {
  // When using graphqlHTTP this is not being executed
  const result = {
    body: JSON.stringify(event.body),
    "content-type": event.headers["content-type"],
  };
  return context.status(200).succeed(result);
}



function onExpressServerCreated(expressServer: core.Express): PathParams {
  expressServer.use(cors());
  expressServer.use(graphqlHTTP({ schema, graphiql: true }) as any);
  return "";
}

async function onExpressServerListen(server: https.Server | http.Server) {
  const {
    MONGO_DB_ENDPOINT,
    IS_HTTPS = false,
    SSL_CRT_FILE,
    SSL_KEY_FILE,
    HTTPS_PORT = 3000
  } = EnvLoader.getInstance().loadedVariables;

  const wssPath = '/subscriptions'
  console.log(`GraphQL server running using ${Boolean(IS_HTTPS) ? "HTTPS" : "HTTP"} on port ${HTTPS_PORT}`);

  // THIS DOESN'T WORK FOR NOW

  const wsServer = new ws.Server({ server, path: wssPath });
  wsServer.on('connection', function connection(ws, req) {
    console.log("WEB SOCKETS", { ws, req })
    ws.on('message', function (message) {
      console.log({ ws, req, message });
    });
    ws.on('disconnect', function () {
      console.log({ wsServer, ws, req });
    });
  });

  useServer({ schema, execute, subscribe }, wsServer);

  console.log(`WebSockets server running ${Boolean(IS_HTTPS) ? "using SSL" : "without SSL"} on port ${HTTPS_PORT} at ${wssPath}`, wsServer);

  let i = 0;
  setInterval(async () => {
    i++;
    PubSubSingleton.getInstance().publish("TEST", { newUpdate: { result: "A number! " + i } })
  }, 1000)

  // THIS DOESN'T WORK FOR NOW
}



export { handle, onExpressServerCreated, onExpressServerListen };
