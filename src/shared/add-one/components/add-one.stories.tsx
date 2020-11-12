import React from "react";
import { themeDecorator } from "@/shared/common/storybook-utils";
import { AddOne } from "./add-one";

export const Standard = () => <AddOne onPlus={() => null} currentNum={4} />;

export default {
  component: AddOne,
  decorators: [themeDecorator()],
  parameters: {},
  title: "Domains|Team/features/AddOne",
};
