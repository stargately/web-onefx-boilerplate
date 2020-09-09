import Button from "antd/lib/button";
import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { useRef, useState } from "react";
import { Flex } from "@/shared/common/flex";
import { fullOnPalm } from "@/shared/common/styles/style-media";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { StyleLink } from "./sign-up";

const FORGOT_PASSWORD_FORM = "forgot_password";

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm,
});

const ForgotPassword = (): JSX.Element => {
  const [errorEmail, setErrorEmail] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const emailRef = useRef("");

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.preventDefault();
    const el = window.document.getElementById(
      FORGOT_PASSWORD_FORM
    ) as HTMLFormElement;
    if (!el) {
      return;
    }
    const { email = "" } = serialize(el, { hash: true }) as { email: string };
    emailRef.current = email;
    setDisableButton(true);
    setValueEmail(email);
    axiosInstance
      .post("/api/forgot-password/", {
        email,
      })
      .then((r) => {
        if (r.data.ok) {
          setSent(true);
        } else if (r.data.error) {
          const { error } = r.data;
          setValueEmail(email);
          setErrorEmail("");
          setDisableButton(false);
          if (error.code === "auth/invalid-email") {
            setErrorEmail(error.message);
          }
        }
      })
      .catch((err) => {
        window.console.error(`failed to post forgot password: ${err}`);
      });
  };

  return (
    <ContentPadding>
      <Flex center minHeight="550px">
        <Form id={FORGOT_PASSWORD_FORM}>
          <Helmet title={`${t("auth/forgot_password")} - ${t("meta.title")}`} />

          {sent ? (
            <Flex column>
              <h1>{t("auth/forgot_password")}</h1>
              <p>
                {t("auth/forgot_password.sent", { email: emailRef.current })}
              </p>
            </Flex>
          ) : (
            <Flex column>
              <h1>{t("auth/forgot_password")}</h1>
              <p>{t("auth/forgot_password.desc")}</p>
              <EmailField defaultValue={valueEmail} error={errorEmail} />
              <FieldMargin>
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
                  {t("auth/forgot_password.send")}
                </Button>
              </FieldMargin>
            </Flex>
          )}
          <FieldMargin>
            <StyleLink to="/login/">{t("auth/forgot_password.back")}</StyleLink>
          </FieldMargin>
        </Form>
      </Flex>
    </ContentPadding>
  );
};

export { ForgotPassword };
