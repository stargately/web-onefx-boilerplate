// @ts-ignore
import { useLocation } from "onefx/lib/react-router";
import React, { useEffect } from "react";

type Props = {
  children: Array<JSX.Element> | JSX.Element | React.Component;
};

export const ScrollToTop: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    // @ts-ignore
    // tslint:disable-next-line:no-unused-expression
    window.ga && window.ga("send", "pageview");
  }, [location]);

  return <>{children}</>;
};
