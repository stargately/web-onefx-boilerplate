import React from "react";
import { connect } from "react-redux";
import {
  ThemeProvider as ExternalProvider,
  ThemeCode,
  Theme,
} from "onefx/lib/styletron-react";
import { actionSetTheme as setTheme } from "../base-reducer";
import { colors } from "./style-color";

export const THEME: Theme = {
  colors,
  sizing: ["2px", "6px", "10px", "16px", "24px", "32px"],
  fonts: []
};

const THEME_DARK: Theme = THEME; // we actually depends on the main.css for the colors.

export const ThemeProvider = connect(
  (state: { base: { themeCode?: ThemeCode } }) => ({
    themeCode: state.base.themeCode,
  }),
  (dispatch) => ({
    actionSetTheme: (t: "dark" | "light") => {
      return dispatch(setTheme(t));
    },
  })
)(
  ({
    children,
    themeCode,
    actionSetTheme,
  }: {
    themeCode?: ThemeCode;
    children: React.ReactNode;
    actionSetTheme: (t: "dark" | "light") => void;
  }): JSX.Element => {
    return (
      <ExternalProvider
        light={THEME}
        dark={THEME_DARK}
        setTheme={actionSetTheme}
        themeCode={themeCode}
      >
        {children}
      </ExternalProvider>
    );
  }
);
