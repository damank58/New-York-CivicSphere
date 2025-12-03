import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { CommunitySnapshot } from "./components/dashboard/CommunitySnapshot";
import { FeaturedStories } from "./components/dashboard/FeaturedStories";
import { PoliciesList } from "./components/dashboard/PoliciesList";
import { DiscussionsList } from "./components/dashboard/DiscussionsList";
import { EventsPanel } from "./components/dashboard/EventsPanel";
import { ElectionsPanel } from "./components/dashboard/ElectionsPanel";
import { AIChatLauncher } from "./components/dashboard/AIChatLauncher";
import { ActivityPulse } from "./components/dashboard/ActivityPulse";
import { ServiceAlertsTimeline } from "./components/alerts/ServiceAlertsTimeline";
import { EventsTimeline } from "./components/events/EventsTimeline";
import { StoryDetail } from "./components/stories/StoryDetail";
import { ForumPage } from "./components/forum/ForumPage";
import { ThreadDetail } from "./components/forum/ThreadDetail";
import { useDashboard } from "./hooks/useDashboard";
import { useAISummary } from "./hooks/useAISummary";

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboard();
  const { data: aiSummary } = useAISummary();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Sidebar onAIAssistantClick={() => setIsChatOpen(true)} />
      <div className="flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8">
            <Header city="New York City" />
            {isError && (
              <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                Unable to load live data. Showing fallback content.
              </div>
            )}
            <div className="mt-6 space-y-6">
              <CommunitySnapshot snapshot={data?.snapshot} isLoading={isLoading} events={data?.events ?? []} />
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <FeaturedStories stories={data?.stories ?? []} isLoading={isLoading} />
                  <PoliciesList policies={data?.policies ?? []} isLoading={isLoading} onAskAI={() => setIsChatOpen(true)} />
                  <DiscussionsList discussions={data?.discussions ?? []} isLoading={isLoading} />
                </div>
                <div className="space-y-6">
                  <ActivityPulse />
                  <EventsPanel events={data?.events ?? []} isLoading={isLoading} />
                  <ElectionsPanel elections={data?.elections ?? []} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <AIChatLauncher summary={aiSummary} isOpen={isChatOpen} onOpen={() => setIsChatOpen(true)} onClose={() => setIsChatOpen(false)} />
      </div>
    </>
  );
};

const App = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<ServiceAlertsTimeline />} />
        <Route path="/events" element={<EventsTimeline />} />
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/thread/:id" element={<ThreadDetail />} />
      </Routes>
    </div>
  );
};

export default App;

