
import { env } from "~/env";
import Calendar from "../_components/Calendar";
import Navbar from "../_components/NavBar";
import moment from "moment";

export default async function CalendarPage() {
  const lastMonth = moment().subtract(1, "month").toISOString();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/shpe.ucf.chapter@gmail.com/events?key=${env.GOOGLE_API_KEY}&timeMin=${lastMonth}`,
  );
  const data = await response.json();
  const events = data.items.map((event: any) => ({
    title: event.summary,
    start: new Date(event.start.dateTime || event.start.date),
    end: new Date(event.end.dateTime || event.end.date),
  }));

  return (
    <div>
      <Navbar />
      <p className="my-16 text-center text-6xl text-yellow-400">CALENDAR</p>
      <div className="mx-5 bg-slate-200 p-24">
        <Calendar events={events} />
      </div>
    </div>
  );
}
