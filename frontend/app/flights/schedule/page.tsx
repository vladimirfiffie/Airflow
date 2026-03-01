import ScheduleCalendar from "@/components/flights/schedule-calendar";

export default function FlightsSchedulePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Flights Schedule</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          FullCalendar integration uses mock events and is ready to switch to backend data.
        </p>
      </header>
      <ScheduleCalendar />
    </div>
  );
}
