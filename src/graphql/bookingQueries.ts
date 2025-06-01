import { gql } from "@apollo/client";

export const FETCH_BOOKINGS_SERVICES = gql`
  query FetchBookingsServices(
    $first: Int
    $after: Cursor
    $filter: BookingFilter
    $orderBy: [BookingOrderBy!]
  ) {
    bookingsCollection(
      first: $first
      after: $after
      filter: $filter
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          id
          date
          time
          name
          email
          created_at
          comment
          user_id
          service_ids
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
    servicesCollection {
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
    }
    profilesCollection {
      edges {
        node {
          id
          phone
        }
      }
    }
  }
`;

export const FETCH_USER_BOOKINGS = gql`
  query FetchUserBookings($user_id: String!) {
    bookingsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          date
          time
          name
          email
          comment
          user_id
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
