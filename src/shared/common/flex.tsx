import { styled } from "onefx/lib/styletron-react";
import React, { ReactNode } from "react";

type Element = ReactNode;

type PropTypes = {
  children?: Array<Element> | Element;
  column?: boolean;
  center?: boolean;
  nowrap?: boolean;
  alignItems?: string;
  width?: string;
  backgroundColor?: string;
  justifyContent?: string;
  height?: string;
  media?: { [key: string]: { [key: string]: string } };
  alignContent?: string;
} & React.CSSProperties;

const AUTO = "auto";

export function Flex({
  children,
  column = false,
  center,
  nowrap,
  alignItems,
  width = AUTO,
  height = AUTO,
  media = {},
  alignContent = AUTO,
  backgroundColor = AUTO,
  justifyContent,
  ...otherProps
}: PropTypes): JSX.Element {
  // @ts-ignore
  const StyledDiv = styled("div", {
    display: "flex",
    "-webkit-box-flex": 1,
    flexDirection: column ? "column" : "row",
    justifyContent: justifyContent || (center ? "center" : "space-between"),
    "-webkit-justify-content": center ? "center" : "space-between",
    boxSizing: "border-box",
    flexWrap: nowrap ? "nowrap" : "wrap",
    alignContent: alignContent || (center ? "center" : "space-between"),
    alignItems: alignItems || "center",
    width,
    height,
    ...media,
    backgroundColor,
    ...otherProps,
  });

  return <StyledDiv>{children}</StyledDiv>;
}
