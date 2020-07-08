import { ThemeCode } from "./styles/theme-provider";

export function baseReducer(
  initialState: { themeCode?: ThemeCode } = {},
  action: { type: string }
): { themeCode?: ThemeCode } {
  if (action.type === "TOGGLE_THEME") {
    return {
      ...initialState,
      themeCode: initialState.themeCode ? ThemeCode.light : ThemeCode.dark
    };
  }
  return initialState;
}

export function actionToggleTheme(): { type: string } {
  return {
    type: "TOGGLE_THEME"
  };
}
