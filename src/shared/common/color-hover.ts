import { shade } from "./styles/shade";

export function colorHover(color: string): Record<string, unknown> {
  return {
    color,
    ":hover": {
      color: shade(color),
    },
  };
}
