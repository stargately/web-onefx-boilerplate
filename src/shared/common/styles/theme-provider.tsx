import React from "react";
import { connect } from "react-redux";
import { createStyled, StyletronWrapper } from "styletron-react";
import { driver, getInitialStyle } from "styletron-standard";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import window from "global/window";
import { colors, colorsDark } from "./style-color";

export type Theme = {
  colors: {
    primary: string;
    secondary: string;

    black: string;
    black95: string;
    black80: string;
    black60: string;
    black40: string;
    black20: string;
    black10: string;

    text01: string;

    white: string;

    error: string; //	Error
    success: string; //	Success
    warning: string; //	Warning
    information: string; //	Information

    nav01: string; //	Global top bar
    nav02: string; //	CTA footer
    nav03: string; //	Global footer
  };
  sizing: Array<string>;
};

export const THEME: Theme = {
  colors,
  sizing: ["2px", "6px", "10px", "16px", "24px", "32px"]
};

const THEME_DARK: Theme = {
  colors: colorsDark,
  sizing: ["2px", "6px", "10px", "16px", "24px", "32px"]
};

export enum ThemeCode {
  light = 0,
  dark = 1
}

const { Provider, Consumer } = React.createContext(THEME);

const isDefaultDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeProvider = connect(
  (state: { base: { themeCode?: ThemeCode } }) => ({
    themeCode:
      state.base.themeCode ||
      (isDefaultDarkMode ? ThemeCode.dark : ThemeCode.light)
  })
)(
  ({
    children,
    themeCode
  }: {
    themeCode?: ThemeCode;
    children: React.ReactNode;
  }): JSX.Element => (
    <Provider value={themeCode ? THEME_DARK : THEME}>{children}</Provider>
  )
);

const wrapper: StyletronWrapper = StyledComponent =>
  function withThemeHOC(props) {
    return (
      <Consumer>
        {theme => <StyledComponent {...props} $theme={theme} />}
      </Consumer>
    );
  };

export const styled = createStyled({ wrapper, getInitialStyle, driver });
