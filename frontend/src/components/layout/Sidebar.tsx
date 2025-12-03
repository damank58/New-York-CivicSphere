import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaFileAlt, 
  FaVoteYea, 
  FaComments, 
  FaRobot, 
  FaCloudUploadAlt, 
  FaCalendarAlt,
  FaChevronDown
} from "react-icons/fa";

type SidebarProps = {
  onAIAssistantClick?: () => void;
};

const menuItems = [
  { label: "Home", icon: FaHome, active: true },
  { label: "Policies", icon: FaFileAlt, active: false },
  { label: "Ballot & Elections", icon: FaVoteYea, active: false },
  { label: "Community Forum", icon: FaComments, active: false },
  { label: "AI Assistant", icon: FaRobot, active: false },
  { label: "Upload Center", icon: FaCloudUploadAlt, active: false },
  { label: "Events", icon: FaCalendarAlt, active: false },
];

export const Sidebar = ({ onAIAssistantClick }: SidebarProps) => {
  return (
  <aside className="fixed left-0 top-0 h-screen w-[280px] flex flex-col bg-white border-r border-slate-200 z-10">
    {/* Logo Section */}
    <div className="p-6 border-b border-slate-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">NY Civic Sphere</div>
          <div className="text-xs text-slate-500">Empowering Communities</div>
        </div>
      </div>
    </div>

    {/* Navigation Menu */}
    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isAIAssistant = item.label === "AI Assistant";
        const isEvents = item.label === "Events";
        const isCommunityForum = item.label === "Community Forum";
        const isHome = item.label === "Home";
        const buttonClassName = `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          item.active
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-50"
        }`;
        
        if (isHome) {
          return (
            <Link
              key={item.label}
              to="/"
              className={buttonClassName}
            >
              <Icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        }
        
        if (isEvents) {
          return (
            <Link
              key={item.label}
              to="/events"
              className={buttonClassName}
            >
              <Icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        }
        
        if (isCommunityForum) {
          return (
            <Link
              key={item.label}
              to="/forum"
              className={buttonClassName}
            >
              <Icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        }
        
        return (
          <button
            key={item.label}
            onClick={isAIAssistant ? onAIAssistantClick : undefined}
            className={buttonClassName}
          >
            <Icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-500"}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    {/* User Profile Section */}
    <div className="p-4 border-t border-slate-200">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
            alt="Alex Rivera" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">Alex Rivera</div>
          <div className="text-xs text-slate-500 truncate">Manhattan, D4</div>
        </div>
        <FaChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
    </div>
  </aside>
);
};

