import { t } from "onefx/lib/iso-i18n";
import { Link, Route, Switch } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Flex } from "../../../common/flex";
import { FOOTER_ABOVE, Footer } from "../../../common/footer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  public render = (): JSX.Element => (
    <RootStyle>
      <Head />
      <TopBar />
      <div style={FOOTER_ABOVE}>
        <Route path="/email-token/*">
          <EmailTokenInvalid />
        </Route>
        <Switch>
          <Route exact path="/login">
            <SignIn />
          </Route>
          <Route exact path="/sign-up">
            <SignUp />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route exact path="/email-token/*">
            <ForgotPassword />
          </Route>
          <Route exact path="/settings/reset-password">
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

const RootStyle = styled("div", () => ({
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
            <i className="fas fa-times" style={{ color: colors.white }} />
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
