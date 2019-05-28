import config from "config";
import { Server } from "onefx/lib/server";
import { setModel } from "../model";
import { OnefxAuth } from "../shared/onefx-auth";
import { authConfig } from "../shared/onefx-auth/auth-config";
import { setGateways } from "./gateway/gateway";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

// tslint:disable-next-line
export type MyServer = Server & { [key: string]: any };

export async function startServer(): Promise<Server> {
  // @ts-ignore
  const server = new Server(config);
  setGateways(server);
  server.auth = new OnefxAuth(server, authConfig);
  setMiddleware(server);
  setModel(server);
  setServerRoutes(server);

  const port = process.env.PORT || config.get("server.port");
  server.listen(port);
  return server;
}
