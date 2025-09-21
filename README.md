**Project: RTKL (Article Management Website)** 

**Features:**
- User authentication (sign up/login for writers)
- Create, edit, and manage articles with rich text editor
- Tag system for articles
- Category/subcategory organization with easy updates post-publication
- Author subscription system for readers
- User profiles and article browsing

**Tech Stack:**
- **Frontend:** Next.js 14+ with TypeScript and Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, auth, real-time APIs)
- **Hosting:** Vercel (free tier)

**Database Schema:**
- Users (Supabase Auth)
- Articles (author_id, title, content, category_id, tags)
- Categories/Subcategories (hierarchical structure)
- Tags (many-to-many with articles)
- Subscriptions (follower-author relationships)

**Requirements:** Free hosting, easy content management, SEO-friendly article pages, real-time features for subscriptions.
