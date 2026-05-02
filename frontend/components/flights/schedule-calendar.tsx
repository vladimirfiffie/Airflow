"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { scheduleEvents } from "@/lib/mock/flights";

export default function ScheduleCalendar() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Weekly schedule</p>
        <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />{" "}
          LIVE
        </p>
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
        eventColor="#f97316"
        eventTextColor="#ffffff"
        height="auto"
      />
    </div>
  );
}
