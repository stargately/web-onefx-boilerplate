import React from "react";
import { FieldMargin } from "./field-margin";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { TextInput } from "./text-input";

type Props = {
  error: string;
  defaultValue: string;
};

export function EmailField({ error, defaultValue }: Props): JSX.Element {
  return (
    <FieldMargin>
      <InputLabel htmlFor="email">Email</InputLabel>
      <TextInput
        aria-label="email"
        defaultValue={defaultValue}
        error={error}
        id="email"
        name="email"
        placeholder="email@example.com"
        required
        type="email"
      />
      <InputError>{error || "\u0020"}</InputError>
    </FieldMargin>
  );
}
