import { useState } from "react";
import { Link } from "react-router-dom";
import { FaComments, FaRobot, FaSpinner } from "react-icons/fa";
import type { Discussion } from "../../types/dashboard";
import { fetchThreadDetail } from "../../services/api";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

type Props = {
  discussions: Discussion[];
  isLoading: boolean;
};

export const DiscussionsList = ({ discussions, isLoading }: Props) => {
  const entries: Array<Discussion | undefined> = isLoading ? Array.from({ length: 4 }, () => undefined) : discussions;
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryDiscussionId, setSummaryDiscussionId] = useState<string | null>(null);

  // Typing animation for the summary
  const displayedSummary = useTypingAnimation({
    text: summaryText,
    speed: 30,
    enabled: expandedDiscussionId === summaryDiscussionId && summaryText !== null,
  });

  const handleSummarizeClick = async (discussionId: string) => {
    // If already expanded, collapse it
    if (expandedDiscussionId === discussionId) {
      setExpandedDiscussionId(null);
      setSummaryText(null);
      setSummaryDiscussionId(null);
      return;
    }

    const threadId = `thread-${discussionId}`;
    
    // Clear previous summary and expand the discussion
    setSummaryText(null);
    setSummaryError(null);
    setExpandedDiscussionId(discussionId);
    setSummaryDiscussionId(discussionId);
    setIsLoadingSummary(true);

    try {
      const threadData = await fetchThreadDetail(threadId);
      const summary = threadData.thread.summary;
      // Only set summary if this discussion is still the one being expanded
      setSummaryText(summary);
    } catch (err) {
      console.error("Failed to fetch thread summary:", err);
      setSummaryError("Failed to load summary. Please try again.");
      setSummaryText(null);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Trending Discussions</h2>
        <Link to="/forum" className="text-sm font-semibold text-brand hover:text-blue-700 transition-colors">
          Go to Forum
        </Link>
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
              {discussion ? (
                <>
                  <Link 
                    to={`/forum/thread/thread-${discussion.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <FaComments className="w-4 h-4" />
                    Join the conversation
                  </Link>
                  <button
                    onClick={() => handleSummarizeClick(discussion.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <FaRobot className="w-4 h-4" />
                    Summarize with AI
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors" disabled>
                    <FaComments className="w-4 h-4" />
                    Join the conversation
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                    disabled
                  >
                    <FaRobot className="w-4 h-4" />
                    Summarize with AI
                  </button>
                </>
              )}
            </div>
            {/* Expanded Summary Section */}
            {discussion && expandedDiscussionId === discussion.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 transition-all duration-300 animate-in slide-in-from-top-2">
                {isLoadingSummary ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Generating summary...</span>
                  </div>
                ) : summaryError ? (
                  <div className="text-sm text-rose-600">
                    {summaryError}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs italic text-slate-400 font-medium">AI generated Summary</p>
                    <p className="text-sm text-slate-700 leading-relaxed min-h-[1.5rem]">
                      {displayedSummary}
                      {displayedSummary.length < (summaryText?.length || 0) && (
                        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 align-middle animate-pulse" />
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

