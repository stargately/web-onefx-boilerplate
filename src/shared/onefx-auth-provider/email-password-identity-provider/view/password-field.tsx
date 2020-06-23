import React from "react";
import { FieldMargin } from "./field-margin";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { TextInput } from "./text-input";

type Props = {
  defaultValue: string;
  error: string;
  onChange?: () => void;
};

export function PasswordField({
  defaultValue,
  error,
  onChange
}: Props): JSX.Element {
  return (
    <FieldMargin>
      <InputLabel htmlFor="email-login-password">Password</InputLabel>
      <TextInput
        aria-label="Password"
        defaultValue={defaultValue}
        error={error}
        id="email-login-password"
        name="password"
        onChange={onChange}
        placeholder="Password"
        type="password"
      />
      <InputError>{error || "\u0020"}</InputError>
    </FieldMargin>
  );
}
