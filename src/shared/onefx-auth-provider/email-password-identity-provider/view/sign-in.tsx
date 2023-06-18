import Button from "antd/lib/button";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "@/shared/common/flex";
import { fullOnPalm, media } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { margin } from "polished";
import { useLocation } from "onefx/lib/react-router-dom";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import { useRoutePrefix } from "@/shared/common/hooks/use-route-prefix";
import { StyleLink } from "./sign-up";
import { axiosInstance } from "./axios-instance";

type Props = {
  next: string;
};

const SignInInner = (props: Props): JSX.Element => {
  const routePrefix = useRoutePrefix();
  const { search } = useLocation();
  const { next = `${routePrefix}/` } = props;

  const [form] = useForm();

  const onFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const r = await axiosInstance.post("/api/sign-in/", {
        email,
        password,
        next,
      });
      if (r.data.ok && r.data.shouldRedirect) {
        window.location.href = r.data.next;
        return;
      }
      if (r.data.error) {
        const { error } = r.data;
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found": {
            form.setFields([
              {
                name: "email",
                errors: [error.message],
              },
            ]);
            break;
          }
          default:
          case "auth/wrong-password": {
            form.setFields([
              {
                name: "password",
                errors: [error.message],
              },
            ]);
          }
        }
      }
    } catch (err) {
      window.console.error(`failed to post sign-in: ${err}`);
      if (err.response?.data?.error?.code === "RATE_LIMIT") {
        form.setFields([
          {
            name: "email",
            errors: [t("auth/ratelimited")],
          },
        ]);
      }
    }
  };

  return (
    <ContentPadding>
      <Helmet title={`login - ${t("topbar.brand")}`} />
      <Flex column>
        <TopMargin />

        <WrappedForm
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <H1>{t("auth/sign_in.title")}</H1>

          <Form.Item
            label="EMAIL"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input autoFocus placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="PASSWORD"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              style={{ width: "100%" }}
            >
              {t("auth/button_submit")}
            </Button>
          </Form.Item>

          <Form.Item>
            <StyleLink to={`/sign-up/${search}`}>
              {t("auth/sign_in.switch_to_sign_up")}
            </StyleLink>
          </Form.Item>
        </WrappedForm>
      </Flex>
    </ContentPadding>
  );
};

const WrappedForm = styled(Form, {
  width: "340px",
  ...fullOnPalm,
});

export const TopMargin = styled("div", ({ $theme }) => ({
  [media.palm]: {
    margin: 0,
  },
  margin: $theme.sizing[5],
}));

export const H1 = styled("h1", ({ $theme }) => ({
  ...margin($theme.sizing[5], 0),
}));

export const SignIn = connect((state: { base: { next: string } }) => ({
  next: state.base.next,
}))(SignInInner);
