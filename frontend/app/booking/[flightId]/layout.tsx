import { notFound } from "next/navigation";
import { getFlight } from "@/lib/data/flights";
import BookingStepper from "@/components/booking/stepper";
import TripSummary from "@/components/booking/trip-summary";

export default async function BookingFlowLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = await params;
  const flight = await getFlight(flightId);
  if (!flight) notFound();

  return (
    <div>
      <BookingStepper flightId={flightId} />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <main>{children}</main>
          <TripSummary flight={flight} />
        </div>
      </div>
    </div>
  );
}
