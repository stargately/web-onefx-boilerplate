import { gql } from "@apollo/client";

export const getHealth = gql`
  query GetHealth {
    health
  }
`;
