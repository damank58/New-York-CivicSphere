import { FaBook, FaBrain, FaRobot } from "react-icons/fa";
import type { Policy } from "../../types/dashboard";

type Props = {
  policies: Policy[];
  isLoading: boolean;
  onAskAI?: () => void;
};

export const PoliciesList = ({ policies, isLoading, onAskAI }: Props) => {
  const entries: Array<Policy | undefined> = isLoading ? Array.from({ length: 3 }, () => undefined) : policies;

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-600";
    const statusLower = status.toLowerCase();
    if (statusLower === "active") return "bg-green-100 text-green-700";
    if (statusLower === "public comment") return "bg-blue-100 text-blue-700";
    if (statusLower === "review") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "draft") return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Latest Policies & Rules</h2>
        <button className="text-sm font-semibold text-brand">View All Policies</button>
      </div>
      <div className="mt-4 space-y-4">
        {entries.map((policy, index) => (
          <article key={policy ? policy.id : `policy-${index}`} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(policy?.status)}`}>
                {policy?.status ?? "Loading"}
              </span>
              <div className="text-xs text-slate-500">
                Updated {policy?.status ? "recently" : "..."} • {policy?.tags?.[0] ?? "Policy"}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{policy?.title ?? "Loading..."}</h3>
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-900 mb-2">What you need to know:</p>
              <ul className="space-y-2">
                {(policy?.highlights ?? ["We are fetching the latest highlights"]).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <FaBook className="w-4 h-4" />
                Read Full Story
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                <FaBrain className="w-4 h-4" />
                Explain This
              </button>
              <button 
                onClick={onAskAI}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                <FaRobot className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

