import Button from "antd/lib/button";
import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Flex } from "@/shared/common/flex";
import { colors } from "@/shared/common/styles/style-color";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { PasswordField } from "./password-field";
import { TextInput } from "./text-input";

const LOGIN_FORM = "reset-password";

type Props = {
  token: string;
};

const ResetPassword = (props: Props): JSX.Element => {
  const [errorPassword, setErrorPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [valueNewPassword, setValueNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    if (!el) {
      return;
    }
    const { newPassword = "", password = "", token = "" } = serialize(el, {
      hash: true,
    }) as { newPassword: string; password: string; token: string };
    setDisableButton(true);
    setValueNewPassword(newPassword);
    setValuePassword(password);
    axiosInstance
      .post("/api/reset-password/", {
        password,
        newPassword,
        token,
      })
      .then((r) => {
        if (r.data.ok) {
          setMessage(t("auth/reset_password.success"));
          setErrorPassword("");
          setErrorNewPassword("");
          setValueNewPassword("");
          setValueNewPassword("");
          setDisableButton(false);
          if (r.data.shouldRedirect) {
            window.setInterval(() => {
              window.location.href = r.data.next;
            }, 3000);
          }
        } else if (r.data.error) {
          const { error } = r.data;
          setValuePassword(password);
          setValueNewPassword(newPassword);
          setErrorPassword("");
          setErrorNewPassword("");
          setMessage("");
          setDisableButton(false);
          if (error.code === "auth/wrong-password") {
            setErrorPassword(error.message);
          }
          if (error.code === "auth/weak-password") {
            setErrorNewPassword(error.message);
          }
        }
      })
      .catch((err) => {
        window.console.error(`failed to post reset-password: ${err}`);
      });
  };

  return (
    <ContentPadding>
      <Flex center minHeight="550px">
        <Form id={LOGIN_FORM}>
          <Helmet title={`login - ${t("topbar.brand")}`} />
          <Flex column>
            <h1>{t("auth/reset_password")}</h1>
            {message && (
              <Info>
                <Flex width="100%">
                  <span>{message}</span>
                  <i
                    className="fas fa-times"
                    onClick={() => setMessage("")}
                    role="button"
                    style={{ color: colors.white, cursor: "pointer" }}
                  />
                </Flex>
              </Info>
            )}
            {props.token ? (
              <input
                defaultValue={props.token}
                hidden
                name="token"
                placeholder=""
              />
            ) : (
              <PasswordField
                defaultValue={valuePassword}
                error={errorPassword}
              />
            )}
            {!message && (
              <FieldMargin>
                <InputLabel>New Password</InputLabel>
                <TextInput
                  aria-label="New Password"
                  defaultValue={valueNewPassword}
                  error={errorNewPassword}
                  name="newPassword"
                  placeholder="New Password"
                  type="password"
                />
                <InputError>{errorNewPassword || "\u0020"}</InputError>
              </FieldMargin>
            )}
            {!message && (
              <FieldMargin>
                {/*
                 */}
                <Button
                  htmlType="submit"
                  loading={disableButton}
                  onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                    onSubmit(e)
                  }
                  size="large"
                  style={{ width: "100%" }}
                  type="primary"
                >
                  {t("auth/button_submit")}
                </Button>
              </FieldMargin>
            )}
          </Flex>
        </Form>
      </Flex>
    </ContentPadding>
  );
};

export const ResetPasswordContainer = connect(
  (state: { base: { token: string } }) => ({
    token: state.base.token,
  })
)(ResetPassword);

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm,
});

const Info = styled("div", {
  padding: "16px",
  width: "100%",
  backgroundColor: colors.success,
  color: colors.white,
});
