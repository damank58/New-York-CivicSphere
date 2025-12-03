export type ForumPost = {
  id: string;
  thread_id: string;
  author: string;
  content: string;
  created_at: string;
  is_ai_moderator: boolean;
  parent_post_id?: string | null;
};

export type ForumThread = {
  id: string;
  topic_id: string;
  title: string;
  category: string;
  summary: string;
  created_at: string;
  author: string;
  post_count: number;
  last_activity: string;
};

export type ForumThreadResponse = {
  thread: ForumThread;
  posts: ForumPost[];
};

export type ForumResponse = {
  threads: ForumThread[];
};

export type CreatePostRequest = {
  content: string;
  author?: string;
  parent_post_id?: string | null;
};

