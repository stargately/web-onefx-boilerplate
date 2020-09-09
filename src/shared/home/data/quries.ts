import gql from "graphql-tag";

export const getHealth = gql`
  query GetHealth {
    health
  }
`;
