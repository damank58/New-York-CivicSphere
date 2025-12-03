import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

type Props = {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
};

export const PostForm = ({ onSubmit, placeholder = "Write your reply...", isLoading = false }: Props) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none border-none focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400"
        />
        <div className="flex justify-end mt-3 pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-4 h-4" />
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
};

