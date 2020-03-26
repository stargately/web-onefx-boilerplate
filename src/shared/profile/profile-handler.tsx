import koa from "koa";
import { Server } from "onefx";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { apolloSSR } from "../common/apollo-ssr";
import { ProfileAppContainer } from "./profile-app";

export function setProfileHandler(server: Server): void {
  server.get(
    "/profile/*",
    // @ts-ignore
    server.auth.authRequired,
    async (ctx: koa.Context, _: Function) => {
      ctx.setState("base.userId", ctx.state.userId);
      // @ts-ignore
      ctx.body = await apolloSSR(ctx, {
        VDom: <ProfileAppContainer />,
        reducer: noopReducer,
        clientScript: "/profile-main.js"
      });
    }
  );
}
