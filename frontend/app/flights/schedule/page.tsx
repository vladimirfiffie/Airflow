import ScheduleCalendar from "@/components/flights/schedule-calendar";

export default function FlightsSchedulePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Flights Schedule</h1>
        <p className="mt-2 text-slate-600">
          FullCalendar integration uses mock events and is ready to switch to backend data.
        </p>
      </header>
      <ScheduleCalendar />
    </div>
  );
}
