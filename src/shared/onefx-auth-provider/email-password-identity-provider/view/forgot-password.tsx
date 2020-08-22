import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";

import Button from "antd/lib/button";

import { Flex } from "@/shared/common/flex";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { StyleLink } from "./sign-up";

const FORGOT_PASSWORD_FORM = "forgot_password";

type State = {
  errorEmail: string;
  valueEmail: string;
  sent: boolean;
  disableButton: boolean;
};

export class ForgotPassword extends Component<unknown, State> {
  public email = "";

  constructor(props: unknown) {
    super(props);
    this.state = {
      errorEmail: "",
      valueEmail: "",
      sent: false,
      disableButton: false
    };
  }

  public onSubmit(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    const el = window.document.getElementById(
      FORGOT_PASSWORD_FORM
    ) as HTMLFormElement;
    if (!el) {
      return;
    }
    const { email = "" } = serialize(el, { hash: true }) as { email: string };
    this.email = email;
    this.setState({
      disableButton: true,
      valueEmail: email
    });
    axiosInstance
      .post("/api/forgot-password/", {
        email
      })
      .then(r => {
        if (r.data.ok) {
          this.setState({ sent: true });
        } else if (r.data.error) {
          const { error } = r.data;
          const errorState = {
            valueEmail: email,
            errorEmail: "",
            disableButton: false
          };
          if (error.code === "auth/invalid-email") {
            errorState.errorEmail = error.message;
          }
          this.setState(errorState);
        }
      })
      .catch(err => {
        window.console.error(`failed to post forgot password: ${err}`);
      });
  }

  public render(): JSX.Element {
    const { errorEmail, valueEmail, sent } = this.state;

    return (
      <ContentPadding>
        <Flex center minHeight="550px">
          <Form id={FORGOT_PASSWORD_FORM}>
            <Helmet
              title={`${t("auth/forgot_password")} - ${t("meta.title")}`}
            />

            {sent ? (
              <Flex column>
                <h1>{t("auth/forgot_password")}</h1>
                <p>{t("auth/forgot_password.sent", { email: this.email })}</p>
              </Flex>
            ) : (
              <Flex column>
                <h1>{t("auth/forgot_password")}</h1>
                <p>{t("auth/forgot_password.desc")}</p>
                <EmailField defaultValue={valueEmail} error={errorEmail} />
                <FieldMargin>
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
                    {t("auth/forgot_password.send")}
                  </Button>
                </FieldMargin>
              </Flex>
            )}
            <FieldMargin>
              <StyleLink to="/login/">
                {t("auth/forgot_password.back")}
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
