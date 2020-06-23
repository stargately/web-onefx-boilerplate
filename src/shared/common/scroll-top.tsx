import { useLocation } from "onefx/lib/react-router";
import React, { useEffect } from "react";

type Props = {
  children: Array<JSX.Element> | JSX.Element | React.Component;
};

export const ScrollToTop: React.FC<Props> = ({ children }: Props) => {
  const location = useLocation();
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ga && window.ga("send", "pageview");
  }, [location]);

  return <>{children}</>;
};
