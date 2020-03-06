import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined
} from "@ant-design/icons";
import Row from "antd/lib/grid/row";
import Layout from "antd/lib/layout";
import gql from "graphql-tag";
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";

const GET_HEALTH = gql`
  {
    health
  }
`;

export class Home extends PureComponent {
  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Layout>
          <Layout.Content style={{ backgroundColor: "#fff", padding: "32px" }}>
            <Row justify="center">
              <OneFxIcon src={assetURL("/favicon.svg")} />
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
                target="_blank"
                rel="noreferrer nofollow noopener"
              >
                GraphQL Endpoint
              </a>
            </Row>
            <Row justify="center">
              <Query query={GET_HEALTH} ssr={false} fetchPolicy="network-only">
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
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}

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
