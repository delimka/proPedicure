import { gql } from "@apollo/client";

export const GET_SERVICES = gql`
  query GetServices {
    servicesCollection(first: 100) {
      edges {
        node {
          id
          name_ru
          name_en
          name_et
          duration_minutes
          price
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
