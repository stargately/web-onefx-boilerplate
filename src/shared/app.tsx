// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { Footer, FOOTER_ABOVE } from "./common/footer";
// @ts-ignore
import initGoogleAnalytics from "./common/google-analytics";
import { Head } from "./common/head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { Home } from "./home/home";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    const { locale } = this.props;

    return (
      <RootStyle>
        <Head locale={locale} />
        <TopBar />
        <div style={FOOTER_ABOVE}>
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </div>
        <Footer />
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", () => ({
  ...fonts.body,
  backgroundColor: colors.black10,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));
