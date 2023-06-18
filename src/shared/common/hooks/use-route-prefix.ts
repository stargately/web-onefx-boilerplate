import { useSelector } from "react-redux";

export const useRoutePrefix = () =>
  useSelector(
    (state: { base: { routePrefix: string } }) => state.base.routePrefix
  );
