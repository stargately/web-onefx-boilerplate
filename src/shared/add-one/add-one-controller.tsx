import React from "react";
import { useAddNum } from "./hooks/use-add-num";
import { AddOne } from "./components/add-one";
import { useCurrentNum } from "./hooks/use-current-num";

export const AddOneController: React.FC = () => {
  const { count } = useCurrentNum();
  const { addNum, addNumData } = useAddNum();
  const onPlus = async (num: number) => {
    await addNum({
      variables: {
        num,
      },
    });
  };
  return <AddOne currentNum={addNumData || count} onPlus={onPlus} />;
};
