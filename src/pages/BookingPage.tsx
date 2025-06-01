import { useState } from "react";
import { motion } from "framer-motion";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import BookingList from "@/components/booking/BookingList";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchBookings } from "@/lib/bookingService";
import { Link } from "react-router-dom";
import { Booking } from "@/types";
import { useTranslation } from "react-i18next";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const { t } = useTranslation();

  const { user, loading: authLoading } = useAuth();
  const {
    bookings,
    loading: bookingsLoading,
    error,
    refetch,
  } = useFetchBookings();

  if (authLoading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  const sanitizedBookings: Booking[] = bookings.map((b) => ({
    ...b,
    name: b.name || "Unknown",
  }));

  const handleRefresh = () => {
    refetch();
    setSelectedTime("");
  };

  const handleBookingSuccess = () => {
    // ...
  };

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen py-10 px-5 bg-gray-100">
      <motion.div className="relative w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6">
        <h1 className="font-bold text-2xl mb-2">{t("booking-form")}</h1>

        {!authLoading && !user && (
          <motion.div
            className="absolute inset-0 flex items-start pt-10 justify-center 
                       bg-black bg-opacity-50 backdrop-blur-sm z-10 rounded-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white p-8 rounded-xl shadow-2xl text-center 
                         border border-gray-200 max-w-md w-full mx-4"
            >
              <p className="text-red-600 font-semibold mb-4 text-xl flex items-center justify-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>{t("login-prompt")}</span>
              </p>
              <p className="text-gray-600 mb-6">
                {t("please-login-to-continue-booking")}
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-green-bg/90 text-white rounded-md shadow hover:bg-green-bg transition-colors"
              >
                {t("login")} / {t("register")}
              </Link>
            </motion.div>
          </motion.div>
        )}

        <BookingList
          bookings={sanitizedBookings}
          loading={bookingsLoading}
          error={error ? error.message : null}
          handleRefresh={handleRefresh}
        />

        <BookingCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          bookings={bookings}
          handleRefresh={handleRefresh}
          onServicesChange={setSelectedServiceIds}
        />

        <BookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onBookingSuccess={handleBookingSuccess}
          selectedServiceIds={selectedServiceIds}
        />
      </motion.div>
    </motion.div>
  );
}
