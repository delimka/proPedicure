"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteBooking } from "@/lib/bookingService";
import { Loader2 } from "lucide-react";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  handleRefresh: () => void;
}

export default function BookingList({
  bookings,
  loading,
  error,
  handleRefresh,
}: BookingListProps) {
  const handleDeleteBooking = useDeleteBooking();
  const [showLoader, setShowLoader] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  async function handleDelete(bookingId: number) {
    const success = await handleDeleteBooking(bookingId);
    if (success) handleRefresh();
  }

  if (showLoader) {
    return (
      <div className="z-1 flex justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <Card className="p-6 h-80 shadow-md relative flex justify-center items-center">
      <CardContent className="relative flex flex-col justify-center items-center w-full">
        <h3 className="text-lg font-semibold mb-2 opacity-90">
          {t("your-bookings")}
          {bookings.length >= 2 && (
            <span className="text-red-400">{t("booking-limit-warning")}</span>
          )}
        </h3>

        {error ? (
          <p className="text-red-500">{t("error-loading-bookings")}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">{t("no-bookings")}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 opacity-90 w-full">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="border px-3 py-2 rounded bg-gray-50 flex flex-col"
              >
                <span className="font-semibold">
                  {booking.date} {booking.time}
                </span>
                <span>
                  {booking.name} {booking.comment && `(${booking.comment})`}
                </span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(booking.id)}
                  className="mt-auto bg-red-500"
                >
                  <FaRegTrashAlt color="white" size={25} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
