import { gql } from "@apollo/client/core";

export const addNum = gql`
  mutation AddNum($num: Int!) {
    addNum(inc: $num)
  }
`;
