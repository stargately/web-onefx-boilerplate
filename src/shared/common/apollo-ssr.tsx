import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import ApolloLinkTimeout from "apollo-link-timeout";
import config from "config";
import fetch from "isomorphic-unfetch";
import { initAssetURL } from "onefx/lib/asset-url";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
import { Context, ViewState } from "onefx/lib/types";
import React from "react";

import { getDataFromTree } from "@apollo/client/react/ssr";

import { Reducer } from "redux";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as engine from "styletron-engine-atomic";
import { ThemeProvider } from "./styles/theme-provider";

const ROUTE_PREFIX = config.get("server.routePrefix") || "";
const timeoutLink = new ApolloLinkTimeout(100);

type Opts = {
  VDom: JSX.Element;
  reducer: Reducer;
  clientScript: string;
};

export async function apolloSSR(
  ctx: Context,
  { VDom, reducer, clientScript }: Opts
): Promise<string> {
  ctx.setState(
    "base.apiGatewayUrl",
    `${ctx.origin}${ROUTE_PREFIX}/api-gateway/`
  );
  const httpLink = createHttpLink({
    uri: `http://localhost:${config.get(
      "server.port"
    )}${ROUTE_PREFIX}/api-gateway/`,
    fetch,
    credentials: "same-origin",
    headers: {
      cookie: ctx.get("Cookie"),
    },
  });
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: timeoutLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = (ctx.getState() as any) as ViewState;
  initAssetURL(state.base.manifest, state.base.routePrefix, state.base.cdnBase);
  const store = configureStore(state, noopReducer);
  const styletron = new engine.Server({ prefix: "_" });

  const context = {};

  try {
    await getDataFromTree(
      <RootServer
        context={context}
        location={ctx.url}
        routePrefix={state.base.routePrefix}
        store={store}
        styletron={styletron}
      >
        <ApolloProvider client={apolloClient}>
          <ThemeProvider>{VDom}</ThemeProvider>
        </ApolloProvider>
      </RootServer>
    );
    const apolloState = apolloClient.extract();
    ctx.setState("apolloState", apolloState);
  } catch (e) {
    logger.error(`failed to hydrate apollo SSR: ${e}`);
  }
  return ctx.isoReactRender({
    VDom: (
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>{VDom}</ThemeProvider>
      </ApolloProvider>
    ),
    clientScript,
    reducer,
  });
}
