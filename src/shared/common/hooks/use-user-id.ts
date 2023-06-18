import { useSelector } from "react-redux";

export const useUserId = () =>
  useSelector((state: { base: { userId: string } }) => state.base.userId);
