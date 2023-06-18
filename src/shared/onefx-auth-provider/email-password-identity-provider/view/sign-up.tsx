import Button from "antd/lib/button";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import { Link, useLocation } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect } from "react-redux";
import { colorHover } from "@/shared/common/color-hover";
import { Flex } from "@/shared/common/flex";
import { transition } from "@/shared/common/styles/style-animation";
import { colors } from "@/shared/common/styles/style-color";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { useRoutePrefix } from "@/shared/common/hooks/use-route-prefix";
import Input from "antd/lib/input";
import Checkbox from "antd/lib/checkbox";
import Form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import { H1, TopMargin } from "./sign-in";
import { axiosInstance } from "./axios-instance";

type Props = {
  next: string;
};

const SignUpInner = (props: Props): JSX.Element => {
  const routePrefix = useRoutePrefix();
  const { search } = useLocation();
  const { next = `${routePrefix}/` } = props;

  const [form] = useForm();

  const onFinish = async (values: any) => {
    const { email, password, subscribedToNewsletter } = values;

    try {
      const r = await axiosInstance.post("/api/sign-up/", {
        email,
        password,
        next,
        subscribedToNewsletter,
      });
      if (r.data.ok && r.data.shouldRedirect) {
        window.location.href = r.data.next;
        return;
      }
      if (r.data.error) {
        const { error } = r.data;
        switch (error.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email": {
            form.setFields([
              {
                name: "email",
                errors: [error.message],
              },
            ]);

            break;
          }
          default:
          case "auth/weak-password": {
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
      window.console.error(`failed to post sign-up: ${err}`);
    }
  };

  return (
    <ContentPadding>
      <Helmet title={`Sign Up - ${t("topbar.brand")}`} />
      <Flex column>
        <TopMargin />

        <WrappedForm
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <H1>{t("auth/create_account")}</H1>

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

          <Form.Item
            name="subscribedToNewsletter"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Subscribe to newsletter</Checkbox>
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

            <div
              dangerouslySetInnerHTML={{
                __html: t("auth/consent", {
                  tosUrl: "/p/legal/terms-of-service",
                  policyUrl: "/p/legal/privacy-policy",
                }),
              }}
              style={{ fontSize: "12px" }}
            />
          </Form.Item>

          <Form.Item>
            <StyleLink to={`/login/${search}`}>
              {t("auth/sign_up.switch_to_sign_in")}
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

export const StyleLink = styled(Link, {
  ...colorHover(colors.primary),
  textDecoration: "none",
  transition,
});

export const SignUp = connect((state: { base: { next: string } }) => ({
  next: state.base.next,
}))(SignUpInner);
