import React from "react";
import { actionSetTheme } from "@/shared/common/base-reducer";
import { colors } from "@/shared/common/styles/style-color";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { HealthController } from "@/shared/home/health-controller";
import Row from "antd/lib/grid/row";
import Layout from "antd/lib/layout";
import { assetURL } from "onefx/lib/asset-url";
import { styled } from "onefx/lib/styletron-react";
import { connect } from "react-redux";

const ExampleButton = styled("button", ({ $theme }) => {
  return {
    backgroundColor: $theme.colors.white,
    borderColor: $theme.colors.black,
    color: $theme.colors.text01,
    fontSize: $theme.sizing[3],
    padding: $theme.sizing[1],
    borderRadius: $theme.sizing[1],
    outline: "none",
  };
});

const StyledContent = styled(Layout.Content, ({ $theme }) => ({
  backgroundColor: $theme.colors.white,
  padding: $theme.sizing[5],
}));

export const Home = connect(
  (state: { base: { themeCode: "dark" | "light" } }) => ({
    themeCode: state.base.themeCode,
  }),
  (dispatch) => ({
    actionSetTheme: (themeCode: "dark" | "light") => {
      dispatch(actionSetTheme(themeCode));
    },
  })
)(
  (props: {
    actionSetTheme: (themeCode: "dark" | "light") => void;
    themeCode: "dark" | "light";
  }): JSX.Element => {
    return (
      <ContentPadding>
        <Layout>
          <StyledContent>
            <Row justify="center">
              <OneFxIcon src={assetURL("favicon.svg")} />
            </Row>
            <Row justify="center">
              <Title>OneFx</Title>
            </Row>
            <Row justify="center">
              <p>Building Web & Mobile Apps with Speed & Quality</p>
            </Row>
            <Row justify="center">
              <a
                href="/api-gateway/"
                rel="noreferrer nofollow noopener"
                target="_blank"
              >
                GraphQL Endpoint
              </a>
            </Row>
            <Row justify="center">
              <HealthController />
            </Row>
            <Row justify={"center"}>
              <ExampleButton
                onClick={() =>
                  props.actionSetTheme(
                    props.themeCode === "dark" ? "light" : "dark"
                  )
                }
              >
                Toggle {props.themeCode === "dark" ? "light" : "dark"} mode
              </ExampleButton>
            </Row>
          </StyledContent>
        </Layout>
      </ContentPadding>
    );
  }
);

const OneFxIcon = styled("img", {
  width: "150px",
  height: "150px",
  boxSizing: "border-box",
  border: "5px white solid",
  borderRadius: "50%",
  overflow: "hidden",
  boxShadow: "0 5px 15px 0px rgba(0,0,0,0.6)",
  transform: "translate-y(0px)",
  animation: "float 6s ease-in-out infinite",
});

const Title = styled("h1", {
  color: colors.secondary,
  margin: "16px",
});
