"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "@/graphql/mutations/bookingMutations";
import { useFetchBookings } from "@/lib/bookingService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import SuccessMessage from "../SuccessMessage";
import { useTranslation } from "react-i18next";

interface BookingFormProps {
  selectedDate: string;
  selectedTime: string;
  onBookingSuccess: () => void;
  selectedServiceIds?: number[];
}

export default function BookingForm({
  selectedDate,
  selectedTime,
  onBookingSuccess,
  selectedServiceIds = [],
}: BookingFormProps) {
  const { t } = useTranslation();

  const { user, accessToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { bookings = [], refetch } = useFetchBookings();
  const userBookingsCount = bookings?.length || 0;

  const [createBookingMutation, { loading: createLoading }] = useMutation(
    CREATE_BOOKING,
    {
      context: {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      },
      onCompleted: () => {
        refetch();
        setName("");
        setEmail("");
        setComment("");
        setSuccessMsg(t("booking-success"));
        onBookingSuccess();
        setTimeout(() => setSuccessMsg(""), 3000);
      },
      onError: (error) => {
        console.error("Booking error:", error);
        setErrorMsg(error.message || t("booking-failure"));
      },
    }
  );

  async function handleBooking() {
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !user || !accessToken) {
      setErrorMsg(t("error-fill-fields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(t("invalid-email"));
      return;
    }

    if (!selectedTime) {
      setErrorMsg(t("please-choose-time"));
      return;
    }

    if (userBookingsCount >= 2) {
      setErrorMsg(t("booking-limit"));
      return;
    }

    try {
      await createBookingMutation({
        variables: {
          date: selectedDate,
          time: selectedTime,
          name,
          email,
          comment: comment || "",
          user_id: user.id,
          service_ids: selectedServiceIds,
        },
      });
    } catch (error) {
      console.error("GraphQL Mutation Error:", error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(String(error));
      }
    }
  }

  return (
    <Card className="p-6 h-auto shadow-md">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">
          {t("enter-your-details")}
        </h3>
        <div className="flex flex-col gap-4 mb-4">
          <Input
            placeholder={t("your-name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder={t("your-email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder={t("comment-optional")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <SuccessMessage message={successMsg} />}

        <Button
          onClick={handleBooking}
          disabled={
            !selectedTime || userBookingsCount >= 2 || !email || createLoading
          }
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {createLoading ? t("booking-loading") : t("book-now")}
        </Button>
      </CardContent>
    </Card>
  );
}
