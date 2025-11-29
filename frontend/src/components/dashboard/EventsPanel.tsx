import { format } from "date-fns";
import type { Event } from "../../types/dashboard";

type Props = {
  events: Event[];
  isLoading: boolean;
};

const formatTime = (value?: string) => (value ? format(new Date(value), "MMM d • h:mm a") : "...");

export const EventsPanel = ({ events, isLoading }: Props) => {
  const entries: Array<Event | undefined> = isLoading ? Array.from({ length: 4 }, () => undefined) : events;

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Events Near You</h2>
        <button className="text-sm font-semibold text-brand">View calendar</button>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map((event, index) => (
          <div key={event ? event.id : `event-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{event?.category ?? "Loading"}</p>
              <p className="text-sm font-semibold text-slate-900">{event?.name ?? "Loading..."}</p>
              <p className="text-xs text-slate-500">{event?.venue}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{formatTime(event?.start_time)}</p>
              <p>{formatTime(event?.end_time)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

