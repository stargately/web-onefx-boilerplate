// @ts-ignore
import React, { useEffect } from "react";
import { useLocation } from "react-router";

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
