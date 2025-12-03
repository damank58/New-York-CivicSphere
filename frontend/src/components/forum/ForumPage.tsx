import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaComments, 
  FaClock, 
  FaFilter, 
  FaThumbsUp, 
  FaThumbsDown,
  FaBus,
  FaHome,
  FaGraduationCap,
  FaShieldAlt,
  FaHeart,
  FaLeaf
} from "react-icons/fa";
import { Sidebar } from "../layout/Sidebar";
import { fetchForumThreads } from "../../services/api";
import type { ForumThread } from "../../types/forum";
import type { IconType } from "react-icons";

export const ForumPage = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        setIsLoading(true);
        const data = await fetchForumThreads();
        setThreads(data.threads);
      } catch (err) {
        console.error("Failed to load forum threads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadThreads();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category: string): IconType => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("transport") || categoryLower.includes("transit")) return FaBus;
    if (categoryLower.includes("housing") || categoryLower.includes("home")) return FaHome;
    if (categoryLower.includes("education") || categoryLower.includes("school")) return FaGraduationCap;
    if (categoryLower.includes("safety") || categoryLower.includes("security")) return FaShieldAlt;
    if (categoryLower.includes("health") || categoryLower.includes("medical")) return FaHeart;
    if (categoryLower.includes("environment") || categoryLower.includes("green")) return FaLeaf;
    return FaComments;
  };

  const categories = Array.from(new Set(threads.map((t) => t.category))).sort();

  const filteredThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : threads;

  return (
    <>
      <Sidebar />
      <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Greeting Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Hey New Yorker!</h1>
              <p className="text-lg text-slate-600">Join the conversation about what matters to our community.</p>
            </div>

            <div className="flex gap-6 justify-center">
              {/* Main Content - Thread List (Centered) */}
              <div className="flex-1 min-w-0 max-w-4xl">
            {isLoading ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="text-slate-500">Loading discussions...</div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="text-slate-500">No discussions found.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredThreads.map((thread) => {
                  const CategoryIcon = getCategoryIcon(thread.category);
                  return (
                    <Link
                      key={thread.id}
                      to={`/forum/thread/${thread.id}`}
                      className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Category Icon */}
                        <div className="flex-shrink-0">
                          <CategoryIcon className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {thread.category}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {formatTime(thread.last_activity)}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                            {thread.title}
                          </h2>
                          <p className="text-slate-700 mb-2 line-clamp-2">{thread.summary}</p>
                          <p className="text-xs italic text-slate-400 mb-4">AI generated Summary</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center gap-2">
                              <FaComments className="w-4 h-4" />
                              <span>{thread.post_count} {thread.post_count === 1 ? "post" : "posts"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                // Placeholder for like functionality
                              }}
                              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                            >
                              <FaThumbsUp className="w-4 h-4" />
                              <span className="text-sm">Like</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                // Placeholder for dislike functionality
                              }}
                              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                            >
                              <FaThumbsDown className="w-4 h-4" />
                              <span className="text-sm">Dislike</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
              </div>

              {/* Right Sidebar - Categories */}
              <aside className="w-64 flex-shrink-0">
                <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FaFilter className="w-4 h-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-900">Categories</h2>
                  </div>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === null
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      All Discussions
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

