# India Visual Discovery — Data Model

## 1. Purpose

This document defines the proposed logical data model for the MVP.

It is intended to be reviewed and approved before database implementation.

The database should support:

- User accounts and profiles
- Interests
- Posts and media
- Places
- Follows
- Likes
- Comments
- Saves
- Collections
- Reminders
- Direct messages
- Chat rooms
- Notifications

The model should remain simple enough for an MVP while leaving room for future growth.

---

## 2. Design Principles

### 2.1 Security first

- Row Level Security (RLS) must remain enabled where applicable.
- Client applications must never use Supabase service-role credentials.
- Private user data must not be exposed through public queries.
- User-generated content must be treated as untrusted input.
- Authorization must be enforced at the database/API layer, not only in the UI.

### 2.2 Version-controlled schema

All schema changes must be implemented through version-controlled migrations.

Do not make manual production schema changes.

### 2.3 Simple MVP architecture

Prefer a normalized relational model where relationships are important.

Do not introduce unnecessary microservices, event infrastructure, recommendation systems, or additional databases for the MVP.

### 2.4 Media separation

Media metadata belongs in the database, while actual media files should live in appropriate object storage.

The project has not yet finalized the long-term video/media-processing architecture.

Do not introduce a production media-processing architecture without an explicit project decision.

### 2.5 Public vs private data

Every entity should have an explicit privacy model.

Examples:

- Public profile information can be visible to other users.
- Private saved collections must remain private.
- Public collections can be displayed on profiles.
- Direct messages must only be accessible to conversation participants.

---

# 3. Core Entities

## 3.1 profiles

Represents the application's user-facing profile.

Suggested fields:

- `id`
- `username`
- `display_name`
- `bio`
- `gender`
- `avatar_url`
- `created_at`
- `updated_at`

### Notes

`id` should correspond to the authenticated user's identity.

Username should be unique.

Profile information collected during onboarding is intentionally limited.

Users can edit their profile later.

---

## 3.2 interests

Represents predefined discovery interests.

Suggested fields:

- `id`
- `name`
- `slug`
- `created_at`

Examples:

- cafes
- travel
- fashion
- food
- photography
- college
- fitness
- nightlife

The initial interest taxonomy should remain relatively small.

---

## 3.3 profile_interests

Many-to-many relationship between profiles and interests.

Suggested fields:

- `profile_id`
- `interest_id`
- `created_at`

Constraints:

- Unique `(profile_id, interest_id)`

Interests provide an initial basis for discovery and personalization.

They should not be treated as permanent or restrictive classifications.

---

# 4. Posts

## 4.1 posts

Represents a published piece of user-generated content.

Suggested fields:

- `id`
- `author_id`
- `caption`
- `place_id` nullable
- `created_at`
- `updated_at`
- `published_at`
- `visibility`
- `status`

Possible `visibility` values:

- `public`

Additional visibility options can be added later if required.

Possible `status` values:

- `published`
- `deleted`
- `moderated`

### Notes

A post can contain:

- A single photo
- Multiple photos/carousel
- Video
- Other supported media types approved by the project

The post itself should not store media binary data.

---

## 4.2 post_media

Represents media attached to a post.

Suggested fields:

- `id`
- `post_id`
- `media_type`
- `storage_path`
- `thumbnail_path` nullable
- `width` nullable
- `height` nullable
- `duration_ms` nullable
- `sort_order`
- `created_at`

Possible `media_type` values:

- `image`
- `video`

The schema should allow additional media types later without requiring a fundamental redesign.

### Important

This table stores metadata and references.

It does not define the final production media-processing architecture.

---

# 5. Places

## 5.1 places

Represents a persistent real-world place.

Suggested fields:

- `id`
- `name`
- `slug`
- `category`
- `address`
- `city`
- `state`
- `country`
- `latitude` nullable
- `longitude` nullable
- `created_at`
- `updated_at`

A Place is separate from a Post.

A user can publish multiple posts associated with the same Place.

---

## 5.2 Place/Post relationship

A post may optionally reference a Place through:

`posts.place_id → places.id`

This allows the Place page to aggregate posts over time.

The Place page can therefore support:

- Latest experiences
- Monthly history
- All posts for a month
- Individual post viewing

---

# 6. Follows

## 6.1 follows

Represents one user following another user.

Suggested fields:

- `follower_id`
- `following_id`
- `created_at`

Constraints:

- Unique `(follower_id, following_id)`
- A user cannot follow themselves.

This relationship powers:

- Following feed
- Followers list
- Following list
- Creator discovery

---

# 7. Likes

## 7.1 post_likes

Represents a user's like on a post.

Suggested fields:

