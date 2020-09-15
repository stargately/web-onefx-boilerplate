import { GetHealth } from "@/shared/home/data/__generated__/GetHealth";
import { getHealth } from "@/shared/home/data/quries";
import { useQuery } from "@apollo/client";

export const useGetHealth = () => {
  const { loading, data, error, refetch } = useQuery<GetHealth>(getHealth, {
    ssr: false,
  });
  return { loading, data, error, refetch };
};
