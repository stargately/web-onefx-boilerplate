import { Switch } from "onefx/lib/react-router";
import { Route } from "onefx/lib/react-router-dom";
import React, { useEffect } from "react";
import { FOOTER_ABOVE, Footer } from "./common/footer";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { Head } from "./common/head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { Home } from "./home/home";
import { styled, Theme, THEME } from "./common/styles/theme-provider";

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

const RootStyle = styled("div", ({ $theme = THEME }: { $theme?: Theme }) => ({
  ...fonts.body,
  backgroundColor: $theme?.colors.black10,
  color: $theme?.colors.text01,
  textRendering: "optimizeLegibility"
}));
