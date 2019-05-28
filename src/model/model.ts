// @ts-ignore
import { Server } from "onefx/lib/server";

export function setModel(server: Server): void {
  // @ts-ignore
  server.model = server.model || {};
}
