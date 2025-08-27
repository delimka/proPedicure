export interface Booking {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  created_at: string;
  comment: string;
  user_id: string;
  service_ids: string[];
}

export type Service = {
  id: string;
  name_ru: string;
  name_en: string;
  name_et: string;
  duration_minutes: number;
  price: number;
};

export interface ValidateBookingFormArgs {
  name: string;
  email: string;
  selectedTime: string;
  user: User | null;
  bookings: Booking[];
  t: (key: string) => string;
}
