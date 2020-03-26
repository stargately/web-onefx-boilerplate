/* tslint:disable:no-any */
import config from "config";
import { Config, Server } from "onefx/lib/server";
import { setModel } from "../model";
import { OnefxAuth } from "../shared/onefx-auth";
import { authConfig } from "../shared/onefx-auth/auth-config";
import { Gateways, setGateways } from "./gateway/gateway";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

export type MyServer = Server & { [key: string]: any; gateways: Gateways };

export async function startServer(): Promise<Server> {
  const server: MyServer = new Server((config as any) as Config) as MyServer;
  server.app.proxy = Boolean(config.get("server.proxy"));
  setGateways(server);
  server.auth = new OnefxAuth(server, authConfig);
  setMiddleware(server);
  setModel(server);
  setServerRoutes(server);

  const port = Number(process.env.PORT || config.get("server.port"));
  server.listen(port);
  return server;
}
