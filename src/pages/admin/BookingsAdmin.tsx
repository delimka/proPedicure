"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import { useBookingsWithPagination } from "@/hooks/useBookingWithPagination";
import { useMutation } from "@apollo/client";
import { DELETE_BOOKINGS } from "@/graphql/mutations/bookingMutations";
import { useAuth } from "@/contexts/AuthContext";
import { useBookingColumns } from "@/components/BookingTableColumns";
import { useTranslation } from "react-i18next";
interface ProfileNode {
  id: string;
  phone: string;
}
interface Service {
  id: number;
  name_ru: string;
  name_en: string;
  name_et: string;
  created_at: string;
  updated_at: string;
  duration_minutes: number;
  price: number;
}
const BookingsAdmin: React.FC = () => {
  const columns = useBookingColumns();

  const { accessToken } = useAuth();
  const [filterUpcoming, setFilterUpcoming] = useState<boolean>(() => {
    const stored = localStorage.getItem("filterUpcoming");
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("filterUpcoming", String(filterUpcoming));
  }, [filterUpcoming]);

  const {
    bookings,
    services,
    loading,
    error,
    isFetchingNext,
    emailFilter,
    setEmailFilter,
    hasNextPage,
    loadNextPage,
    data,
  } = useBookingsWithPagination({ pageSize: 100, filterUpcoming });
  const { t } = useTranslation();

  const [deleteBookingsMutation, { loading: deleteLoading }] = useMutation(
    DELETE_BOOKINGS,
    {
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      onCompleted: () => {
        window.location.reload();
      },
      onError: (err) => {
        alert(`Error during deleting: ${err.message}`);
      },
    }
  );

  const serviceMap = useMemo(() => {
    const map: Record<number, Service> = {};
    services.forEach((s: Service) => {
      map[s.id] = s;
    });
    return map;
  }, [services]);

  const profilesMap = useMemo(() => {
    const map: Record<string, string> = {};

    data?.profilesCollection?.edges.forEach(
      ({ node }: { node: ProfileNode }) => {
        map[node.id.trim().toLowerCase()] = node.phone;
      }
    );

    return map;
  }, [data?.profilesCollection]);

  const enhancedBookings = useMemo(() => {
    return bookings.map((b) => ({
      ...b,
      phone: profilesMap[b.user_id.trim().toLowerCase()] || "",
      serviceNames: (b.service_ids || [])
        .map((id: string) => serviceMap[Number(id)]?.name_ru || id)

        .join(", "),
    }));
  }, [bookings, serviceMap, profilesMap]);

  const handleDeleteSelected = async (ids: (string | number)[]) => {
    if (!ids?.length) return;
    await deleteBookingsMutation({
      variables: { ids },
    });
  };

  return (
    <div className="min-h-screen py-10 px-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{t("booking")}</h1>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterUpcoming}
            onChange={(e) => setFilterUpcoming(e.target.checked)}
          />
          {t("show-only-future-bookings")}
        </label>
      </div>

      {loading && <Loader2 className="animate-spin" />}
      {error && <div>Ошибка: {error.message}</div>}

      {!error && (
        <DataTable
          columns={columns}
          data={enhancedBookings}
          emailFilter={emailFilter}
          onEmailFilterChange={setEmailFilter}
          canNextPage={hasNextPage}
          onNextPage={loadNextPage}
          isFetchingNext={isFetchingNext}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      {deleteLoading && <div className="text-red-500">Error...</div>}
    </div>
  );
};

export default BookingsAdmin;
