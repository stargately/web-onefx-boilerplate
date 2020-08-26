import { Switch } from "onefx/lib/react-router";
import { Route } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React, { useEffect } from "react";
import { FOOTER_ABOVE, Footer } from "@/shared/common/footer";
import { Head } from "@/shared/common/head";
import { NotFound } from "@/shared/common/not-found";
import { ScrollToTop } from "@/shared/common/scroll-top";
import { fonts } from "@/shared/common/styles/style-font";
import { TopBar } from "@/shared/common/top-bar";
import { Home } from "@/shared/home/home";

const initGoogleAnalytics = require("./common/google-analytics");

type Props = {
  googleTid: string;
};

export function App(props: Props): JSX.Element {
  useEffect(() => {
    initGoogleAnalytics({ tid: props.googleTid });
  }, []);
  return (
    <RootStyle>
      <Head />
      <TopBar />
      <div style={FOOTER_ABOVE}>
        <ScrollToTop>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </ScrollToTop>
      </div>
      <Footer />
    </RootStyle>
  );
}

const RootStyle = styled("div", ({ $theme }) => ({
  ...fonts.body,
  backgroundColor: $theme?.colors.black10,
  color: $theme?.colors.text01,
  textRendering: "optimizeLegibility"
}));
