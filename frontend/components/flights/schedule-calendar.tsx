"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar } from "lucide-react";
import { scheduleEvents } from "@/lib/mock/flights";

export default function ScheduleCalendar() {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur md:p-6 dark:border-slate-700 dark:bg-slate-900/75">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-300" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Weekly Schedule</h2>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={scheduleEvents}
        nowIndicator
        editable={false}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false }}
        height="auto"
      />
    </section>
  );
}
