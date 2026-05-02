// Hand-rolled DB types matching supabase/migrations/0001_init.sql.
// Replace with `supabase gen types typescript` output when ready.

export type FlightStatus = "ON_TIME" | "BOARDING" | "DELAYED" | "DEPARTED";

export type FlightRow = {
  id: string;
  flight_no: string;
  airline: string;
  from_code: string;
  to_code: string;
  depart_time: string;
  arrive_time: string;
  duration: string;
  stops: number;
  price_usd: number;
  total_seats: number;
  aircraft: string | null;
  gate: string | null;
  status: FlightStatus;
  delay_min: number;
  scheduled_at: string | null;
  created_at: string;
};

export type BookingRow = {
  id: string;
  ref: string;
  flight_id: string;
  user_id: string | null;
  contact_email: string;
  contact_phone: string;
  status: "CONFIRMED" | "CANCELLED";
  total_cents: number;
  stripe_payment_intent: string | null;
  created_at: string;
};

export type PassengerRow = {
  id: string;
  booking_id: string;
  flight_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  seat_id: string;
  position: number;
  created_at: string;
};

export type FlightInsert = {
  id: string;
  flight_no: string;
  airline: string;
  from_code: string;
  to_code: string;
  depart_time: string;
  arrive_time: string;
  duration: string;
  stops?: number;
  price_usd: number;
  total_seats?: number;
  aircraft?: string | null;
  gate?: string | null;
  status?: FlightStatus;
  delay_min?: number;
  scheduled_at?: string | null;
};

export type BookingInsert = {
  id?: string;
  ref: string;
  flight_id: string;
  user_id?: string | null;
  contact_email: string;
  contact_phone: string;
  status?: "CONFIRMED" | "CANCELLED";
  total_cents: number;
  stripe_payment_intent?: string | null;
};

export type PassengerInsert = {
  id?: string;
  booking_id: string;
  flight_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  seat_id: string;
  position: number;
};

export type Database = {
  public: {
    Tables: {
      flights: {
        Row: FlightRow;
        Insert: FlightInsert;
        Update: Partial<FlightInsert>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
        Relationships: [];
      };
      passengers: {
        Row: PassengerRow;
        Insert: PassengerInsert;
        Update: Partial<PassengerInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
