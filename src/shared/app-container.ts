import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

type Props = {
  googleTid: string;
};

export const AppContainer = withRouter(
  // @ts-ignore
  connect<Props>(
    (state: object): Props => {
      return {
        // @ts-ignore
        googleTid: state.base.analytics.googleTid
      };
    }
  )(App)
);
