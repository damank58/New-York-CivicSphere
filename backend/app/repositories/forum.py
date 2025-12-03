"""
Repository layer for forum threads and posts.
"""
from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from ..repositories.dashboard import DashboardRepository
from ..schemas import ForumPost, ForumThread, ForumThreadResponse, ForumResponse


def utc_now() -> datetime:
    return datetime.now(tz=timezone.utc)


# Mockup user names for realistic forum posts
MOCK_USERS = [
    "Sarah Chen",
    "Marcus Johnson",
    "Elena Rodriguez",
    "David Kim",
    "Priya Patel",
    "James Wilson",
    "Maria Garcia",
    "Robert Brown",
    "Jennifer Lee",
    "Michael Taylor",
    "Lisa Anderson",
    "Christopher Martinez",
]

# AI Moderator messages that facilitate dialogue
AI_MODERATOR_MESSAGES = [
    "Thanks for sharing your perspective! I'm curious - what specific aspects of this proposal concern you most?",
    "It's great to see different viewpoints here. Can anyone share their experience with similar initiatives in other neighborhoods?",
    "This is an important discussion. For those who might be new to this topic, what questions do you have?",
    "I notice there are both supportive and concerned voices here. What information would help everyone make a more informed decision?",
    "Let's make sure everyone feels heard. What would make this proposal work better for your community?",
    "There are valid points on both sides. What common ground can we find?",
    "For those just joining the conversation, what brought you here today?",
    "This is a complex issue with many factors. What additional context would be helpful?",
]


def generate_ai_moderator_message(thread_topic: str, existing_posts: List[ForumPost]) -> str:
    """Generate an AI moderator message that facilitates dialogue."""
    # Use a simple approach: pick a message based on post count
    if len(existing_posts) < 3:
        return random.choice([
            "Welcome to this discussion! Feel free to share your thoughts, questions, or experiences.",
            "This is an important topic for our community. What questions or concerns do you have?",
        ])
    else:
        return random.choice(AI_MODERATOR_MESSAGES)


def generate_mockup_posts(thread_id: str, topic: str, category: str) -> List[ForumPost]:
    """Generate mockup posts with diverse opinions for a thread."""
    posts = []
    post_count = random.randint(5, 10)
    base_time = utc_now() - timedelta(hours=random.randint(1, 48))
    
    # First post (OP)
    op_author = random.choice(MOCK_USERS)
    op_content = f"I wanted to start a discussion about {topic.lower()}. What are everyone's thoughts?"
    posts.append(ForumPost(
        id=f"post-{thread_id}-1",
        thread_id=thread_id,
        author=op_author,
        content=op_content,
        created_at=base_time,
        is_ai_moderator=False,
        parent_post_id=None,
    ))
    
    # Generate diverse opinion posts
    opinion_templates = {
        "supportive": [
            "I think this is a great idea! {reason}",
            "I'm fully in support of this. {reason}",
            "This would benefit our community because {reason}",
        ],
        "concerned": [
            "I have some concerns about this. {reason}",
            "I'm worried that {reason}",
            "This might not work well because {reason}",
        ],
        "neutral": [
            "I'd like to understand more about {aspect}",
            "Can someone explain how this would affect {group}?",
            "What are the potential downsides we should consider?",
        ],
    }
    
    reasons_by_category = {
        "Transportation": {
            "supportive": [
                "it would reduce traffic congestion and make commuting easier",
                "it promotes sustainable transportation options",
                "it would improve safety for cyclists and pedestrians",
            ],
            "concerned": [
                "it might reduce parking availability",
                "it could increase traffic on other streets",
                "the construction period would be disruptive",
            ],
            "neutral": ["the impact on local businesses", "the timeline for implementation", "the cost and funding"],
        },
        "Parks": {
            "supportive": [
                "it would provide much-needed green space for families",
                "it would improve property values in the area",
                "it would create a community gathering place",
            ],
            "concerned": [
                "it might increase noise and foot traffic",
                "maintenance costs could be high",
                "it might not serve all community needs",
            ],
            "neutral": ["the maintenance plan", "accessibility features", "programming and events"],
        },
        "Housing": {
            "supportive": [
                "it addresses the affordable housing crisis",
                "it would help families stay in their neighborhoods",
                "it promotes mixed-income communities",
            ],
            "concerned": [
                "it might change the character of the neighborhood",
                "infrastructure might not support the density",
                "it could lead to gentrification",
            ],
            "neutral": ["eligibility requirements", "the application process", "long-term affordability"],
        },
        "Infrastructure": {
            "supportive": [
                "it would improve our aging infrastructure",
                "it would create jobs and boost the local economy",
                "it's necessary for future growth",
            ],
            "concerned": [
                "the construction would be very disruptive",
                "the cost seems too high",
                "there might be better alternatives",
            ],
            "neutral": ["the construction timeline", "funding sources", "environmental impact"],
        },
        "Housing": {
            "supportive": [
                "it addresses the affordable housing crisis",
                "it would help families stay in their neighborhoods",
                "it promotes mixed-income communities",
            ],
            "concerned": [
                "it might change the character of the neighborhood",
                "infrastructure might not support the density",
                "it could lead to gentrification",
            ],
            "neutral": ["eligibility requirements", "the application process", "long-term affordability"],
        },
    }
    
    category_reasons = reasons_by_category.get(category, {
        "supportive": ["it seems like a good idea"],
        "concerned": ["there might be issues"],
        "neutral": ["we need more information"],
    })
    
    # Generate posts with varied opinions
    for i in range(2, post_count + 1):
        post_time = base_time + timedelta(minutes=random.randint(10, 1440))
        opinion_type = random.choice(["supportive", "concerned", "neutral"])
        template = random.choice(opinion_templates[opinion_type])
        reason = random.choice(category_reasons[opinion_type])
        
        # Replace placeholders
        content = template.format(reason=reason, aspect=random.choice(["the details", "the implementation", "the impact"]), 
                                 group=random.choice(["residents", "local businesses", "families", "seniors"]))
        
        # Sometimes reply to a previous post
        parent_id = None
        if i > 2 and random.random() < 0.4:  # 40% chance of being a reply
            parent_id = posts[random.randint(0, len(posts) - 1)].id
        
        posts.append(ForumPost(
            id=f"post-{thread_id}-{i}",
            thread_id=thread_id,
            author=random.choice([u for u in MOCK_USERS if u != op_author]),
            content=content,
            created_at=post_time,
            is_ai_moderator=False,
            parent_post_id=parent_id,
        ))
    
    # Add 1-2 AI moderator messages at strategic points
    ai_message_count = random.randint(1, 2)
    for ai_idx in range(ai_message_count):
        # Insert AI message after some posts have been made
        insert_position = random.randint(3, len(posts) - 1)
        ai_message = generate_ai_moderator_message(topic, posts[:insert_position])
        ai_post_time = posts[insert_position - 1].created_at + timedelta(minutes=random.randint(5, 30))
        
        posts.insert(insert_position, ForumPost(
            id=f"post-{thread_id}-ai-{ai_idx + 1}",
            thread_id=thread_id,
            author="AI Moderator",
            content=ai_message,
            created_at=ai_post_time,
            is_ai_moderator=True,
            parent_post_id=None,
        ))
    
    # Sort posts by created_at
    posts.sort(key=lambda p: p.created_at)
    
    return posts


