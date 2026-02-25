"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent } from "lucide-react";
import { scheduleEvents } from "@/lib/mock/flights";

export default function ScheduleCalendar() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <CalendarEvent className="h-4 w-4 text-sky-600" />
        <h2 className="text-base font-semibold text-slate-900">Weekly Schedule</h2>
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
