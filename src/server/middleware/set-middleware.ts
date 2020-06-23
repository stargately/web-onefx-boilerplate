import { MyServer } from "../start-server";
import { manifestMiddleware } from "./manifest-middleware";

export function setMiddleware(server: MyServer): void {
  server.use(manifestMiddleware());
}
