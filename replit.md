# Wedding Website Application

## Overview

This is a full-stack Vietnamese wedding website application built with React, Express, and PostgreSQL. The application serves two main purposes:

1. **Public Wedding Website** - A beautiful, interactive landing page where guests can view wedding details, RSVP, leave messages, browse photos, and access venue information
2. **Admin Dashboard** - A comprehensive content management system for the couple to manage all aspects of their wedding website

The application is designed for Vietnamese-speaking users with bilingual support and features elegant animations, responsive design, and a romantic aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- Framer Motion for animations and transitions
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom wedding theme

**Design Decisions:**
- **Component Structure**: Separation between public-facing components (`/components`) and admin pages (`/pages/Admin*`)
- **State Management**: Server state managed via React Query with optimistic updates; local UI state with React hooks
- **Animation Strategy**: Framer Motion provides smooth page transitions, scroll animations, and interactive elements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Image Handling**: Base64 data URLs for simplicity (can be migrated to cloud storage like Cloudinary)

**Key Features:**
- Music player with playlist support
- Interactive photo gallery with lightbox
- Real-time RSVP form with validation
- Guest message board with approval workflow
- Wedding party showcase
- Event schedule timeline
- QR code registry for monetary gifts

### Backend Architecture

**Technology Stack:**
- Express.js for HTTP server
- Node.js with ESM modules
- TypeScript for type safety
- Drizzle ORM for database operations
- PostgreSQL (via Neon serverless) for data persistence
- Passport.js with local strategy for authentication
- express-session with PostgreSQL store for session management
- bcrypt for password hashing

**Design Decisions:**
- **Session Storage**: PostgreSQL-backed sessions (critical for serverless deployment compatibility)
- **Authentication**: Username/password authentication with bcrypt hashing; sessions stored in database
- **API Design**: RESTful endpoints with consistent error handling
- **Database Access**: Repository pattern via `storage.ts` abstraction layer
- **Security**: CORS configuration, session cookies, password hashing, authenticated routes

**Key Endpoints:**
- `/api/couple` - Couple information management
- `/api/schedule` - Wedding schedule events
- `/api/photos` - Photo gallery management
- `/api/messages` - Guest messages with approval
- `/api/rsvps` - RSVP submissions
- `/api/registry` - Gift registry and QR codes
- `/api/settings` - Global site settings
- `/api/wedding-party` - Wedding party members
- `/api/popups` - Promotional popups

### Data Storage

**Database: PostgreSQL (Neon Serverless)**

**Schema Design** (defined in `shared/schema.ts`):
- `sessions` - Session storage for authentication
- `users` - Admin user accounts
- `couple_info` - Bride and groom information, wedding date, photos, love story
- `schedule_events` - Timeline of wedding day events
- `photos` - Wedding photo gallery with categories
- `guest_messages` - Guest wishes with approval status
- `rsvps` - Guest attendance confirmations with meal preferences
- `registry_items` - Gift registry (currently unused in favor of QR codes)
- `settings` - Global configuration (venue, contact, social links, QR codes)
- `wedding_party` - Bridesmaids and groomsmen
- `popups` - Welcome and promotional popups
- `faqs` - Frequently asked questions (schema exists but feature not implemented)
- `music_tracks` - Background music playlist (schema exists but feature not implemented)

**Data Flow:**
1. Client requests data via React Query
2. Query hits Express API endpoint
3. Storage layer (repository pattern) queries database via Drizzle ORM
4. Data returned as JSON to client
5. React Query caches and manages state

**Image Storage Strategy:**
- Current: Base64 data URLs stored directly in PostgreSQL
- Rationale: Simplicity, no external dependencies, works in all environments
- Trade-off: Larger database size, but acceptable for typical wedding photo counts
- Future: Can migrate to Cloudinary/S3 by updating `imageUpload.ts` utility

### Deployment Architecture

**Vercel Serverless Deployment:**
- Static frontend served from `/dist/public`
- API routes handled by serverless function (`/api/index.js`)
- PostgreSQL database hosted on Neon (serverless-compatible)
- Environment variables for `DATABASE_URL` and `SESSION_SECRET`

**Development vs Production:**
- Development: Vite dev server with HMR, local database
- Production: Pre-built static assets, serverless API, managed database

**Build Process:**
1. `npm run build` - Builds React frontend with Vite
2. Bundles server code with esbuild
3. Outputs to `/dist` directory
4. Vercel deploys static assets and serverless function

### Authentication & Authorization

**Authentication Mechanism:**
- Passport.js with LocalStrategy (username/password)
- Sessions stored in PostgreSQL (serverless-compatible)
- bcrypt password hashing with salt rounds
- HTTP-only cookies for session tokens

**Session Management:**
- 7-day session lifetime
- PostgreSQL session store via `connect-pg-simple`
- Secure cookies in production (HTTPS only)
- SameSite cookie policy for CSRF protection

**Authorization:**
- Admin routes protected by `isAuthenticated` middleware
- Public routes (landing page, RSVP, messages) accessible to all
- Guest messages require approval before public display

## External Dependencies

### Third-Party Services

**Database:**
- **Neon PostgreSQL** - Serverless PostgreSQL database
  - Connection via `@neondatabase/serverless` driver
  - Environment variable: `DATABASE_URL`
  - Auto-scaling, branching support

**Hosting:**
- **Vercel** - Serverless deployment platform
  - Static asset hosting
  - Serverless function execution
  - Automatic HTTPS, CDN

### NPM Packages

**Core Framework:**
- `express` - Web server framework
- `react` & `react-dom` - UI library
- `vite` - Build tool and dev server
- `drizzle-orm` & `drizzle-kit` - TypeScript ORM

**UI Components:**
- `@radix-ui/*` - Accessible component primitives
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon library

**State Management:**
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing

**Authentication:**
- `passport` & `passport-local` - Authentication middleware
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store
- `bcrypt` - Password hashing

**Utilities:**
- `zod` & `drizzle-zod` - Schema validation
- `react-hook-form` - Form handling
- `date-fns` - Date formatting
- `nanoid` - Unique ID generation

### Media Assets

**Static Files:**
- `/attached_assets/wedding_images/` - Uploaded wedding photos organized by category
- `/attached_assets/wedding_music/` - Background music files
- Font: Google Fonts for Vietnamese character support

**Asset Categories:**
- `album/` - Wedding photo gallery
- `avatar/` - Bride and groom profile photos
- `background/` - Hero section backgrounds
- `venue/` - Venue location photos
- `bridesmaids/` & `groomsmen/` - Wedding party photos
- `qr/` - Payment QR codes for gift registry