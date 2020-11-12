import { CurrentNum } from "@/shared/add-one/data/__generated__/CurrentNum";
import { AddNum } from "@/shared/add-one/data/__generated__/AddNum";

export const selectDataCurrentNum = (
  dataCurrentNum: CurrentNum | undefined
) => {
  return dataCurrentNum?.currentNum || 0;
};

export function selectPlusResult(data: AddNum | null | undefined) {
  return data?.addNum || 0;
}
