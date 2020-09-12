import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

export const apolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link: new HttpLink({
    uri: apiGatewayUrl,
    fetch,
    credentials: "same-origin",
    headers: { "x-csrf-token": csrfToken },
  }),
  cache: new InMemoryCache().restore(apolloState),
});
