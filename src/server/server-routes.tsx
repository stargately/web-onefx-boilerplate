import koa from "koa";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
// @ts-ignore
import { Server } from "onefx/lib/server";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import { setEmailPasswordIdentityProviderRoutes } from "../shared/onefx-auth-provider/email-password-identity-provider/email-password-identity-provider-handler";

export function setServerRoutes(server: Server): void {
  // Health checks
  server.get("health", "/health", (ctx: koa.Context) => {
    ctx.body = "OK";
  });

  setApiGateway(server);
  setEmailPasswordIdentityProviderRoutes(server);

  // @ts-ignore
  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: koa.Context) => {
    ctx.setState("base.blah", "this is a sample initial state");
    // @ts-ignore
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });
}
