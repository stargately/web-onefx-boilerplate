import { defaultThemeCode, ThemeCode } from "./styles/theme-provider";

const storeTheme = (newTheme: "light" | "dark") => {
  try {
    localStorage.setItem("theme", newTheme);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export function baseReducer(
  initialState: { themeCode?: ThemeCode } = { themeCode: defaultThemeCode },
  action: { type: string; payload: "light" | "dark" }
): { themeCode?: ThemeCode } {
  if (action.type === "SET_THEME") {
    const themeCode = action.payload === "light" ? "light" : "dark";
    window.document &&
      window.document.documentElement.setAttribute("data-theme", themeCode);
    storeTheme(themeCode);
    return {
      ...initialState,
      themeCode
    };
  }
  if (!initialState.themeCode) {
    initialState.themeCode = defaultThemeCode;
  }
  return initialState;
}

export function actionSetTheme(
  themeCode: "light" | "dark"
): { type: string; payload: "light" | "dark" } {
  return {
    type: "SET_THEME",
    payload: themeCode
  };
}
