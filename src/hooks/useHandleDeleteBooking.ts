import { useDeleteBooking } from "@/lib/bookingService";

export function useHandleDeleteBooking(onSuccess?: () => void) {
  const deleteBooking = useDeleteBooking();

  return async (bookingId: number) => {
    const success = await deleteBooking(bookingId);
    if (success && onSuccess) {
      onSuccess();
    }
    return success;
  };
}
