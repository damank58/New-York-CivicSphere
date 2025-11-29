import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { Sidebar } from "../layout/Sidebar";
import { fetchServiceAlerts } from "../../services/api";
import type { ServiceAlertDay } from "../../types/dashboard";

const formatDate = (todayId: string): string => {
  // Convert YYYYMMDD to readable date format
  const year = todayId.slice(0, 4);
  const month = todayId.slice(4, 6);
  const day = todayId.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

const getStatusColor = (status: string): string => {
  if (status.includes("IN EFFECT") || status.includes("ON SCHEDULE") || status.includes("OPEN")) {
    return "text-green-700 bg-green-50";
  }
  if (status.includes("NOT IN SESSION") || status.includes("CLOSED")) {
    return "text-red-700 bg-red-50";
  }
  return "text-orange-700 bg-orange-50";
};

export const ServiceAlertsTimeline = () => {
  const { data: serviceAlertsData, isLoading, isError } = useQuery({
    queryKey: ["service-alerts"],
    queryFn: fetchServiceAlerts,
  });

  // Sort days from recent to older (descending by today_id)
  const sortedDays: ServiceAlertDay[] = serviceAlertsData?.days
    ? [...serviceAlertsData.days].sort((a, b) => b.today_id.localeCompare(a.today_id))
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
                <h1 className="text-3xl font-bold text-slate-900">Service Alerts</h1>
                <p className="text-slate-600 mt-1">View all service alerts for the past 7 days</p>
              </div>
            </div>

            {/* Content */}
            {isLoading && (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="text-slate-600">Loading alerts...</p>
              </div>
            )}

            {isError && (
              <div className="rounded-2xl bg-rose-50 p-6 text-rose-700">
                <p>Unable to load service alerts. Please try again later.</p>
              </div>
            )}

            {!isLoading && !isError && sortedDays.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center">
                <FaExclamationTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No service alerts available for the selected period.</p>
              </div>
            )}

            {!isLoading && !isError && sortedDays.length > 0 && (
              <div className="space-y-6">
                {sortedDays.map((day) => (
                  <div key={day.today_id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                      {formatDate(day.today_id)}
                    </h2>
                    <div className="space-y-4">
                      {day.items.map((alert, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{alert.type}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                                {alert.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{alert.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

