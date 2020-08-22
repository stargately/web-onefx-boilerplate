import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { Context } from "onefx/lib/types";
import React from "react";
import { apolloSSR } from "@/shared/common/apollo-ssr";
import { MyServer } from "@/server/start-server";
import { ProfileAppContainer } from "./profile-app";

export function setProfileHandler(server: MyServer): void {
  server.get(
    "profile",
    "/profile/*",
    server.auth.authRequired,
    async (ctx: Context) => {
      ctx.setState("base.userId", ctx.state.userId);
      ctx.body = await apolloSSR(ctx, {
        VDom: <ProfileAppContainer />,
        reducer: noopReducer,
        clientScript: "/profile-main.js"
      });
    }
  );
}
