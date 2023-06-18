import { AuthenticationError } from "apollo-server-errors";
import { AuthChecker } from "type-graphql";
import { IContext } from "./context";

export const customAuthChecker: AuthChecker<IContext> = ({
  context,
}: {
  context: IContext;
}) => {
  const { userId } = context;
  if (!userId) {
    throw new AuthenticationError("Access denied! Please login to continue!");
  }
  return true; // or false if access is denied
};
