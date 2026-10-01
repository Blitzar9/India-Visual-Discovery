# India Visual Discovery

## 1. Product Definition

### Product Vision

Build an India-focused visual discovery community where people discover
experiences, places, and ideas from other people, save what they like,
organize it for later, and turn inspiration into real-world plans.

The product should feel visual-first, useful, local, and community-driven.

It should not be positioned as simply an Indian copy of Instagram,
Pinterest, or Xiaohongshu/RED.

### Initial Target Audience

Primary audience:

- Indians aged approximately 18–30
- College students as the initial community wedge
- Recent graduates and early-career young adults
- Primarily users in Indian cities and emerging urban communities

The product should be useful beyond college students so that the audience
can expand naturally without requiring a fundamental change to the product.

### Core User Problem

People already discover things through Instagram, YouTube, Google,
Pinterest, Maps, WhatsApp, and other platforms.

The problem is that discovery is fragmented.

A user may find:

- a café on Instagram
- a travel idea on YouTube
- a place on Google Maps
- an outfit on Pinterest
- a recommendation in WhatsApp

but there is no single visual community designed around:

1. discovering useful ideas and experiences
2. understanding them through other people's real experiences
3. saving them
4. organizing them
5. sharing them
6. turning them into plans
7. eventually contributing their own experience

### Core Product Loop

Discover → Save → Organize → Share → Plan → Experience → Post → Discover

The MVP should strengthen this loop rather than maximize the number
of social-network features.

### Core Product Primitives

The product is built around four fundamental objects:

1. Posts
   - Visual content created by users
   - Represents an idea, recommendation, experience, or discovery

2. Places
   - Real-world locations associated with posts
   - Examples: cafés, restaurants, campuses, tourist locations,
     shops, events, and other places

3. Collections
   - Saved posts organized around a purpose or interest
   - Examples:
     - Bangalore Date Ideas
     - Goa Trip
     - Cafés to Try
     - Wedding Looks
     - College Outfit Ideas

4. Reminders
   - Optional way to turn saved content into an intended future action
   - Examples:
     - visit this café Saturday
     - check this place next month
     - use this travel idea during vacation

### Example Discovery Intent

The product should support concrete intents such as:

- "Best cafés near me under ₹800"
- "Things to do this weekend"
- "Goa trip ideas under ₹10,000"
- "College fest outfit ideas"
- "Date ideas in Bangalore"
- "PG room makeover ideas under ₹5,000"
- "Places people actually recommend"
- "What does this place look like?"

These examples illustrate the intended product behavior rather than
representing a fixed MVP feature list.

### Product Principles

1. Visual first
   - Images and visual experiences should be central to discovery.

2. Useful over addictive
   - The product should help users discover and act, not merely maximize
     time spent scrolling.

3. Real experiences
   - User-generated experiences should provide context that generic
     promotional content cannot.

4. Local relevance
   - Indian locations, budgets, occasions, languages, and lifestyles
     should be first-class considerations.

5. Save should have a purpose
   - Saving is not merely bookmarking content.
   - Collections and reminders should eventually help users do something
     with what they saved.

6. Simple MVP
   - Start with a focused product.
   - Avoid building a complete social network before the core loop is
     validated.

7. Trust and safety by default
   - User-generated content and external input are untrusted.
   - Security, privacy, authentication, authorization, and database
     protections should be designed into the system from the beginning.


## 2. MVP Social Features

### Following

Following is part of the MVP.

Users can:

- Follow another user
- Unfollow another user
- See whether they follow a user
- View follower and following counts
- Open a user's profile
- See public posts from users they follow

Following should gradually make the Home feed more personally relevant.

### Direct Messages

Basic direct messaging is part of the early product roadmap.

The intended purpose is to let users communicate with friends and share
discoveries with them.

Potential capabilities:

- One-to-one conversations
- Text messages
- Share a post
- Share a collection
- Block another user
- Report abusive messages or users

The initial implementation should remain intentionally simple.

### Chat Rooms

Group chat rooms are a planned feature.

Potential capabilities:

- Create a room with friends
- Invite members
- Remove members where appropriate
- Send messages
- Share posts
- Share collections
- Leave a room

Full-featured realtime chat should be implemented after the core discovery
loop has been validated.

### Messaging Scope

Messaging should not become the primary focus of the initial MVP.

The architecture should leave room for:

- Realtime messaging
- Message notifications
- Media sharing
- Read receipts
- Typing indicators
- Message reactions
- Larger group conversations

