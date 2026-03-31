import ScheduleCalendar from "@/components/flights/schedule-calendar";

export default function FlightsSchedulePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Calendar</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Flight Schedule</h1>
          <p className="mt-3 text-neutral-400">
            View departures, arrivals, and gate assignments in calendar view.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 md:p-6">
          <ScheduleCalendar />
        </div>
      </div>
    </div>
  );
}
