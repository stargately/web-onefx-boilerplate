import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStyled, StyletronWrapper } from "styletron-react";
import { driver, getInitialStyle } from "styletron-standard";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import window from "global/window";
import { actionSetTheme as setTheme } from "../base-reducer";
import { colors } from "./style-color";

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `base-reducer.ts`
const storageKey = "theme";
export const noFlashColorMode = ({
  defaultMode,
  respectPrefersColorScheme = true
}: {
  defaultMode: ThemeCode;
  respectPrefersColorScheme?: boolean;
}): string => {
  return `(function() {
  var defaultMode = '${defaultMode}';
  var respectPrefersColorScheme = ${respectPrefersColorScheme};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}
    return theme;
  }

  var storedTheme = getStoredTheme();
  if (storedTheme !== null) {
    setDataThemeAttribute(storedTheme);
  } else {
    if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDataThemeAttribute('dark');
    } else if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setDataThemeAttribute('light');
    } else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

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
    textReverse: string;

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

const THEME_DARK: Theme = THEME; // we actually depends on the main.css for the colors.

export type ThemeCode = "light" | "dark";

const { Provider, Consumer } = React.createContext(THEME);

export const defaultThemeCode =
  window.document && window.document.documentElement.getAttribute("data-theme");

export const ThemeProvider = connect(
  (state: { base: { themeCode?: ThemeCode } }) => ({
    themeCode:
      state.base.themeCode || (defaultThemeCode === "dark" ? "dark" : "light")
  }),
  dispatch => ({
    actionSetTheme: (t: "dark" | "light") => {
      return dispatch(setTheme(t));
    }
  })
)(
  ({
    children,
    themeCode,
    actionSetTheme
  }: {
    themeCode?: ThemeCode;
    children: React.ReactNode;
    actionSetTheme: (t: "dark" | "light") => void;
  }): JSX.Element => {
    useEffect(() => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addListener(({ matches }: { matches: boolean }) => {
          actionSetTheme(matches ? "dark" : "light");
        });
    }, []);

    return (
      <Provider value={themeCode ? THEME_DARK : THEME}>{children}</Provider>
    );
  }
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
