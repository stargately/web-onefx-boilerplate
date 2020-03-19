import { DashboardOutlined, SettingOutlined } from "@ant-design/icons";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import { History } from "history";
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router";
import { CommonMargin } from "../common/common-margin";
import { Head } from "../common/head";
import { colors } from "../common/styles/style-color";
import { fonts } from "../common/styles/style-font";
import { ContentPadding } from "../common/styles/style-padding";
import { TopBar, TOP_BAR_HEIGHT } from "../common/top-bar";
import { Settings } from "./settings";

// $FlowFixMe
const { Footer } = Layout;

type Props = {
  history: History;
};

type State = {
  toggled: boolean;
};

function Empty(): JSX.Element {
  return <div />;
}

export const RootStyle = styled("div", (_: React.CSSProperties) => ({
  ...fonts.body,
  backgroundColor: colors.black10,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));

class ProfileApp extends PureComponent<Props, State> {
  public state: State = { toggled: false };

  public render(): JSX.Element {
    const { history } = this.props;
    const { Sider, Content } = Layout;

    const PANES = [
      {
        path: "/profile/",
        tab: (
          <span>
            <DashboardOutlined />
            {t("profile.home")}
          </span>
        ),
        component: Empty
      },
      {
        path: "/profile/settings/",
        tab: (
          <span>
            <SettingOutlined />
            {t("profile.settings")}
          </span>
        ),
        component: Settings
      }
    ];

    return (
      <RootStyle>
        <Head />
        <TopBar />
        <Layout>
          <CommonMargin />
          <ContentPadding>
            <Layout
              style={{
                padding: "24px 0",
                background: "#fff",
                minHeight: `calc((100vh - ${TOP_BAR_HEIGHT}px) - 86px)`
              }}
              hasSider={true}
            >
              <Sider width={200} style={{ background: "#fff" }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[
                    String(
                      PANES.findIndex(p => p.path === history.location.pathname)
                    )
                  ]}
                  style={{ height: "100%" }}
                >
                  {PANES.map((p, i) => (
                    <Menu.Item
                      key={i}
                      onClick={() => history.push(PANES[i].path)}
                    >
                      {p.tab}
                    </Menu.Item>
                  ))}
                </Menu>
              </Sider>
              <Content style={{ background: "#fff", margin: "0 16px" }}>
                <Switch>
                  {PANES.map((p, i) => (
                    <Route
                      key={i}
                      path={p.path}
                      exact={true}
                      component={p.component}
                    />
                  ))}
                </Switch>
              </Content>
            </Layout>

            <Footer style={{ textAlign: "center" }}>
              Copyright © {new Date().getFullYear()} {t("topbar.brand")} · Built
              with ❤️ in San Francisco
            </Footer>
          </ContentPadding>
        </Layout>
      </RootStyle>
    );
  }
}

type ConnectProps = {
  googleTid: string;
};

export const ProfileAppContainer = withRouter(
  // @ts-ignore
  connect<ConnectProps>((state: object): { googleTid: string } => {
    return {
      // @ts-ignore
      googleTid: state.base.analytics.googleTid
    };
  })(ProfileApp)
);
