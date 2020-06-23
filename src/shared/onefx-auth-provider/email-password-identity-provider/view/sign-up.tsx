import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { Link } from "onefx/lib/react-router-dom";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { connect } from "react-redux";

import Button from "antd/lib/button";

import { colorHover } from "../../../common/color-hover";
import { Flex } from "../../../common/flex";
import { transition } from "../../../common/styles/style-animation";
import { colors } from "../../../common/styles/style-color";
import { fullOnPalm } from "../../../common/styles/style-media";
import { ContentPadding } from "../../../common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { PasswordField } from "./password-field";

const LOGIN_FORM = "signup";

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

export class SignUpInner extends Component<Props, State> {
  public state: State = {
    errorEmail: "",
    errorPassword: "",

    valueEmail: "",
    valuePassword: "",

    disableButton: false
  };

  public async onSubmit(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
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
      const r = await axiosInstance.post("/api/sign-up/", {
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
          errorEmail: "",
          errorPassword: "",
          disableButton: false
        };
        switch (error.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email": {
            errorState.errorEmail = error.message;
            break;
          }
          default:
          case "auth/weak-password": {
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
            <Helmet title={`Sign Up - ${t("topbar.brand")}`} />
            <Flex column>
              <h1>Create Account</h1>
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
                  onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
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
            <FieldMargin>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("auth/consent", {
                    tosUrl: "/legal/terms-of-service",
                    policyUrl: "/legal/privacy-policy"
                  })
                }}
                style={{ fontSize: "10px" }}
              />
            </FieldMargin>

            <FieldMargin>
              <StyleLink to="/login/">
                {t("auth/sign_up.switch_to_sign_in")}
              </StyleLink>
            </FieldMargin>
          </Form>
        </Flex>
      </ContentPadding>
    );
  }
}

export const StyleLink = styled(Link, {
  ...colorHover(colors.primary),
  textDecoration: "none",
  transition
});

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm
});

export const SignUp = connect((state: { base: { next: string } }) => ({
  next: state.base.next
}))(SignUpInner);
