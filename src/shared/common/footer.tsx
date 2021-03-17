import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { border } from "polished";
import { Flex } from "./flex";
import { ContentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 89;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`,
};

export function Footer(): JSX.Element {
  return (
    <Align>
      <ContentPadding>
        <Flexbox>
          <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
          <Flex>Built with ❤️ in San Francisco</Flex>
        </Flexbox>
      </ContentPadding>
    </Align>
  );
}

const Align = styled("div", ({ $theme }) => ({
  ...border("top", "1px", "solid", $theme.colors.black40),
}));

const Flexbox = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${FOOTER_HEIGHT}px`,
});
