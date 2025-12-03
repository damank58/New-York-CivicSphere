import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaClock } from "react-icons/fa";
import { Sidebar } from "../layout/Sidebar";
import { fetchThreadDetail, createPost } from "../../services/api";
import type { ForumThreadResponse, ForumPost } from "../../types/forum";
import { AIModeratorMessage } from "./AIModeratorMessage";
import { PostForm } from "./PostForm";

export const ThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [threadData, setThreadData] = useState<ForumThreadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadThread = async () => {
      try {
        setIsLoading(true);
        const data = await fetchThreadDetail(id);
        setThreadData(data);
      } catch (err) {
        setError("Failed to load thread");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadThread();
  }, [id]);

  const handlePostSubmit = async (content: string) => {
    if (!id) return;

    setIsPosting(true);
    try {
      const updatedThread = await createPost(id, { content, author: "Current User" });
      setThreadData(updatedThread);
    } catch (err) {
      console.error("Failed to post:", err);
      alert("Failed to post your message. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

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

  const getPostAuthor = (post: ForumPost) => {
    if (post.parent_post_id) {
      const parentPost = threadData?.posts.find((p) => p.id === post.parent_post_id);
      if (parentPost) {
        return `Replying to ${parentPost.author}`;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <>
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
          <div className="text-slate-500">Loading thread...</div>
        </div>
      </>
    );
  }

  if (error || !threadData) {
    return (
      <>
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
          <div className="text-rose-600">{error || "Thread not found"}</div>
        </div>
      </>
    );
  }

  const { thread, posts } = threadData;

  return (
    <>
      <Sidebar />
      <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/forum")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Forum</span>
        </button>

        {/* Thread Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {thread.category}
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <FaClock className="w-3 h-3" />
                  {formatTime(thread.last_activity)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">{thread.title}</h1>
              <p className="text-slate-700 leading-relaxed">{thread.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>Started by {thread.author}</span>
            </div>
            <span>•</span>
            <span>{thread.post_count} {thread.post_count === 1 ? "post" : "posts"}</span>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id}>
              {post.is_ai_moderator ? (
                <AIModeratorMessage post={post} />
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900">{post.author}</span>
                        <span className="text-xs text-slate-500">{formatTime(post.created_at)}</span>
                        {getPostAuthor(post) && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-blue-600">{getPostAuthor(post)}</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Post Form */}
        <PostForm onSubmit={handlePostSubmit} isLoading={isPosting} />
          </div>
        </main>
      </div>
    </>
  );
};

