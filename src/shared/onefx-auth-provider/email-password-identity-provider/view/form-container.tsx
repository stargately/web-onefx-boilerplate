import React from "react";
import { connect } from "react-redux";

type Props = {
  children?: Array<JSX.Element> | JSX.Element;
  csrfToken: string;
  id: string;
  onSubmit?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  dispatch: any;
};

function Form({
  children,
  csrfToken,
  id,
  dispatch,
  ...props
}: Props): JSX.Element {
  return (
    // @ts-ignore
    <form method="POST" id={id} {...props}>
      <input name="_csrf" type="hidden" value={csrfToken} />
      {children}
    </form>
  );
}

export const FormContainer = connect(
  (state: { base: { csrfToken: string } }) => ({
    csrfToken: state.base.csrfToken,
  })
)(Form);
