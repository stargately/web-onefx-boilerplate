import { StyleObject } from "onefx/lib/styletron-react";
import { shade } from "./styles/shade";

export function colorHover(color: string): StyleObject {
  return {
    color,
    ":hover": {
      color: shade(color)
    }
  };
}
