import { FaComments, FaRobot } from "react-icons/fa";
import type { Discussion } from "../../types/dashboard";

type Props = {
  discussions: Discussion[];
  isLoading: boolean;
  onSummarizeAI?: () => void;
};

export const DiscussionsList = ({ discussions, isLoading, onSummarizeAI }: Props) => {
  const entries: Array<Discussion | undefined> = isLoading ? Array.from({ length: 4 }, () => undefined) : discussions;

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Trending Discussions</h2>
        <button className="text-sm font-semibold text-brand">Go to Forum</button>
      </div>
      <div className="mt-4 space-y-4">
        {entries.map((discussion, index) => (
          <article key={discussion ? discussion.id : `discussion-${index}`} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">{discussion?.category ?? "Loading"}</p>
            <h3 className="text-base font-semibold text-slate-900 mb-2">{discussion?.topic ?? "Loading..."}</h3>
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span>{discussion?.replies_count ?? "..."} comments</span>
              <span>Active {discussion?.last_active_minutes ?? 0} mins ago</span>
              <span className="font-semibold text-emerald-500">{discussion?.sentiment}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <FaComments className="w-4 h-4" />
                Join the conversation
              </button>
              <button 
                onClick={onSummarizeAI}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                <FaRobot className="w-4 h-4" />
                Summarize with AI
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

