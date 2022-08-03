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
      // @ts-ignore
      <ReduxProvider store={configureStore({ base: {} })}>
        <StyletronProvider value={styletron}>
          <ThemeProvider>
            {/*
            // @ts-ignore */}
            <BrowserRouter>{React.createElement(story)}</BrowserRouter>
          </ThemeProvider>
        </StyletronProvider>
      </ReduxProvider>
    );
  };
