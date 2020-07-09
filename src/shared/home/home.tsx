import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import Row from "antd/lib/grid/row";
import Layout from "antd/lib/layout";
import gql from "graphql-tag";
import { assetURL } from "onefx/lib/asset-url";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { actionSetTheme } from "../common/base-reducer";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { THEME, Theme, styled } from "../common/styles/theme-provider";

const GET_HEALTH = gql`
  {
    health
  }
`;

const ExampleButton = styled(
  "button",
  ({ $theme = THEME }: { $theme?: Theme }) => ({
    backgroundColor: $theme.colors.white,
    borderColor: $theme.colors.black,
    color: $theme.colors.text01,
    fontSize: $theme.sizing[3],
    padding: $theme.sizing[1],
    borderRadius: $theme.sizing[1],
    outline: "none"
  })
);

const StyledContent = styled(
  Layout.Content,
  ({ $theme = THEME }: { $theme?: Theme }) => ({
    backgroundColor: $theme.colors.white,
    padding: $theme.sizing[5]
  })
);

export const Home = connect(
  (state: { base: { themeCode: "dark" | "light" } }) => ({
    themeCode: state.base.themeCode
  }),
  dispatch => ({
    actionSetTheme: (themeCode: "dark" | "light") => {
      dispatch(actionSetTheme(themeCode));
    }
  })
)(
  class HomeInner extends PureComponent<{
    actionSetTheme: (themeCode: "dark" | "light") => void;
    themeCode: "dark" | "light";
  }> {
    public render = (): JSX.Element => (
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
              <Query query={GET_HEALTH}>
                {({
                  loading,
                  error,
                  data
                }: QueryResult<{ health: string }>) => {
                  if (loading) {
                    return (
                      <div>
                        <LoadingOutlined /> Checking Status
                      </div>
                    );
                  }
                  if (error) {
                    return (
                      <div>
                        <CloseCircleTwoTone twoToneColor={colors.error} /> Not
                        OK
                      </div>
                    );
                  }

                  return (
                    <div>
                      <CheckCircleTwoTone twoToneColor={colors.success} />{" "}
                      {data && data.health}
                    </div>
                  );
                }}
              </Query>
            </Row>
            <Row justify={"center"}>
              <ExampleButton
                onClick={() =>
                  this.props.actionSetTheme(
                    this.props.themeCode === "dark" ? "light" : "dark"
                  )
                }
              >
                Toggle {this.props.themeCode === "dark" ? "light" : "dark"} mode
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
  transform: "translatey(0px)",
  animation: "float 6s ease-in-out infinite"
});

const Title = styled("h1", {
  color: colors.secondary,
  margin: "16px"
});
