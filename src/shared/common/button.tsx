import { styled, StyleObject } from "onefx/lib/styletron-react";
import React, { useRef } from "react";

import {
  btnStyle,
  disabledBtn,
  secondaryBtnColor,
} from "./styles/style-button";

type Props = {
  id?: string;
  href?: string;
  children?: Array<JSX.Element> | JSX.Element | string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  secondary?: boolean;
  disabled?: boolean;
  target?: string;
  width?: string;
};

const Button = ({
  href,
  children,
  secondary,
  disabled,
  target,
  width,
  id,
  onClick,
}: Props): JSX.Element => {
  const wrapper = useRef(null);

  let style = btnStyle;
  if (secondary) {
    style = {
      ...style,
      ...secondaryBtnColor,
    };
  }
  if (disabled) {
    style = {
      ...style,
      ...disabledBtn,
    };
  }
  if (width) {
    style = {
      ...style,
      width,
    };
  }

  const MyButton = styled(href ? "a" : "button", style as StyleObject);

  return (
    <div ref={wrapper}>
      <MyButton
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        href={href}
        id={id}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (onClick) {
            return onClick(e);
          }
          return true;
        }}
        target={target}
      >
        {children}
      </MyButton>
    </div>
  );
};

export { Button };
