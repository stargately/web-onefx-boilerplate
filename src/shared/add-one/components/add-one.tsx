import React from "react";

type Props = {
  currentNum: number;
  onPlus: (val: number) => void;
};

export const AddOne: React.FC<Props> = ({ currentNum, onPlus }) => {
  return (
    <div>
      <div>{currentNum}</div>
      <button onClick={() => onPlus(1)}>+1</button>
    </div>
  );
};
