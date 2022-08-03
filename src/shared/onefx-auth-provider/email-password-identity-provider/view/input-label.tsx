import { styled } from "onefx/lib/styletron-react";
import { fonts } from "@/shared/common/styles/style-font";

export const InputLabel = styled("label", {
  ...fonts.inputLabel,
  display: "inline-block",
  verticalAlign: "baseline",
  marginBottom: "0.625rem",
});
