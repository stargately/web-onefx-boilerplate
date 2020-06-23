import React from "react";
import { connect } from "react-redux";

type Props = {
  children?: Array<JSX.Element> | JSX.Element;
  csrfToken: string;
  id: string;
  onSubmit?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

function Form({ children, csrfToken, id }: Props): JSX.Element {
  return (
    <form method="POST" id={id}>
      <input name="_csrf" type="hidden" value={csrfToken} />
      {children}
    </form>
  );
}

export const FormContainer = connect(
  (state: { base: { csrfToken: string } }) => ({
    csrfToken: state.base.csrfToken
  })
)(Form);
