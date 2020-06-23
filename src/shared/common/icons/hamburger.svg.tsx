import React from "react";

function Hamburger(): JSX.Element {
  return (
    <svg
      height="30"
      viewBox="0 0 30 30"
      width="30"
      xmlns="https://www.w3.org/2000/svg"
    >
      <path
        d="M4 7h22M4 15h22M4 23h22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </svg>
  );
}

export { Hamburger };
