import https from "https";
import * as http from "http";
import * as core from 'express-serve-static-core';

import mongoose from "mongoose";
import schema from "./src/graphql/schemasMap";
import { EnvLoader } from "./src/utils/env-loader";
import { graphqlHTTP } from 'express-graphql';

async function handle(event: any, context: any, cb: any) {
  // When using graphqlHTTP this is not being executed
}

function onExpressServerCreated(expressServer: core.Express) {
  // Create GraphQL HTTP server
  expressServer.use(graphqlHTTP({ schema, graphiql: true }) as any);
}

async function onExpressServerListen(server: https.Server | http.Server) {
  const { MONGO_DB_ENDPOINT, IS_HTTPS, HTTPS_PORT } = EnvLoader.getInstance().loadedVariables;

  // MongoDB Connection
  mongoose.connect(MONGO_DB_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true });
  !mongoose.connection ? console.log("Error connecting to MongoDB") : console.log("MongoDB connected successfully");

  console.log(`GraphQL server running using ${Boolean(IS_HTTPS) ? "HTTPS" : "HTTP"} on port ${HTTPS_PORT}`);
}


export { handle, onExpressServerCreated, onExpressServerListen };
