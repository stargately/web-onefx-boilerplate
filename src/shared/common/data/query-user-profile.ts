import { gql } from "@apollo/client/core";

export const queryUserProfile = gql`
  query UserProfile($userId: String!) {
    userProfile(userId: $userId) {
      email
    }
  }
`;
