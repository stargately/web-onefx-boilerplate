import { MyServer } from "@/server/start-server";
import { manifestMiddleware } from "@/server/middleware/manifest-middleware";

export function setMiddleware(server: MyServer): void {
  server.use(manifestMiddleware());
}
