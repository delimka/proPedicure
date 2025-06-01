"use client";

import { useEffect } from "react";
import { useDeleteBooking } from "@/lib/bookingService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegTrashAlt } from "react-icons/fa";
import { Booking } from "@/types";
import ServiceList from "@/components/ServiceList";
import { useTranslation } from "react-i18next";

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  bookings: Booking[];
  handleRefresh: () => void;
  onServicesChange: (ids: number[]) => void;
}

export default function BookingCalendar({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  bookings,
  handleRefresh,
  onServicesChange,
}: Props) {
  const { t } = useTranslation();
  const handleDeleteBooking = useDeleteBooking();

  async function handleDelete(bookingId: number, time: string) {
    const success = await handleDeleteBooking(bookingId);
    if (success) {
      handleRefresh();
      if (selectedTime === time) {
        setSelectedTime("");
      }
    }
  }

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate, today]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleDateBlur = () => {
    if (selectedDate.length !== 10) return;
    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      alert(t("invalid-date"));
      return;
    }
    if (parsedDate < new Date(today)) {
      alert(t("past-date-warning"));
      setSelectedDate(today);
    }
  };

  return (
    <Card className="h-auto p-6">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">{t("select-a-time")}</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          onBlur={handleDateBlur}
          min={today}
          className="w-full border px-3 py-2 rounded"
        />
        {selectedDate ? (
          <>
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">
                {t("choose-service")}
              </h4>
              <ServiceList onChange={onServicesChange} />
            </div>
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">
                {t("available-times")}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                ].map((time) => {
                  const booking = bookings.find(
                    (b) => b.time === time && b.date === selectedDate
                  );
                  if (booking) {
                    return (
                      <Button
                        key={time}
                        variant="destructive"
                        onClick={() => handleDelete(booking.id, time)}
                      >
                        {time} <FaRegTrashAlt color="red" />
                      </Button>
                    );
                  }
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-gray-500">{t("please-select-date")}</p>
        )}
      </CardContent>
    </Card>
  );
}
