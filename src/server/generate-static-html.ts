import axios from "axios";
import config from "config";
import fs from "fs";
import { startServer } from "@/server/start-server";

const port = config.get("server.port");

async function generateStaticHtml(): Promise<void> {
  await startServer();
  const res = await axios.get(`http://localhost:${port}/`);
  const html = res.data;
  fs.writeFileSync(`${__dirname}/../../dist/index.html`, html);
}

generateStaticHtml().catch((err) => {
  window.console.error(`failed to generate static HTML: ${err}`);
});
