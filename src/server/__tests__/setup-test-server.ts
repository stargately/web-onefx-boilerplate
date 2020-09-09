import test from "ava";
import { Server } from "onefx";
import { startServer } from "@/server";

let server: Server;

export function setupTestServer(): void {
  test.before("Set up server", async () => {
    server = await startServer();
  });

  test.after.cb("Teardown server", (t) => {
    server.close(t.end);
  });
}
