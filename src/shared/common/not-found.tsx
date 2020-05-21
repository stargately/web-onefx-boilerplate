import { t } from "onefx/lib/iso-i18n";
import { Route } from "onefx/lib/react-router";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ErrorPage } from "./error-page";

export function NotFound(): JSX.Element {
  return (
    <Status code={404}>
      <ErrorPage
        bar={t("not_found.bar")}
        title={t("not_found.title")}
        info={t("not_found.info")}
      />
    </Status>
  );
}

type Props = {
  code: number;
  children: Array<JSX.Element> | JSX.Element;
};

const Status = ({ code, children }: Props): JSX.Element => (
  <Route
    children={({ staticContext }: RouteComponentProps) => {
      if (staticContext) {
        staticContext.statusCode = code;
      }
      return children;
    }}
  />
);
