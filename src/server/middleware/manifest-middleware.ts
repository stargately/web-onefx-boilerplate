import { logger } from "onefx/lib/integrated-gateways/logger";
import { Context } from "onefx/lib/types";
import koa from "koa";

export function manifestMiddleware() {
  return async (ctx: Context, next: koa.Next): Promise<void> => {
    let manifest = {};
    try {
      // eslint-disable-next-line global-require
      manifest = require("../../../dist/asset-manifest.json");
    } catch (e) {
      logger.info(`cannot load manifest: ${e.stack}`);
    }
    ctx.setState("base.manifest", manifest);
    await next();
  };
}
