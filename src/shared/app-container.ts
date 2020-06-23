import { connect } from "react-redux";

import { App } from "./app";

export const AppContainer = connect(
  (state: { base: { analytics: { googleTid: string }; locale: string } }) => ({
    googleTid: state.base.analytics.googleTid,
    locale: state.base.locale
  })
)(App);
