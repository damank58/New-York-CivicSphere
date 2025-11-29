import { useState, useEffect, useMemo } from "react";
import { FaRobot, FaTimes, FaChevronRight, FaPaperPlane, FaChevronDown, FaCircle, FaPlus, FaCommentDots } from "react-icons/fa";

type Message = {
  id: string;
  author: "user" | "assistant";
  content: string;
  timestamp: string;
  variant?: "info" | "success";
};

type HistoryCard = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
};

type Props = {
  summary?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const quickQuestions = [
  "What's changing in my district?",
  "Who represents me?",
  "Upcoming votes near me",
  "How do I register to vote?",
];

const historyCards: HistoryCard[] = [
  {
    id: "history-1",
    title: "Housing Policy Questions",
    subtitle: "Can you explain the new rent stabilization laws?",
    timestamp: "2 hours ago",
    icon: "policy",
  },
  {
    id: "history-2",
    title: "District Representatives",
    subtitle: "Who represents Manhattan District 4?",
    timestamp: "Yesterday",
    icon: "rep",
  },
  {
    id: "history-3",
    title: "Transit Updates",
    subtitle: "What's the status of the subway expansion project?",
    timestamp: "3 days ago",
    icon: "transit",
  },
  {
    id: "history-4",
    title: "Voting Information",
    subtitle: "Where is my polling place for the upcoming election?",
    timestamp: "1 week ago",
    icon: "vote",
  },
  {
    id: "history-5",
    title: "Community Events",
    subtitle: "What community events are happening this month?",
    timestamp: "2 weeks ago",
    icon: "events",
  },
];

const defaultMessages: Message[] = [
  {
    id: "msg-1",
    author: "user",
    content: "Can you explain the new Housing Affordability Act in simple terms? I'm not familiar with policy language.",
    timestamp: "2 hours ago",
  },
  {
    id: "msg-2",
    author: "assistant",
    variant: "info",
    content:
      "NYC Housing Affordability Act 2024 – Explained Simply\n\n• Rent Control: More apartments will have rent limits to keep them affordable.\n• Tenant Protection: Landlords can't evict you without good reason.\n• More Affordable Housing: The city will build more apartments working families can afford.\n• Landlord Rules: Owners must register with the city and keep apartments in good condition.",
    timestamp: "2 hours ago",
  },
  {
    id: "msg-3",
    author: "assistant",
    content:
      "What this means for you:\nIf you're a renter, you'll have more protection against unfair rent increases and evictions. If you're looking for housing, there should be more affordable options available.",
    timestamp: "2 hours ago",
  },
  {
    id: "msg-4",
    author: "user",
    content: "That's really helpful! Does this apply to my building? I live in a building from 2008.",
    timestamp: "2 hours ago",
  },
  {
    id: "msg-5",
    author: "assistant",
    variant: "success",
    content:
      "Yes! Since your building was constructed in 2008 (before 2010), the new rent stabilization rules will apply to your building.\n\nWhat this means for you:\n• Your rent increases will be limited by city guidelines.\n• You'll have stronger protection against eviction.\n• Your landlord must follow new registration requirements.",
    timestamp: "2 hours ago",
  },
];

const IconBadge = ({ icon }: { icon: string }) => {
  const iconMap: Record<string, JSX.Element> = {
    policy: <FaCommentDots className="w-4 h-4" />,
    rep: <FaCommentDots className="w-4 h-4" />,
    transit: <FaCommentDots className="w-4 h-4" />,
    vote: <FaCommentDots className="w-4 h-4" />,
    events: <FaCommentDots className="w-4 h-4" />,
  };

  return <div className="shrink-0 rounded-full bg-blue-50 p-2 text-blue-600">{iconMap[icon] ?? iconMap.policy}</div>;
};

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.author === "user";
  const base =
    "rounded-2xl px-4 py-3 text-sm whitespace-pre-line";
  const palette = isUser
    ? "bg-blue-600 text-white rounded-tl-2xl rounded-tr-sm"
    : "bg-white text-slate-700 border border-slate-200 rounded-tr-2xl rounded-tl-sm";

  const variantStyles =
    message.variant === "info"
      ? "bg-indigo-50 border border-indigo-100 text-indigo-900"
      : message.variant === "success"
        ? "bg-emerald-50 border border-emerald-100 text-emerald-900"
        : "";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div className={`${base} ${variantStyles || palette}`}>
        {message.content}
      </div>
    </div>
  );
};

export const AIChatLauncher = ({ summary, isOpen: controlledIsOpen, onOpen, onClose }: Props) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(value);
    }
    if (value && onOpen) {
      onOpen();
    } else if (!value && onClose) {
      onClose();
    }
  };

  const messages = useMemo(() => defaultMessages, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Open NYC Civic Assistant"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <FaRobot className="h-7 w-7" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 py-6 sm:items-center">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <FaRobot className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    NYC Civic Assistant
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                      <FaCircle className="h-2 w-2" /> Online
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{summary ?? "Powered by Azure AI"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Simple Mode <FaChevronDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label="Close chat"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {quickQuestions.map((question) => (
                        <button
                          key={question}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <MessageBubble message={message} />
                        <p className="text-xs text-slate-400">{message.timestamp}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Sources:</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-indigo-600">
                      <a href="#" className="flex items-center gap-1">
                        NYC Housing Development Corporation • Policy Text <FaChevronRight className="h-3 w-3" />
                      </a>
                      <a href="#" className="flex items-center gap-1">
                        Mayor's Office Press Release <FaChevronRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-white px-6 py-4 flex-shrink-0">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      placeholder="Ask me anything about NYC policies, services, or civic information..."
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105">
                      <FaPaperPlane className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <aside className="hidden w-full max-w-sm border-t border-slate-200 px-6 py-4 lg:block lg:border-l lg:border-t-0 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Chat History</h3>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    <FaPlus className="h-3 w-3" /> New Conversation
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {historyCards.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-slate-100 p-4 hover:border-indigo-100">
                      <div className="flex items-start gap-3">
                        <IconBadge icon={card.icon} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                          <p className="text-xs text-slate-500">{card.subtitle}</p>
                          <p className="mt-2 text-xs text-slate-400">{card.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

