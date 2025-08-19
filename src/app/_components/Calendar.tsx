"use client";

import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

export default function Calendar({
  events,
}: {
  events: { title: string; start: Date; end: Date; allDay?: boolean }[];
}) {
  const localizer = momentLocalizer(moment);

  return (
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100vh" }}
    />
  );
}
