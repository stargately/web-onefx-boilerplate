import { connect } from "react-redux";
import { IdentityApp } from "./identity-app";

type State = {
  base: {
    analytics: {
      googleTid: string;
    };
    locale: string;
  };
};

export const IdentityAppContainer = connect((state: State) => {
  return {
    googleTid: state.base.analytics.googleTid,
    locale: state.base.locale
  };
})(IdentityApp);
