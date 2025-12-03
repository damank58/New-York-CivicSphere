import { FaRobot } from "react-icons/fa";
import type { ForumPost } from "../../types/forum";

type Props = {
  post: ForumPost;
};

export const AIModeratorMessage = ({ post }: Props) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FaRobot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-blue-900">{post.author}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full font-medium">
              AI Moderator
            </span>
            <span className="text-xs text-slate-500">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-slate-800 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

