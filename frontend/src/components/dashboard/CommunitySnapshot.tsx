import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { IconType } from "react-icons";
import { FaFileAlt, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { fetchServiceAlerts } from "../../services/api";
import type { Event } from "../../types/dashboard";

type SnapshotCard = {
  icon: IconType;
  status: string;
  title: string;
  linkText: string;
  theme: "blue" | "green" | "orange";
  description?: string;
  events?: string[];
  alerts?: string[];
};

type Props = {
  snapshot?: unknown;
  isLoading: boolean;
  events?: Event[];
};

export const CommunitySnapshot = ({ snapshot: _snapshot, isLoading: _isLoading, events = [] }: Props) => {
  // Fetch service alerts
  const { data: serviceAlertsData, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["service-alerts"],
    queryFn: fetchServiceAlerts,
  });

  // Get today's date in YYYYMMDD format to match API's today_id
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayId = `${year}${month}${day}`;
  
  // Filter today's alerts
  const todayAlerts = serviceAlertsData?.days.find(day => day.today_id === todayId)?.items || [];
  const todayAlertsList = todayAlerts.map(alert => alert.details);

  // Filter today's events
  const todayDateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const todayEvents = events.filter(event => {
    if (!event.start_time) return false;
    const eventDate = new Date(event.start_time).toISOString().slice(0, 10);
    return eventDate === todayDateStr;
  });

  // Format today's events as short bullets
  const todayEventsList = todayEvents.map(event => {
    const timeStr = event.start_time ? format(new Date(event.start_time), "h:mm a") : "";
    return `${event.name}${timeStr ? ` - ${timeStr}` : ""}`;
  });

  const policyCard: SnapshotCard = {
    icon: FaFileAlt,
    status: "Updated",
    title: "Local Policy Changes",
    description: "New zoning regulations for commercial spaces in Midtown Manhattan now in effect.",
    linkText: "Learn More",
    theme: "blue",
  };

  const eventsCard: SnapshotCard = {
    icon: FaCalendarAlt,
    status: "Today",
    title: "Nearby Events",
    events: todayEventsList.length > 0 ? todayEventsList : ["No events today"],
    linkText: "View Timeline",
    theme: "green",
  };

  const alertsCard: SnapshotCard = {
    icon: FaExclamationTriangle,
    status: "Alert",
    title: "Service Alerts",
    alerts: isLoadingAlerts ? [] : (todayAlertsList.length > 0 ? todayAlertsList : ["No alerts for today"]),
    linkText: "See All Alerts",
    theme: "orange",
  };

  const cards: SnapshotCard[] = [policyCard, eventsCard, alertsCard];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Your Community Snapshot</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isBlue = card.theme === "blue";
          const isGreen = card.theme === "green";
          const isOrange = card.theme === "orange";

          return (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                isBlue ? "bg-blue-50" : isGreen ? "bg-green-50" : "bg-orange-50"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isBlue
                      ? "bg-blue-500"
                      : isGreen
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      isBlue
                        ? "bg-blue-100 text-blue-700"
                        : isGreen
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {card.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                  {card.description && (
                    <p className="text-sm text-slate-600">{card.description}</p>
                  )}
                  {card.events && (
                    <ul className="space-y-1 text-sm text-slate-600">
                      {card.events.map((event: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{event}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.alerts && (
                    <ul className="space-y-1 text-sm text-slate-600">
                      {card.alerts.map((alert: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {card.linkText === "See All Alerts" ? (
                <Link
                  to="/alerts"
                  className={`inline-flex items-center text-sm font-semibold hover:underline ${
                    isBlue
                      ? "text-blue-600"
                      : isGreen
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {card.linkText} →
                </Link>
              ) : card.linkText === "View Timeline" ? (
                <Link
                  to="/events"
                  className={`inline-flex items-center text-sm font-semibold hover:underline ${
                    isBlue
                      ? "text-blue-600"
                      : isGreen
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {card.linkText} →
                </Link>
              ) : (
                <a
                  href="#"
                  className={`inline-flex items-center text-sm font-semibold hover:underline ${
                    isBlue
                      ? "text-blue-600"
                      : isGreen
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {card.linkText} →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