- `post_id`
- `user_id`
- `created_at`

Constraints:

- Unique `(post_id, user_id)`

A like should be removable.

---

# 8. Comments

## 8.1 comments

Represents comments on posts.

Suggested fields:

- `id`
- `post_id`
- `author_id`
- `body`
- `created_at`
- `updated_at`
- `status`

Possible status values:

- `published`
- `deleted`
- `moderated`

The initial MVP can support top-level comments.

Nested comment/reply systems can be added later if needed.

---

# 9. Saves

## 9.1 saves

Represents a user's saved post.

Suggested fields:

- `id`
- `user_id`
- `post_id`
- `created_at`

Constraints:

- Unique `(user_id, post_id)`

Saving should be fast and independent from collection assignment.

A user should be able to save a post without immediately selecting a collection.

---

# 10. Collections

## 10.1 collections

Represents a user-created collection.

Suggested fields:

- `id`
- `owner_id`
- `name`
- `description` nullable
- `cover_media_id` nullable
- `visibility`
- `created_at`
- `updated_at`

Possible visibility values:

- `private`
- `public`

Private collections are not visible to other users.

Public collections can appear on a user's profile.

---

## 10.2 collection_items

Represents content placed inside a collection.

Suggested fields:

- `id`
- `collection_id`
- `post_id` nullable
- `place_id` nullable
- `sort_order`
- `created_at`

The model should support saving both posts and Places into collections.

At least one target (`post_id` or `place_id`) must be present.

The exact constraint/implementation should be finalized during migration design.

---

# 11. Reminders

## 11.1 reminders

Represents a one-time reminder associated with saved/discovered content.

Suggested fields:

- `id`
- `user_id`
- `post_id` nullable
- `collection_id` nullable
- `place_id` nullable
- `remind_at`
- `status`
- `created_at`
- `completed_at` nullable

Possible status values:

- `scheduled`
- `delivered`
- `cancelled`

### MVP behavior

Support one-time reminders.

Examples:

- Remind me about this café Saturday.
- Remind me about this saved post next week.
- Remind me about this collection on a specific date.

Recurring reminders are deferred.

The system should not create reminders automatically without user intent.

---

# 12. Messaging

Messaging is part of the planned MVP social layer, but should remain intentionally simple.

## 12.1 conversations

Represents a direct-message conversation or chat room.

Suggested fields:

- `id`
- `conversation_type`
- `name` nullable
- `created_by`
- `created_at`
- `updated_at`

Possible `conversation_type` values:

- `direct`
- `group`

A group conversation can represent a simple chat room.

Large-scale community infrastructure is deferred.

---

## 12.2 conversation_members

Represents users participating in a conversation.

Suggested fields:

- `conversation_id`
- `user_id`
- `joined_at`
- `left_at` nullable
- `role` nullable

Constraints:

- Unique `(conversation_id, user_id)`

Only members should be able to access conversation content.

---

## 12.3 messages

Represents an individual message.

Suggested fields:

- `id`
- `conversation_id`
- `sender_id`
- `body`
- `created_at`
- `updated_at`
- `status`

The initial messaging implementation should remain text-first.

Rich media messaging can be added later.

---

# 13. Notifications

## 13.1 notifications

Represents user-facing notifications.

Suggested fields:

- `id`
- `user_id`
- `type`
- `actor_id` nullable
- `post_id` nullable
- `comment_id` nullable
- `collection_id` nullable
- `reminder_id` nullable
- `read_at` nullable
- `created_at`

Possible notification types can include:

- `like`
- `comment`
- `follow`
- `message`
- `reminder`

The notification model should remain extensible.

---

# 14. Relationships

High-level relationship model:

```text
profiles
   │
   ├── profile_interests ── interests
   │
   ├── follows ──────────── profiles
   │
   ├── posts
   │      │
   │      ├── post_media
   │      ├── comments
   │      ├── post_likes
   │      ├── saves
   │      └── places
   │
   ├── collections
   │      │
   │      └── collection_items
   │
   ├── reminders
   │
   └── conversations
          │
          ├── conversation_members
          └── messages
```
---
 
#15. Place History

Place history should not require a separate monthly-post table.

The month can be derived from the post's publication timestamp.

Conceptually:

Place
 │
 ├── September 2026
 │     ├── Post A
 │     ├── Post B
 │     └── Post C
 │
 ├── August 2026
 │     ├── Post D
 │     └── Post E
 │
 └── July 2026
       └── Post F

This allows the Place page to query posts associated with the Place and group them by month.

The application can later introduce more sophisticated ranking within each month.

---

# 16. Search

Search should initially operate across several entity types:

- Profiles
- Places
- Posts
- Interests/topics

