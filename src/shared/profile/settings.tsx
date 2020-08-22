import Divider from "antd/lib/divider";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Button } from "@/shared/common/button";
import { CommonMargin } from "@/shared/common/common-margin";
import { Flex } from "@/shared/common/flex";
import { ResetPasswordContainer } from "../onefx-auth-provider/email-password-identity-provider/view/reset-password";

export function Settings(): JSX.Element {
  return (
    <Flex alignItems="flex-start" column width="100%">
      <h1>{t("profile.settings")}</h1>
      <CommonMargin />

      <Divider orientation="left">{t("auth/reset_password")}</Divider>

      <ResetPasswordContainer />

      <Divider />

      <div>
        <Button href="/logout" secondary>
          {t("auth/sign_out")}
        </Button>
      </div>
    </Flex>
  );
}
