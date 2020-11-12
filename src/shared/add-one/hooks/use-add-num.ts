import { useMutation } from "@apollo/client";
import { addNum } from "@/shared/add-one/data/mutations";
import { AddNum } from "@/shared/add-one/data/__generated__/AddNum";
import { selectPlusResult } from "@/shared/add-one/selectors";

export const useAddNum = () => {
  const [mutate, { data, loading }] = useMutation<AddNum>(addNum);
  return {
    addNum: mutate,
    addNumData: selectPlusResult(data),
    loadingAddNum: loading,
  };
};
