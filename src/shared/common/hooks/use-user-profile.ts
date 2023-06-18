import { useQuery } from "@apollo/client";
import { queryUserProfile } from "@/shared/common/data/query-user-profile";
import { useUserId } from "@/shared/common/hooks/use-user-id";
import { UserProfile } from "../data/__generated__/UserProfile";

export const useUserProfile = () => {
  const userId = useUserId();
  const { data, loading, error } = useQuery<UserProfile>(queryUserProfile, {
    ssr: false,
    variables: {
      userId,
    },
  });
  return {
    email: data?.userProfile?.email,
    loading,
    error,
  };
};