Search should not require a separate search database for the MVP unless PostgreSQL capabilities prove insufficient.

Potential search indexes should be evaluated during implementation.

Advanced search infrastructure is deferred.

---

# 17. Feed

The MVP should not require a machine-learning recommendation system.

Initial feed signals can include:

- Follow relationships
- User interests
- Recency
- Engagement
- Saves
- Place relevance

The implementation should remain simple and replaceable.

Recommendation AI is explicitly deferred.

---

# 18. Privacy Model

### Public

Potentially visible to other users:

- Username
- Display name
- Profile photo/avatar
- Bio
- Interests
- Public posts
- Public collections
- Follower/following relationships where supported by product settings

### Private

Only visible to the owner:

- Private collections
- Private saves
- Personal reminders

### Restricted

Only visible to authorized participants:

- Direct messages
- Group/chat-room messages

Database policies must enforce these boundaries.

---

# 19. RLS Requirements

RLS policies must be designed before migrations are finalized.

At minimum:

### Profiles

Users can update their own profile.

### Posts

Users can create/update/delete their own posts.

Public published posts can be read according to visibility rules.

### Likes

Users can create/delete their own likes.

### Comments

Users can create their own comments.

Users should only modify/delete comments they are authorized to modify.

### Saves

Users can only create/read/delete their own saves.

### Collections

Users can fully manage their own collections.

Private collections must not be publicly readable.

### Reminders

Users can only access their own reminders.

### Conversations

Users can only access conversations in which they are members.

### Messages

Users can only read/send messages in conversations they belong to.

These policies must be tested rather than assumed to work.

---

# 20. Indexing

Indexes should be added for common access patterns rather than indiscriminately.

Likely candidates include:

- `posts.author_id`
- `posts.place_id`
- `posts.created_at`
- `post_media.post_id`
- `comments.post_id`
- `post_likes.post_id`
- `saves.user_id`
- `saves.post_id`
- `collection_items.collection_id`
- `reminders.user_id`
- `reminders.remind_at`
- `follows.follower_id`
- `follows.following_id`
- `conversation_members.user_id`
- `messages.conversation_id`
- `notifications.user_id`

Composite indexes should be evaluated against actual query patterns.

---

# 21. Deletion and Data Lifecycle

Deletion behavior must be explicit.

Examples:

- Deleting a post should appropriately handle its media references, likes, comments, and saves.
- Deleting a collection should not delete the underlying posts.
- Removing a save should not delete the post.
- Leaving a conversation should not necessarily delete historical messages.
- Deleting a profile requires a documented policy for their posts, comments, messages, and social relationships.

These behaviors should be implemented through controlled database/application logic rather than accidental cascading deletes.

Before enabling destructive cascades, the impact should be reviewed.

---

# 22. Media and Storage

The database should store media metadata and storage references.

Actual media files should not be stored directly in relational database rows.

The MVP may use Supabase Storage if appropriate.

Before implementing substantial video functionality, the project must explicitly evaluate:

- Storage costs
- Bandwidth/egress costs
- Upload limits
- Video transcoding
- Thumbnail generation
- Multiple resolutions
- CDN requirements
- Moderation implications
- Backup/retention
- Scaling behavior

No dedicated video-processing architecture should be introduced without an explicit project decision.

---

# 23. Deferred Infrastructure

The following are intentionally outside the initial database architecture:

- Recommendation/ML infrastructure
- Dedicated search infrastructure
- Dedicated video-processing pipeline
- Live streaming infrastructure
- Advertising systems
- Payment systems
- Creator monetization infrastructure
- Large-scale community infrastructure
- Analytics warehouse
- Microservice architecture

The MVP should use the simplest architecture that can support validation of the core product.

---

# 24. Implementation Rule

This document describes the logical model.

Before implementation:

1. Review the model.
2. Resolve ambiguous relationships.
3. Finalize table names and column types.
4. Define RLS policies.
5. Define indexes.
6. Define migration order.
7. Create version-controlled Supabase migrations.
8. Validate migrations locally.
9. Only then connect the application to the schema.

Coding agents must not silently change the approved data model.

If implementation reveals a necessary architectural change, stop and document the proposed change before proceeding.


### One deliberate choice here

I kept **video in the logical model**, but did **not** prescribe a video-processing stack. That's intentional. We can support the product concept without accidentally committing ourselves to an expensive media architecture before we understand Supabase Storage, bandwidth/egress, transcoding, and CDN implications.

Once you've pasted and committed this on GitHub, **don't have Muse build the database yet**. The next step should be a short schema review where we challenge this model—especially **collections, reminders, messaging, deletion behavior, and Place history**—before turning it into Supabase migrations.
