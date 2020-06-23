import { StyleObject, styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";

import {
  btnStyle,
  disabledBtn,
  secondaryBtnColor
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

export class Button extends Component<Props> {
  public wrapper: HTMLDivElement | null = null;

  public render(): JSX.Element {
    const {
      href,
      children,
      onClick,
      secondary,
      disabled,
      target,
      width,
      id
    } = this.props;
    let style = btnStyle;
    if (secondary) {
      style = {
        ...style,
        ...secondaryBtnColor
      };
    }
    if (disabled) {
      style = {
        ...style,
        ...disabledBtn
      };
    }
    if (width) {
      style = {
        ...style,
        width
      };
    }
    const MyButton = styled(href ? "a" : "button", style as StyleObject);

    return (
      <div
        ref={r => {
          this.wrapper = r;
        }}
      >
        {/*
        // @ts-ignore */}
        <MyButton
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
  }
}
