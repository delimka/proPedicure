"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_BOOKINGS_SERVICES } from "@/graphql/queries/bookingQueries";
import useDebounce from "@/helpers/use-debounce";

interface UseBookingsArgs {
  pageSize?: number;
  filterUpcoming?: boolean;
}

export function useBookingsWithPagination({
  pageSize = 10,
  filterUpcoming = false,
}: UseBookingsArgs) {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [debouncedEmail] = useDebounce(emailFilter, 500);

  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(
    FETCH_BOOKINGS_SERVICES,
    {
      variables: {
        first: pageSize,
        after: null,
        filter: undefined,
        orderBy: [{ created_at: "DescNullsLast" }],
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (!data?.bookingsCollection) return;
    const freshEdges = data.bookingsCollection.edges || [];

    setAllBookings(freshEdges.map((e: any) => e.node));
  }, [data?.bookingsCollection]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    const filterByEmail = debouncedEmail
      ? { email: { ilike: `%${debouncedEmail}%` } }
      : undefined;

    const filterByDate = filterUpcoming
      ? { date: { gte: todayStr } }
      : undefined;

    let finalFilter: any = undefined;

    if (filterByEmail && filterByDate) {
      finalFilter = { and: [filterByEmail, filterByDate] };
    } else if (filterByEmail) {
      finalFilter = filterByEmail;
    } else if (filterByDate) {
      finalFilter = filterByDate;
    } else {
      finalFilter = undefined;
    }

    setAllBookings([]);

    refetch({
      first: pageSize,
      after: null,
      filter: finalFilter,
      orderBy: [{ created_at: "DescNullsLast" }],
    });
  }, [debouncedEmail, filterUpcoming, pageSize, refetch]);

  const loadNextPage = async () => {
    if (!data?.bookingsCollection?.pageInfo?.hasNextPage) return;
    const endCursor = data.bookingsCollection.pageInfo.endCursor;
    setIsFetchingNext(true);
    try {
      await fetchMore({
        variables: {
          after: endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult?.bookingsCollection) {
            return prevResult;
          }
          return {
            ...fetchMoreResult,
            bookingsCollection: {
              ...fetchMoreResult.bookingsCollection,
              edges: [
                ...prevResult.bookingsCollection.edges,
                ...fetchMoreResult.bookingsCollection.edges,
              ],
            },
          };
        },
      });
    } finally {
      setIsFetchingNext(false);
    }
  };

  const services =
    data?.servicesCollection?.edges?.map((edge: any) => edge.node) || [];

  const hasNextPage = !!data?.bookingsCollection?.pageInfo?.hasNextPage;

  return {
    bookings: allBookings,
    services,

    loading,
    error,
    isFetchingNext,

    emailFilter,
    setEmailFilter,

    hasNextPage,
    loadNextPage,
    data,
  };
}
