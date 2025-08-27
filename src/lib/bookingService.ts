import { useQuery, useMutation } from "@apollo/client";
import { FETCH_USER_BOOKINGS } from "@/graphql/queries/bookingQueries";
import {
  DELETE_BOOKING,
  DELETE_BOOKINGS,
} from "@/graphql/mutations/bookingMutations";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types";

export function useFetchBookings() {
  const { user, accessToken } = useAuth();

  const { data, loading, error, refetch } = useQuery(FETCH_USER_BOOKINGS, {
    variables: { user_id: user?.id || "" },
    skip: !user || !accessToken,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-and-network",
  });

  const bookings: Booking[] =
    data?.bookingsCollection?.edges?.map(
      (edge: { node: Booking }) => edge.node
    ) || [];

  return { bookings, loading, error, refetch };
}

export function useDeleteBooking() {
  const { accessToken } = useAuth();

  const [deleteBookingMutation] = useMutation(DELETE_BOOKING, {
    context: {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    },
    update(cache, { data }) {
      if (!data?.deleteBooking) return;

      cache.modify({
        fields: {
          bookingsCollection(existingBookings = { edges: [] }) {
            return {
              ...existingBookings,
              edges: existingBookings.edges.filter(
                (edge: { node: Booking }) =>
                  edge.node.id !== data.deleteBooking.id
              ),
            };
          },
        },
      });
    },
    onError: (error) => {
      console.error("❌ Error deleting booking:", error);
      alert("Error deleting booking: " + error.message);
    },
  });

  async function handleDeleteBooking(bookingId: number) {
    if (!accessToken) {
      alert("Error: You are not authorized.");
      return false;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return false;

    try {
      await deleteBookingMutation({ variables: { id: bookingId } });
      return true;
    } catch (error) {
      console.error("❌ Failed to delete booking:", error);
      return false;
    }
  }

  return handleDeleteBooking;
}

export function useDeleteBookings() {
  const { accessToken } = useAuth();

  const [deleteBookingsMutation] = useMutation(DELETE_BOOKINGS, {
    context: {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    },
    update(cache, { data }) {
      // Проверяем, что в ответе есть данные
      if (!data?.deleteFromBookingsCollection) return;

      // Собираем id удалённых букингов
      const deletedIds: string[] =
        data.deleteFromBookingsCollection.records.map(
          (record: any) => record.id
        );

      // Обновляем кэш: фильтруем букинги, оставляя только те, которых нет среди удалённых
      cache.modify({
        fields: {
          bookingsCollection(existingBookings = { edges: [] }) {
            return {
              ...existingBookings,
              edges: existingBookings.edges.filter(
                (edge: { node: Booking }) => !deletedIds.includes(edge.node.id)
              ),
            };
          },
        },
      });
    },
    onError: (error) => {
      console.error("❌ Error deleting bookings:", error);
      alert("Error deleting bookings: " + error.message);
    },
  });

  async function handleDeleteBookings(bookingIds: string[]): Promise<boolean> {
    if (!accessToken) {
      alert("Error: You are not authorized.");
      return false;
    }
    if (!bookingIds.length) return false;

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected bookings?"
    );
    if (!confirmed) return false;

    try {
      await deleteBookingsMutation({ variables: { ids: bookingIds } });
      return true;
    } catch (error) {
      console.error("❌ Failed to delete bookings:", error);
      return false;
    }
  }

  return handleDeleteBookings;
}
