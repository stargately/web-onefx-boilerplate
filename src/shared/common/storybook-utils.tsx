import { styled } from "onefx/lib/styletron-react";
import React from "react";
import "../../client/stylesheets/antd.less";
import { Story } from "@storybook/react/types-6-0";
import { BrowserRouter } from "react-router-dom";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as StyletronClient } from "styletron-engine-atomic";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
import { ThemeProvider } from "./styles/theme-provider";

const styletron = new StyletronClient({ prefix: "_" });

export const themeDecorator = () =>
  function Inner(story: Story): JSX.Element {
    return (
      <ReduxProvider store={configureStore({ base: {} })}>
        <StyletronProvider value={styletron}>
          <ThemeProvider>
            <Overlay>
              <MobileContent>
                <BrowserRouter>{React.createElement(story)}</BrowserRouter>
              </MobileContent>
            </Overlay>
          </ThemeProvider>
        </StyletronProvider>
      </ReduxProvider>
    );
  };

const MobileContent = styled("div", () => ({
  width: "360px",
  height: "600px",
}));

const Overlay = styled("div", ({ $theme }) => ({
  width: "100%",
  height: "700px",
  backgroundColor: $theme.colors.black10,
}));
