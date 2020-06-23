import axios from "axios";
import isBrowser from "is-browser";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");
const csrfToken = state && state.base.csrfToken;
const routePrefix = state && state.base.routePrefix;

export const axiosInstance = axios.create({
  timeout: 10000,
  baseURL: routePrefix,
  headers: { "x-csrf-token": csrfToken }
});