These features are intentionally deferred until the basic messaging
experience and core discovery loop are validated.

## 3. Authentication & Onboarding

### Authentication

The MVP should support:

- Google OAuth
- Apple Sign In
- Email and password
- Phone number with OTP

Phone number is optional unless the user chooses phone-based
authentication or a later product/security requirement explicitly
requires verification.

Authentication should be handled through Supabase Auth rather than
custom-built authentication.

### New User Flow

A new user follows this flow:

1. Open the app
2. Sign up or log in
3. Complete authentication
4. Create their profile
5. Select interests
6. Enter the main discovery experience

### Profile Setup

Basic profile setup is required before a new user can enter the main app.

Required:

- Unique username
- Display name
- Profile avatar
- Interests

Optional:

- Gender
- Bio
- City

Users who do not want to upload a personal photo can use a
generated/default avatar.

Profile information can be edited later from profile settings.

### Onboarding Principles

- Keep onboarding short and simple.
- Require only a small amount of information.
- Do not require a personal photograph.
- Use interests to provide an initial basis for relevant discovery.
- Do not ask for unnecessary personal information.
- Do not prevent users from changing their profile information later.

## 4. Discovery Experience

### Home

Home is the user's personalized discovery feed.

It should primarily contain:

- Posts related to selected interests
- Posts from users the person follows
- Relevant recent content
- Visual-first post cards

The initial personalization system should remain simple and should not
require recommendation AI.

### Explore

Explore is the user's open-ended discovery and search experience.

It should help users discover:

- Places
- Topics
- Categories
- New creators/users
- Recent content
- Popular or emerging content

Home answers:

> "What might I like?"

Explore answers:

> "What can I discover?"

Home and Explore should remain distinct experiences rather than becoming
two versions of the same feed.

## 5. Content & Posts

### Post Types

Users can create:

1. Single-photo posts
2. Multi-photo carousel posts
3. Video posts
4. Text/visual posts created using in-app editing tools
5. Photo posts with voice-over
6. Stories

### Post Metadata

Posts can contain:

- Caption
- Place/location
- Tags
- User tags
- Interests/categories
- Creator information
- Creation date
- Likes
- Saves
- Comments
- Shares

### Place Association

A post can be associated with a real Place entity.

Place information should be modeled separately from free-form location
text so that posts can be grouped together on Place pages.

This creates the relationship:

User → Place → Posts → Time → Experiences

### Creation & Editing

The MVP creation experience should support simple visual editing,
including:

- Photo selection
- Video selection
- Photo ordering
- Cropping
- Adding text
- Basic text positioning
- Basic typography options
- Simple visual layouts
- Voice-over recording

The MVP should not attempt to replicate the complexity of professional
design or video-editing applications.

### Carousels

Users can combine multiple photos into a single post.

Users should be able to:

- Add multiple photos
- Reorder photos
- Remove photos
- Preview the carousel
- Publish it as one post

### Video

Video posts are supported in the MVP.

The initial video experience should remain simple:

- Select or upload a video
- Preview the video
- Add caption and metadata
- Add location and tags
- Publish

The project must not assume that storing and delivering original video
files indefinitely is the final scalable architecture.

Media storage, video processing, transcoding, CDN/delivery, bandwidth,
storage costs, upload limits, and lifecycle management must be evaluated
before finalizing the production media architecture.

The database should store media metadata and references rather than
embedding large media files directly in database records.

### Stories

Stories are temporary visual content and are separate from permanent
posts.

Stories may support:

- Photos
- Videos
- Text
- Simple visual editing
- Location
- Tags
- Voice/audio where appropriate

Stories should have a separate lifecycle from permanent posts and should
not automatically become part of a user's permanent post history.

### Visual Identity & Interaction

India Visual Discovery should have a distinctive visual language rather than closely replicating existing social-media interfaces.
- Layout, spacing, typography, color, imagery, component placement, animation, and interaction feedback should be designed as a coherent system.
- The design may use principles such as golden-ratio-inspired proportions, visual hierarchy, asymmetry, whitespace, and editorial composition where they improve aesthetics and usability. These principles should guide design rather than function as rigid mathematical constraints.
- Motion should be purposeful, responsive, subtle, and consistent. Animations should communicate relationships and state changes rather than exist purely for decoration.
- Accessibility, readability, touch targets, responsiveness, and performance take priority over aesthetic rules.