def generate_thread_summary(topic: str, posts: List[ForumPost]) -> str:
    """Generate a 2-3 sentence summary of the thread discussion."""
    user_posts = [p for p in posts if not p.is_ai_moderator]
    if len(user_posts) == 0:
        return f"Discussion about {topic.lower()}."
    
    # Simple summary based on post count and variety
    post_count = len(user_posts)
    if post_count < 5:
        return f"New discussion about {topic.lower()}. Community members are sharing initial thoughts and questions."
    else:
        return f"Active discussion about {topic.lower()} with {post_count} community contributions. Participants are sharing diverse perspectives, asking questions, and engaging in dialogue about the topic."


class ForumRepository:
    """Repository for forum threads and posts."""

    def __init__(self, dashboard_repo: Optional[DashboardRepository] = None) -> None:
        self._dashboard_repo = dashboard_repo or DashboardRepository()
        self._threads_cache: Dict[str, ForumThreadResponse] = {}

    def fetch_forum_threads(self) -> ForumResponse:
        """Fetch all forum threads, generating mockup data from dashboard discussions."""
        dashboard = self._dashboard_repo.fetch_dashboard()
        threads = []
        
        for discussion in dashboard.discussions:
            thread_id = f"thread-{discussion.id}"
            
            # Generate mockup posts for this thread
            posts = generate_mockup_posts(thread_id, discussion.topic, discussion.category)
            
            # Generate thread summary
            summary = generate_thread_summary(discussion.topic, posts)
            
            # Determine last activity
            last_activity = max(p.created_at for p in posts) if posts else utc_now()
            
            # Create thread
            thread = ForumThread(
                id=thread_id,
                topic_id=discussion.id,
                title=discussion.topic,
                category=discussion.category,
                summary=summary,
                created_at=posts[0].created_at if posts else utc_now(),
                author=posts[0].author if posts else "Community Member",
                post_count=len(posts),
                last_activity=last_activity,
            )
            
            threads.append(thread)
            
            # Cache the full thread data for detail view
            self._threads_cache[thread_id] = ForumThreadResponse(
                thread=thread,
                posts=posts,
            )
        
        # Sort by last activity (most recent first)
        threads.sort(key=lambda t: t.last_activity, reverse=True)
        
        return ForumResponse(threads=threads)

    def fetch_thread_detail(self, thread_id: str) -> Optional[ForumThreadResponse]:
        """Fetch detailed thread with all posts."""
        # If not in cache, try to fetch from forum threads first
        if thread_id not in self._threads_cache:
            self.fetch_forum_threads()
        
        return self._threads_cache.get(thread_id)

    def create_post(self, thread_id: str, content: str, author: str = "Current User", parent_post_id: Optional[str] = None) -> ForumPost:
        """Create a new post in a thread."""
        # Fetch thread to ensure it exists
        thread_response = self.fetch_thread_detail(thread_id)
        if not thread_response:
            raise ValueError(f"Thread {thread_id} not found")
        
        # Create new post
        new_post = ForumPost(
            id=f"post-{thread_id}-{len(thread_response.posts) + 1}",
            thread_id=thread_id,
            author=author,
            content=content,
            created_at=utc_now(),
            is_ai_moderator=False,
            parent_post_id=parent_post_id,
        )
        
        # Add to cached thread
        thread_response.posts.append(new_post)
        thread_response.thread.post_count = len(thread_response.posts)
        thread_response.thread.last_activity = utc_now()
        
        return new_post

