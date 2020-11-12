import { useQuery } from "@apollo/client";
import { currentNum } from "@/shared/add-one/data/queries";
import { CurrentNum } from "@/shared/add-one/data/__generated__/CurrentNum";
import { selectDataCurrentNum } from "@/shared/add-one/selectors";

export const useCurrentNum = () => {
  const {
    data: dataCurrentNum,
    loading: loadingCurrentData,
    error: errorCurrentNum,
    refetch: refetchCurrentNum,
  } = useQuery<CurrentNum>(currentNum);
  return {
    count: selectDataCurrentNum(dataCurrentNum),
    loadingCurrentData,
    errorCurrentNum,
    refetchCurrentNum,
  };
};
