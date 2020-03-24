import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";
import React from "react";
import { Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { Flex } from "../../../common/flex";
import { Footer, FOOTER_ABOVE } from "../../../common/footer";
// @ts-ignore
import initGoogleAnalytics from "../../../common/google-analytics";
import { Head } from "../../../common/head";
import { NotFound } from "../../../common/not-found";
import { colors } from "../../../common/styles/style-color";
import { fonts } from "../../../common/styles/style-font";
import { ContentPadding } from "../../../common/styles/style-padding";
import { TopBar } from "../../../common/top-bar";
import { ForgotPassword } from "./forgot-password";
import { ResetPasswordContainer } from "./reset-password";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

type Props = {
  googleTid?: string;
};

export class IdentityApp extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    return (
      <RootStyle>
        <Head />
        <TopBar />
        <div style={FOOTER_ABOVE}>
          <Route path="/email-token/*">
            <EmailTokenInvalid />
          </Route>
          <Switch>
            <Route exact={true} path="/login">
              <SignIn />
            </Route>
            <Route exact={true} path="/sign-up">
              <SignUp />
            </Route>
            <Route exact={true} path="/forgot-password">
              <ForgotPassword />
            </Route>
            <Route exact={true} path="/email-token/*">
              <ForgotPassword />
            </Route>
            <Route exact={true} path="/settings/reset-password">
              <ResetPasswordContainer />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        <Footer />
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", (_: React.CSSProperties) => ({
  ...fonts.body,
  backgroundColor: colors.black10,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));

function EmailTokenInvalid(): JSX.Element {
  return (
    <Alert>
      <ContentPadding>
        <Flex>
          {t("auth/forgot_password.email_token_failure")}
          <Link to="/forgot-password/">
            <i style={{ color: colors.white }} className="fas fa-times" />
          </Link>
        </Flex>
      </ContentPadding>
    </Alert>
  );
}

const Alert = styled("div", {
  padding: "16px 0 16px 0",
  backgroundColor: colors.error,
  color: colors.white
});
