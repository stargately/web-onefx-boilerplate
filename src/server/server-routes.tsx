import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { Context } from "onefx/lib/types";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import { setEmailPasswordIdentityProviderRoutes } from "../shared/onefx-auth-provider/email-password-identity-provider/email-password-identity-provider-handler";
import { MyServer } from "./start-server";

export function setServerRoutes(server: MyServer): void {
  // Health checks
  server.get("health", "/health", (ctx: Context) => {
    ctx.body = "OK";
  });

  setApiGateway(server);
  setEmailPasswordIdentityProviderRoutes(server);

  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: Context) => {
    ctx.setState("base.blah", "this is a sample initial state");

    ctx.body = await apolloSSR(ctx, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });
}
