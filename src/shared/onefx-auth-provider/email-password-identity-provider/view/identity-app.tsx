import { t } from "onefx/lib/iso-i18n";
import { Link, Route, Switch } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React, { useEffect } from "react";
import { Flex } from "@/shared/common/flex";
import { FOOTER_ABOVE, Footer } from "@/shared/common/footer";
import { Head } from "@/shared/common/head";
import { NotFound } from "@/shared/common/not-found";
import { colors } from "@/shared/common/styles/style-color";
import { fonts } from "@/shared/common/styles/style-font";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { TopBar } from "@/shared/common/top-bar";
import { ForgotPassword } from "./forgot-password";
import { ResetPasswordContainer } from "./reset-password";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

const initGoogleAnalytics = require("../../../common/google-analytics");

type Props = {
  googleTid?: string;
};

export const IdentityApp = ({ googleTid }: Props): JSX.Element => {
  useEffect(() => {
    if (googleTid) {
      initGoogleAnalytics({ tid: googleTid });
    }
  }, [googleTid]);
  return (
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
};

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
