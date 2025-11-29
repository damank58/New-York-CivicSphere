import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";
import { Sidebar } from "../layout/Sidebar";
import { fetchDashboard } from "../../services/api";
import type { Event } from "../../types/dashboard";

const EventCard = ({ event }: { event: Event }) => {
  const [imageError, setImageError] = useState(false);

  const formatEventDate = (startTime: string, endTime?: string): string => {
    try {
      const start = new Date(startTime);
      const startFormatted = format(start, "MMM d, yyyy 'at' h:mm a");
      
      if (endTime) {
        const end = new Date(endTime);
        const endFormatted = format(end, "h:mm a");
        return `${startFormatted} - ${endFormatted}`;
      }
      return startFormatted;
    } catch {
      return startTime;
    }
  };

  const showPlaceholder = !event.image_url || imageError;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex gap-6">
        {/* Event Image */}
        <div className="flex-shrink-0 relative">
          {event.image_url && !imageError ? (
            <img
              src={event.image_url}
              alt={event.name}
              className="w-48 h-32 object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : null}
          {showPlaceholder && (
            <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <FaCalendarAlt className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{event.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {event.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{formatEventDate(event.start_time, event.end_time)}</span>
              </div>
            </div>
            {event.website_url && (
              <a
                href={event.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-semibold"
              >
                <span>Visit Event</span>
                <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">{event.description}</p>
          )}

          <div className="space-y-2">
            {event.venue && (
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                <span className="font-medium">{event.venue}</span>
              </div>
            )}
            {event.address && event.address !== event.venue && (
              <div className="flex items-start gap-2 text-sm text-slate-600 ml-6">
                <span>{event.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventsTimeline = () => {
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  // Sort events from recent to older (by start_time descending)
  const sortedEvents: Event[] = dashboardData?.events
    ? [...dashboardData.events].sort((a, b) => {
        const dateA = new Date(a.start_time).getTime();
        const dateB = new Date(b.start_time).getTime();
        return dateB - dateA; // Most recent first
      })
    : [];

  return (
    <>
      <Sidebar />
      <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Events Timeline</h1>
                <p className="text-slate-600 mt-1">View all upcoming and past events</p>
              </div>
            </div>

            {/* Content */}
            {isLoading && (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="text-slate-600">Loading events...</p>
              </div>
            )}

            {isError && (
              <div className="rounded-2xl bg-rose-50 p-6 text-rose-700">
                <p>Unable to load events. Please try again later.</p>
              </div>
            )}

            {!isLoading && !isError && sortedEvents.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center">
                <FaCalendarAlt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No events available at this time.</p>
              </div>
            )}

            {!isLoading && !isError && sortedEvents.length > 0 && (
              <div className="space-y-6">
                {sortedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

