import Button from "antd/lib/button";
import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";

import { connect } from "react-redux";
import { Flex } from "@/shared/common/flex";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { PasswordField } from "./password-field";
import { StyleLink } from "./sign-up";

const LOGIN_FORM = "login";

type State = {
  errorEmail: string;
  errorPassword: string;

  valueEmail: string;
  valuePassword: string;

  disableButton: boolean;
};

type Props = {
  next: string;
};

class SignInInner extends Component<Props, State> {
  public state: State = {
    errorEmail: "",
    errorPassword: "",

    valueEmail: "",
    valuePassword: "",

    disableButton: false
  };

  public async onSubmit(e: React.MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    if (!el) {
      return;
    }
    const { email = "", password = "", next = "" } = serialize(el, {
      hash: true
    }) as {
      email: string;
      password: string;
      next: string;
    };
    this.setState({
      disableButton: true,
      valueEmail: email,
      valuePassword: password
    });
    try {
      const r = await axiosInstance.post("/api/sign-in/", {
        email,
        password,
        next
      });
      if (r.data.ok && r.data.shouldRedirect) {
        window.location.href = r.data.next;
        return;
      }
      if (r.data.error) {
        const { error } = r.data;
        const errorState = {
          valueEmail: email,
          valuePassword: this.state.valuePassword,
          errorEmail: "",
          errorPassword: "",
          disableButton: false
        };
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found": {
            errorState.errorEmail = error.message;
            break;
          }
          default:
          case "auth/wrong-password": {
            errorState.errorPassword = error.message;
          }
        }
        this.setState(errorState);
      }
    } catch (err) {
      window.console.error(`failed to post sign-in: ${err}`);
    }
  }

  public render(): JSX.Element {
    const { errorEmail, errorPassword, valueEmail, valuePassword } = this.state;

    return (
      <ContentPadding>
        <Flex center minHeight="550px">
          <Form id={LOGIN_FORM} onSubmit={this.onSubmit}>
            <Helmet title={`login - ${t("topbar.brand")}`} />
            <Flex column>
              <h1>{t("auth/sign_in.title")}</h1>
              <EmailField defaultValue={valueEmail} error={errorEmail} />
              <input defaultValue={this.props.next} hidden name="next" />
              <PasswordField
                defaultValue={valuePassword}
                error={errorPassword}
              />
              <FieldMargin>
                {/*
                 */}
                <Button
                  htmlType="submit"
                  loading={this.state.disableButton}
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    this.onSubmit(e)
                  }
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
  }
}

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm
});

export const SignIn = connect((state: { base: { next: string } }) => ({
  next: state.base.next
}))(SignInInner);
