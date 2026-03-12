# TeaKeeper PWA - Product Specification

## 1. Overview

TeaKeeper is a Progressive Web App (PWA) for tea lovers to discover teas, manage personal tea collections, explore recipes, connect with friends, and use tools like tea timers and a random tea generator.

### Product Vision
Build a practical and social tea companion that helps users:
- Learn about teas
- Prepare tea correctly
- Organize personal tea inventory
- Discover and share recipes
- Interact with a tea-focused community

### Tech Stack
- Frontend: React
- Backend + Database + Auth: Supabase
- App Type: PWA (installable, responsive, offline-friendly)

## 2. Goals and Success Criteria

### Primary Goals
- Make tea discovery and preparation simple and enjoyable.
- Support daily personal use (timers, collection, saved recipes).
- Add social/community value (friends, posts, recipe sharing).
- Provide an admin workflow for content management.

### Success Metrics (initial)
- Monthly active users (MAU)
- Number of teas saved to personal collection per user
- Number of recipe views and recipe saves
- Timer usage frequency
- Number of social interactions (friend adds, likes/comments, posts)
- Returning user rate (7-day and 30-day)

## 3. User Roles

### Guest
- Browse public tea info, recipes, and blog posts
- Use basic search/filter
- Cannot save personal data

### Registered User
- All Guest capabilities
- Manage personal tea collection
- Add own recipes
- Use random generator with collection-aware logic
- Add friends and interact with social feed
- Manage profile/settings

### Admin
- All User capabilities
- Create/edit/delete tea entries
- Moderate user-generated content (posts/recipes/comments)
- Manage blog content and FAQ entries

## 4. Functional Requirements

## 4.1 Tea Info Module

### Tea Cards
Each tea card must include:
- Name
- Category (green, black, oolong, white, herbal, pu-erh, etc.)
- Origin
- Short description
- Image
- Preparation difficulty
- Button: "More details"
- Button: "Preparation"

### Tea Details Page
Detailed modal view should include:
- Full description and history
- Brewing temperature
- Steeping time
- Tea-to-water ratio
- Caffeine level
- Flavor,scent and color notes
- Related recipes

### Search and Filtering
Supported filters:
- Category
- Origin
- Caffeine level
- Color
- Time of day
- Flavor
- Preparation difficulty

Search:
- Free text search by tea name and description

### Tea Timer
- Can be opened from the Recipe or Tea Info module in the Preparation guide
- Start/pause/reset timer
- Presets by tea type
- Optional notification/vibration when timer ends (PWA permission-based)

## 4.2 Recipes Module

### Recipe Listing
- Show tea mix recipes with image, title, short description, and estimated prep time

### Recipe Details
- Ingredients
- Step-by-step preparation guide
- Optional substitutions
- Linked tea timer preset

### Recipe Actions
- Save to favorites
- Add to "My Recipes"
- Share with friends/community (if privacy allows)

## 4.3 My Teas Module

### Personal Collection
- Add teas to personal inventory
- Edit quantity/notes
- Remove teas
- Mark favorites

### Personal Content
- Add personal recipes
- Option to keep recipe private or share with friends/public

## 4.4 Random Tea Generator

### Input Logic
Generate recipe suggestions based on:
- Selected filters (category, caffeine, mood/flavor)
- Time of day (morning/afternoon/evening)
- User's available teas in personal collection

### Output
- One or more recommended recipes
- Reason for recommendation (e.g., "Low caffeine evening option")

## 4.5 Admin Page

### Tea Management
- Add, edit, archive, delete tea entries
- Upload/manage tea images
- Validate required fields before publish

### Content Moderation (recommended)
- Review/report handling for posts/comments/recipes
- Soft-delete and restore flow

## 4.6 Tea Friends (Social)

### Friend System
- Send/accept/decline friend requests
- Remove friends

### Social Feed
- View friends' recipes and updates
- Like/comment on shared content
- Privacy settings per post/recipe (private/friends/public)

