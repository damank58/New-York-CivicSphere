"""
Pydantic schemas for dashboard data contracts.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class Metric(BaseModel):
    label: str
    value: int
    trend: str


class CommunitySnapshot(BaseModel):
    greeting: str
    subheading: str
    metrics: List[Metric]


class Story(BaseModel):
    id: str
    title: str
    category: str
    summary: str
    image_url: Optional[HttpUrl] = None
    published_at: datetime


class Policy(BaseModel):
    id: str
    title: str
    status: str
    description: str
    highlights: List[str]
    tags: List[str]


class Discussion(BaseModel):
    id: str
    topic: str
    category: str
    sentiment: str
    replies_count: int
    last_active_minutes: int


class Event(BaseModel):
    id: str
    name: str
    venue: str
    start_time: datetime
    end_time: datetime
    category: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    address: Optional[str] = None


class Election(BaseModel):
    id: str
    title: str
    description: str
    stance: str
    votes: int


class ServiceAlertItem(BaseModel):
    details: str
    status: str
    type: str


class ServiceAlertDay(BaseModel):
    today_id: str
    items: List[ServiceAlertItem]


class ServiceAlertsResponse(BaseModel):
    days: List[ServiceAlertDay]


class DashboardResponse(BaseModel):
    snapshot: CommunitySnapshot
    stories: List[Story]
    policies: List[Policy]
    discussions: List[Discussion]
    events: List[Event]
    elections: List[Election]


class Source(BaseModel):
    title: str
    url: Optional[str] = None
    score: Optional[float] = None
    content: Optional[str] = None


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    sources: List[Source] = []


class ForumPost(BaseModel):
    id: str
    thread_id: str
    author: str
    content: str
    created_at: datetime
    is_ai_moderator: bool = False
    parent_post_id: Optional[str] = None


class ForumThread(BaseModel):
    id: str
    topic_id: str  # Links to Discussion.id
    title: str
    category: str
    summary: str
    created_at: datetime
    author: str
    post_count: int
    last_activity: datetime


class ForumThreadResponse(BaseModel):
    thread: ForumThread
    posts: List[ForumPost]


class CreatePostRequest(BaseModel):
    content: str
    author: str = "Current User"  # Default, can be overridden
    parent_post_id: Optional[str] = None


class ForumResponse(BaseModel):
    threads: List[ForumThread]

