export type SeatClass = "first" | "exit" | "standard";

export type SeatStatus = "available" | "taken" | "selected";

export type Seat = {
  id: string;
  row: number;
  col: string;
  cls: SeatClass;
  taken: boolean;
  surcharge: number;
};

export type Passenger = {
  firstName: string;
  lastName: string;
  dob: string;
  seatId?: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
};

export type PaymentInfo = {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  postalCode: string;
};

export type BookingState = {
  flightId: string;
  passengers: Passenger[];
  contact: ContactInfo;
  payment: PaymentInfo;
  bookingRef?: string;
};

export const FARE_BASE_TAX_RATE = 0.085;

export const SEAT_CLASS_LABEL: Record<SeatClass, string> = {
  first: "First",
  exit: "Exit row",
  standard: "Standard",
};
