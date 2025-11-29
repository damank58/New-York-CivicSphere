export type Metric = {
  label: string;
  value: number;
  trend: string;
};

export type CommunitySnapshot = {
  greeting: string;
  subheading: string;
  metrics: Metric[];
};

export type Story = {
  id: string;
  title: string;
  category: string;
  summary: string;
  image_url?: string;
  readingTime?: string;
  published_at: string;
};

export type Policy = {
  id: string;
  title: string;
  status: string;
  description: string;
  highlights: string[];
  tags: string[];
};

export type Discussion = {
  id: string;
  topic: string;
  category: string;
  sentiment: string;
  replies_count: number;
  last_active_minutes: number;
};

export type Event = {
  id: string;
  name: string;
  venue: string;
  start_time: string;
  end_time: string;
  category: string;
  image_url?: string;
  description?: string;
  website_url?: string;
  address?: string;
};

export type Election = {
  id: string;
  title: string;
  description: string;
  stance: string;
  votes: number;
};

export type ServiceAlertItem = {
  details: string;
  status: string;
  type: string;
};

export type ServiceAlertDay = {
  today_id: string;
  items: ServiceAlertItem[];
};

export type ServiceAlertsResponse = {
  days: ServiceAlertDay[];
};

export type DashboardResponse = {
  snapshot: CommunitySnapshot;
  stories: Story[];
  policies: Policy[];
  discussions: Discussion[];
  events: Event[];
  elections: Election[];
};

