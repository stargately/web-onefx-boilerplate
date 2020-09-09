import DashboardOutlined from "@ant-design/icons/DashboardOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import { t } from "onefx/lib/iso-i18n";
import { Route, Switch, useHistory } from "onefx/lib/react-router";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect } from "react-redux";
import { CommonMargin } from "@/shared/common/common-margin";
import { Head } from "@/shared/common/head";
import { colors } from "@/shared/common/styles/style-color";
import { fonts } from "@/shared/common/styles/style-font";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { TOP_BAR_HEIGHT, TopBar } from "@/shared/common/top-bar";
import { Settings } from "./settings";

// $FlowFixMe
const { Footer, Sider, Content } = Layout;

function Empty(): JSX.Element {
  return <div />;
}

export const RootStyle = styled("div", () => ({
  ...fonts.body,
  backgroundColor: colors.black10,
  color: colors.text01,
  textRendering: "optimizeLegibility",
}));

const ProfileApp: React.FC = () => {
  const history = useHistory();
  const PANES = [
    {
      path: "/profile/",
      tab: (
        <span>
          <DashboardOutlined />
          {t("profile.home")}
        </span>
      ),
      component: Empty,
    },
    {
      path: "/profile/settings/",
      tab: (
        <span>
          <SettingOutlined />
          {t("profile.settings")}
        </span>
      ),
      component: Settings,
    },
  ];

  return (
    <RootStyle>
      <Head />
      <TopBar />
      <Layout>
        <CommonMargin />
        <ContentPadding>
          <Layout
            hasSider
            style={{
              padding: "24px 0",
              background: "#fff",
              minHeight: `calc((100vh - ${TOP_BAR_HEIGHT}px) - 86px)`,
            }}
          >
            <Sider style={{ background: "#fff" }} width={200}>
              <Menu
                defaultSelectedKeys={[
                  String(
                    PANES.findIndex((p) => p.path === history.location.pathname)
                  ),
                ]}
                mode="inline"
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
                  <Route exact key={i} path={p.path}>
                    {p.component}
                  </Route>
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
};

export const ProfileAppContainer = connect(
  (state: { base: { analytics: { googleTid: string } } }) => ({
    googleTid: state.base.analytics.googleTid,
  })
)(ProfileApp);
