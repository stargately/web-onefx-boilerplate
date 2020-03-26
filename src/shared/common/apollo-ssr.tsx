import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import config from "config";
import fetch from "isomorphic-unfetch";
import koa from "koa";
import { initAssetURL } from "onefx/lib/asset-url";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { getDataFromTree } from "react-apollo";
// @ts-ignore
import * as engine from "styletron-engine-atomic";

type Opts = {
  VDom: JSX.Element;
  reducer: Function;
  clientScript: string;
};

export async function apolloSSR(
  ctx: koa.Context,
  { VDom, reducer, clientScript }: Opts
): Promise<string> {
  const routePrefix = config.get("server.routePrefix") || "";
  ctx.setState(
    "base.apiGatewayUrl",
    `${ctx.origin}${routePrefix}/api-gateway/`
  );
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `http://localhost:${config.get(
        "server.port"
      )}${routePrefix}/api-gateway/`,
      fetch,
      credentials: "same-origin",
      headers: {
        cookie: ctx.get("Cookie")
      }
    }),
    cache: new InMemoryCache()
  });

  const state = ctx.getState();
  initAssetURL(state.base.manifest, state.base.routePrefix);
  const store = configureStore(state, noopReducer);
  const styletron = new engine.Server({ prefix: "_" });

  const context = {};

  try {
    await getDataFromTree(
      <RootServer
        routePrefix={state.base.routePrefix}
        store={store}
        location={ctx.url}
        context={context}
        styletron={styletron}
      >
        <ApolloProvider client={apolloClient}>{VDom}</ApolloProvider>
      </RootServer>
    );
    const apolloState = apolloClient.extract();
    ctx.setState("apolloState", apolloState);
  } catch (e) {
    logger.error(`failed to hydrate apollo SSR: ${e}`);
  }
  return ctx.isoReactRender({
    VDom: <ApolloProvider client={apolloClient}>{VDom}</ApolloProvider>,
    clientScript,
    reducer
  });
}
