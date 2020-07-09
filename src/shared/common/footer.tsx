import React from "react";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { styled, Theme, THEME } from "./styles/theme-provider";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 89;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

export function Footer(): JSX.Element {
  return (
    <Align>
      <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
      <Flex>Built with ❤️ in San Francisco</Flex>
    </Align>
  );
}

const Align = styled("div", ({ $theme = THEME }: { $theme?: Theme }) => ({
  ...contentPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${FOOTER_HEIGHT}px`,
  backgroundColor: $theme.colors.nav02,
  color: $theme?.colors.textReverse
}));
