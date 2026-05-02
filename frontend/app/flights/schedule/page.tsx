import ScheduleCalendar from "@/components/flights/schedule-calendar";

export default function FlightsSchedulePage() {
  return (
    <div>
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="eyebrow">Calendar</p>
          <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
            Flight schedule.
          </h1>
          <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
            View departures, arrivals, and gate assignments. Click any flight for full details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <ScheduleCalendar />
        </div>
      </section>
    </div>
  );
}
