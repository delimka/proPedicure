import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $date: String!
    $time: String!
    $name: String!
    $email: String!
    $comment: String!
    $user_id: String!
    $service_ids: [Int!]!
  ) {
    insertIntobookingsCollection(
      objects: [
        {
          date: $date
          time: $time
          name: $name
          email: $email
          comment: $comment
          user_id: $user_id
          service_ids: $service_ids
        }
      ]
    ) {
      affectedCount
      records {
        id
        date
        time
        name
        email
        comment
        user_id
        service_ids
      }
    }
  }
`;

export const DELETE_BOOKINGS = gql`
  mutation DeleteBookings($ids: [ID!]!) {
    deleteFrombookingsCollection(filter: { id: { in: $ids } }, atMost: 10) {
      records {
        id
      }
      affectedCount
    }
  }
`;
export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: Int!) {
    deleteFrombookingsCollection(filter: { id: { eq: $id } }) {
      affectedCount
    }
  }
`;
