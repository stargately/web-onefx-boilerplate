import { gql } from "@apollo/client/core";

export const currentNum = gql`
  query CurrentNum {
    currentNum
  }
`;
