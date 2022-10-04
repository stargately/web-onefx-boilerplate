import Button from "antd/lib/button";
import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Flex } from "@/shared/common/flex";
import { fullOnPalm, media } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { margin } from "polished";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { PasswordField } from "./password-field";
import { StyleLink } from "./sign-up";

const LOGIN_FORM = "login";

type Props = {
  next: string;
};

const SignInInner = (props: Props): JSX.Element => {
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const onSubmit = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    if (!el) {
      return;
    }
    const {
      email = "",
      password = "",
      next = "/",
    } = serialize(el, {
      hash: true,
    }) as {
      email: string;
      password: string;
      next: string;
    };
    setDisableButton(true);
    setValueEmail(email);
    setValuePassword(password);
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
        setValueEmail(email);
        setValuePassword(valuePassword);
        setErrorEmail("");
        setErrorPassword("");
        setDisableButton(false);
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found": {
            setErrorEmail(error.message);
            break;
          }
          default:
          case "auth/wrong-password": {
            setErrorPassword(error.message);
          }
        }
      }
    } catch (err) {
      window.console.error(`failed to post sign-in: ${err}`);
      let errMsg = err.message;
      if (err.response?.data?.error?.code === "RATE_LIMIT") {
        errMsg = t("auth/ratelimited");
      }
      setValueEmail(email);
      setValuePassword(valuePassword);
      setErrorEmail(errMsg);
      setErrorPassword("");
      setDisableButton(false);
    }
  };

  return (
    <ContentPadding>
      <Flex center>
        <Form id={LOGIN_FORM} onSubmit={onSubmit}>
          <Helmet title={`login - ${t("topbar.brand")}`} />
          <Flex column>
            <TopMargin />
            <H1>{t("auth/sign_in.title")}</H1>
            <EmailField defaultValue={valueEmail} error={errorEmail} />
            <input defaultValue={props.next} hidden name="next" />
            <PasswordField defaultValue={valuePassword} error={errorPassword} />
            <FieldMargin>
              {/*
               */}
              <Button
                htmlType="submit"
                loading={disableButton}
                onClick={(e: React.MouseEvent<HTMLElement>) => onSubmit(e)}
                size="large"
                style={{ width: "100%" }}
                type="primary"
              >
                {t("auth/button_submit")}
              </Button>
            </FieldMargin>
          </Flex>
          {/* <FieldMargin> */}
          {/*  <StyleLink to="/forgot-password"> */}
          {/*    {t("auth/sign_in.forgot_password")} */}
          {/*  </StyleLink> */}
          {/* </FieldMargin> */}
          <FieldMargin>
            <StyleLink to="/sign-up">
              {t("auth/sign_in.switch_to_sign_up")}
            </StyleLink>
          </FieldMargin>
        </Form>
      </Flex>
    </ContentPadding>
  );
};

export const TopMargin = styled("div", ({ $theme }) => ({
  [media.palm]: {
    margin: 0,
  },
  margin: $theme.sizing[5],
}));

export const H1 = styled("h1", ({ $theme }) => ({
  ...margin($theme.sizing[5], 0),
}));

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm,
});

export const SignIn = connect((state: { base: { next: string } }) => ({
  next: state.base.next,
}))(SignInInner);