## 4.7 Tips and Tricks (Blog + FAQ)

### Blog
- Admin-authored articles with categories/tags
- Rich text support (or markdown)

### FAQ
- Structured FAQ entries
- Search within FAQ

### User Interaction (optional)
- Reactions and comments on posts

## 4.8 Settings and Profile

### Profile
- Username
- Profile image
- Bio
- Favorite tea categories

### Settings
- Notifications (timer, social, content)
- Privacy controls
- Language/region (recommended for future)
- Account actions (change password, delete account)

## 5. Non-Functional Requirements

### Performance
- Fast initial load for common pages
- Lazy-load images and non-critical modules

### Security
- Supabase Auth with secure session handling
- Row Level Security (RLS) in Supabase for user data isolation
- Input validation for all user-generated content

### Reliability
- Graceful failure handling for network/database errors
- Retry strategy for transient API errors

### Accessibility
- Keyboard navigable UI
- Color contrast compliance
- Screen-reader friendly labels for controls

### Responsiveness
- Mobile-first design
- Works on desktop, tablet, and phone

## 6. PWA Requirements

- Installable app (manifest + service worker)
- Offline support for core read-only pages (cached teas, recipes, blog index)
- Background sync for queued user actions (optional, recommended)
- Push notifications for timer and social updates (optional, later phase)

## 7. Data Model (High-Level)

## Core Entities
- users
- profiles
- teas
- tea_categories
- tea_preparation_guides
- recipes
- recipe_ingredients
- user_tea_collection
- user_recipes
- friend_requests
- friendships
- posts
- comments
- blog_posts
- faq_entries

## Key Relationships
- `profiles.user_id -> users.id`
- `teas.category_id -> tea_categories.id`
- `tea_preparation_guides.tea_id -> teas.id`
- `recipes.created_by -> users.id`
- `user_tea_collection.user_id -> users.id`
- `user_tea_collection.tea_id -> teas.id`
- `friend_requests.sender_id -> users.id`
- `friend_requests.receiver_id -> users.id`

## 8. Routing / Main Screens (React)

- `/` Home / Discover
- `/teas` Tea list
- `/teas/:id` Tea details
- `/recipes` Recipe list
- `/recipes/:id` Recipe details
- `/my-teas` Personal collection
- `/generator` Random tea generator
- `/friends` Tea friends
- `/blog` Tips & Tricks
- `/faq` FAQ
- `/profile` Profile
- `/settings` Settings
- `/admin` Admin dashboard

## 9. MVP Scope (Recommended)

### Phase 1 (MVP)
- Auth + profile basics
- Tea info cards + details + search/filter
- Tea timer
- Recipes browsing + details
- My Teas collection
- Admin tea management

### Phase 2
- Random tea generator
- Personal recipe creation/sharing
- Tips & Tricks blog + FAQ

### Phase 3
- Friends/social feed
- Moderation tools
- Advanced personalization and notifications

## 10. Out of Scope (Initial)

- E-commerce/shop features
- AI chatbot
- Multi-tenant enterprise administration
- Native mobile app (PWA only in current phase)

## 11. Product Decisions (Finalized)

- Guests are allowed to use the tea timer without an account.
- User-created recipes are private by default.
- Moderation policy: Admin can delete any user-generated content (recipes, posts, comments) from the admin area.
- Multilingual support is required at launch: English and Hungarian.
- Import/export for tea collection data is not required in the initial scope.

## 12. Acceptance Criteria (Sample)

### Tea Search
- User can search by tea name.
- User can apply category and origin filters simultaneously.
- Result list updates in under 500ms on normal dataset size.

### Tea Timer
- User can start, pause, and reset timer.
- User receives a clear completion alert.
- Timer continues during short app backgrounding when supported.

### My Teas
- Authenticated user can add and remove teas in personal collection.
- Collection persists across sessions.
- User can see quantity and notes per tea.

---

Prepared for: TeaKeeper
Last updated: 2026-03-12
