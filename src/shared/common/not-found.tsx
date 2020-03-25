import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import OnefxRouter from "onefx/lib/router";
import { ErrorPage } from "./error-page";

const { Route } = OnefxRouter;

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
    children={({
      staticContext
    }: OnefxRouter.RouteComponentProps<{}, OnefxRouter.StaticContext>) => {
      if (staticContext) {
        staticContext.statusCode = code;
      }
      return children;
    }}
  />
);
