import { MyServer } from "@/server/start-server";

export type Model = {};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
}
