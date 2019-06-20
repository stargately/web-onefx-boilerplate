/* tslint:disable:no-any */
import config from "config";
import { Config, Server } from "onefx/lib/server";
import { setModel } from "../model";
import { OnefxAuth } from "../shared/onefx-auth";
import { authConfig } from "../shared/onefx-auth/auth-config";
import { setGateways } from "./gateway/gateway";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

export type MyServer = Server & { [key: string]: any };

export async function startServer(): Promise<Server> {
  const server: MyServer = new Server((config as any) as Config);
  setGateways(server);
  server.auth = new OnefxAuth(server, authConfig);
  setMiddleware(server);
  setModel(server);
  setServerRoutes(server);

  const port = Number(process.env.PORT || config.get("server.port"));
  server.listen(port);
  return server;
}
