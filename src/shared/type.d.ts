import type {
  Theme as OneFxTheme,
  StyletronComponent,
  StyleObject,
} from "onefx/lib/styletron-react";
import type { Colors } from "@/shared/common/styles/style-color";
import { StyletronComponent } from "styletron-react";

type FontType = {
  fontFamily: string;
  fontSize: string | number;
  lineHeight: string | number;
  letterSpacing: string | number;
};

declare module "onefx/lib/styletron-react" {
  export declare interface Theme {
    colors: Colors;
    sizing: OneFxTheme.sizing;
    fonts: FontType[];
  }

  export interface StyledFn {
    <
      C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
      P extends Record<string, unknown>
    >(
      component: C,
      style: (
        props: P & {
          $theme: Theme;
        }
      ) => StyleObject
    ): StyletronComponent<
      Pick<
        React.ComponentProps<C>,
        Exclude<
          keyof React.ComponentProps<C>,
          {
            className: string;
          }
        >
      > &
        P
    >;
    <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
      component: C,
      style: StyleObject
    ): StyletronComponent<
      Pick<
        React.ComponentProps<C>,
        Exclude<
          keyof React.ComponentProps<C>,
          {
            className: string;
          }
        >
      >
    >;
  }
  export declare const styled: StyledFn;
}
