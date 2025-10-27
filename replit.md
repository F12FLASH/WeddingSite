# Wedding Website - Xuân Lâm & Xuân Lợi

## Overview

A modern, full-featured Vietnamese wedding website platform that combines a public-facing wedding invitation site with a comprehensive admin dashboard. The application enables couples to manage their entire wedding digital presence - from personalized invitations and photo galleries to guest RSVP tracking and gift registry management.

**Core Purpose**: Provide a complete, culturally-appropriate wedding management solution for Vietnamese couples with traditional elements (QR code money gifts) integrated seamlessly with modern web technologies.

**Key Capabilities**:
- Public wedding website with hero section, couple story, event schedule, photo gallery, guest messages, RSVP system, location details, and gift registry
- Admin dashboard for managing all content, tracking responses, and moderating messages
- Real-time RSVP tracking and guest management
- Vietnamese-first design with full language support
- Mobile-responsive design optimized for Vietnamese users

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18.3 with TypeScript 5.6
- **UI Library**: Radix UI components styled with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter (lightweight client-side routing)
- **Animations**: Framer Motion for smooth, elegant transitions
- **Forms**: React Hook Form with Zod validation

**Design System**:
- Shadcn/ui component library (New York style variant)
- Custom theming with CSS variables for light/dark mode
- Vietnamese font support via Google Fonts (Noto Serif, Dancing Script, Great Vibes)
- Responsive design with mobile-first approach

**Key Design Patterns**:
- Component composition with shared UI primitives
- Server state synchronized via React Query with aggressive caching
- Animation patterns using Intersection Observer for scroll-triggered effects
- Image optimization through base64 data URLs (embedded in database)

**Layout Structure**:
- Public landing page: Single-page application with smooth scrolling sections
- Admin dashboard: Sidebar navigation with nested routes for different management areas
- Protected routes with authentication checks

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20.x
- **Build Tool**: Vite for frontend bundling, esbuild for server bundling
- **Development**: tsx for TypeScript execution in development

**API Design**:
- RESTful endpoints organized by resource (`/api/couple`, `/api/schedule`, `/api/rsvps`, etc.)
- Session-based authentication using Passport.js with local strategy
- CORS configuration for Vercel deployment with allowed origins
- Express middleware for JSON parsing (50MB limit for base64 images)

**Authentication & Authorization**:
- Passport.js Local Strategy with bcrypt password hashing
- Session storage in PostgreSQL using connect-pg-simple
- Protected routes using `isAuthenticated` middleware
- Admin-only access to mutation endpoints
- Cookie-based sessions with httpOnly, secure flags in production

**Data Access Layer**:
- Storage abstraction pattern (`server/storage.ts`) providing CRUD operations
- All database operations go through storage interface for consistency
- Separation of concerns: routes handle HTTP, storage handles data

### Data Storage

**Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection Pooling**: node-postgres (pg) with minimal pooling for serverless (max: 1 connection)

**Schema Design**:
- `users` - Admin authentication
- `sessions` - Express session storage (required for serverless)
- `couple_info` - Bride/groom information and story
- `schedule_events` - Wedding timeline events
- `photos` - Gallery images with base64 storage
- `guest_messages` - Guest wishes with approval workflow
- `rsvps` - Guest attendance responses
- `registry_items` - Gift registry (deprecated in favor of QR codes)
- `settings` - Site configuration (venue, music, fonts, social links)
- `wedding_party` - Bridesmaids/groomsmen information
- `faqs` - Frequently asked questions
- `popups` - Welcome and scroll-end promotional popups
- `music_tracks` - Background music playlist

**Data Storage Strategy**:
- Images stored as base64 data URLs directly in database (simplifies deployment, no external storage needed)
- Session data persisted to PostgreSQL (critical for Vercel serverless - cannot use memory store)
- All timestamps use PostgreSQL timestamp type with timezone awareness

### External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Vercel**: Serverless deployment platform (configured via vercel.json)
- **Google Fonts API**: Dynamic font loading for Vietnamese typography
- **Google Maps Embed API**: Venue location maps

**Key NPM Packages**:
- `@neondatabase/serverless` - Neon database client
- `drizzle-orm` - TypeScript ORM with PostgreSQL dialect
- `bcrypt` - Password hashing for admin authentication
- `passport` / `passport-local` - Authentication middleware
- `express-session` / `connect-pg-simple` - Session management with PostgreSQL backing
- `@tanstack/react-query` - Server state management on frontend
- `framer-motion` - React animation library
- `@radix-ui/*` - Accessible UI component primitives
- `tailwindcss` - Utility-first CSS framework
- `zod` - TypeScript-first schema validation
- `react-hook-form` - Form state management

**Asset Management**:
- Static assets served from `attached_assets/` directory
- Wedding images organized in subdirectories (album, avatar, background, venue, etc.)
- Music files served from `attached_assets/wedding_music/`
- All uploads converted to base64 for database storage (no CDN dependency)

**Deployment Architecture**:
- **Vercel Serverless Functions**: Express app wrapped in serverless handler (`api/index.js`)
- **Build Process**: Vite builds client to `dist/public`, esbuild bundles server to `dist/`
- **Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `ALLOWED_ORIGINS`
- **Static File Serving**: Vercel serves from `dist/public` with rewrites for SPA routing

**Development vs Production**:
- Development: Vite dev server with HMR on port 5000
- Production: Static files served by Vercel, API routes handled by serverless functions
- Database pooling: 1 connection max in serverless to prevent "too many connections" errors
- Session store: Always PostgreSQL (never in-memory) for serverless compatibility