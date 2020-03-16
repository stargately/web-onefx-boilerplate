import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

export const AppContainer = withRouter(
  connect(
    (state: { base: { analytics: { googleTid: string }; locale: string } }) => {
      return {
        googleTid: state.base.analytics.googleTid,
        locale: state.base.locale
      };
    }
  )(App)
);
