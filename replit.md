# Wedding Website Platform

## Overview

This is a modern, full-stack wedding website application that allows couples to share their wedding details, manage RSVPs, display photo galleries, and interact with guests. The platform features a romantic, photo-centric public-facing website for guests and a comprehensive admin dashboard for wedding management. Built with React, Express, and PostgreSQL, it emphasizes elegant design with smooth animations and an intuitive user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and data synchronization

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives for accessible, unstyled components
- **Tailwind CSS** for utility-first styling with custom design tokens
- **CVA (Class Variance Authority)** for managing component variants
- Custom design system following modern wedding platform aesthetics (romantic rose/pink primary color, elegant typography with Playfair Display and Inter fonts)

**State Management Philosophy**
- Server state managed through React Query with aggressive caching (staleTime: Infinity)
- Local UI state handled with React hooks
- Form state managed via react-hook-form with Zod validation
- No global client state management library needed due to React Query handling server synchronization

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for the REST API server
- **Node.js** runtime with ES modules
- Middleware stack includes JSON parsing, URL encoding, and request logging

**API Design**
- RESTful endpoints organized by resource (couples, schedule, photos, messages, RSVPs, registry, settings)
- Consistent response patterns with error handling
- Authentication middleware protecting admin routes
- CRUD operations for all wedding-related entities

**Authentication System**
- **Replit Auth** integration using OpenID Connect (OIDC)
- **Passport.js** strategy for authentication flow
- Session-based authentication with PostgreSQL session storage
- Session TTL: 7 days with httpOnly, secure cookies
- Protected routes using `isAuthenticated` middleware that redirects to login on unauthorized access

### Database Architecture

**ORM & Schema**
- **Drizzle ORM** for type-safe database operations
- **@neondatabase/serverless** driver for PostgreSQL connectivity with WebSocket support
- Schema-first design with TypeScript types auto-generated from database schema
- **drizzle-zod** for validation schema generation from database schema

**Database Tables**
1. **sessions** - Session storage for authentication (required by connect-pg-simple)
2. **users** - User accounts with email, name, profile image
3. **coupleInfo** - Bride and groom details, wedding date, photos, story
4. **scheduleEvents** - Wedding day timeline with events, times, descriptions, icons
5. **photos** - Gallery images with URLs, captions, and display order
6. **guestMessages** - Guest well-wishes with approval workflow
7. **rsvps** - Guest responses with attendance, count, meal preferences
8. **registryItems** - Gift registry with store names, URLs, descriptions, images
9. **settings** - Global site settings (venue details, music URL, etc.)

**Data Modeling Decisions**
- UUIDs as primary keys using PostgreSQL's `gen_random_uuid()`
- Timestamps for created/updated tracking
- Approval workflow for guest messages (admin moderation)
- JSONB for session data flexibility
- Text fields for URLs and large content (stories, descriptions)

### External Dependencies

**Database Provider**
- **Neon** serverless PostgreSQL database (via @neondatabase/serverless package)
- Environment variable `DATABASE_URL` required for connection string
- WebSocket constructor configured for serverless environment

**Authentication Service**
- **Replit Auth** OIDC provider (issuer URL: https://replit.com/oidc)
- Required environment variables: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`, `REPLIT_DOMAINS`
- User profile data synced from Replit identity (email, name, profile image)

**Font Services**
- **Google Fonts CDN** for web typography:
  - Poppins (body text weights 300-700)
  - Cormorant Garamond (serif headings, italic variants)
  - Parisienne (decorative script for couple names)

**Development Tools**
- **Replit-specific plugins** for development environment integration:
  - @replit/vite-plugin-runtime-error-modal for error overlays
  - @replit/vite-plugin-cartographer for code mapping
  - @replit/vite-plugin-dev-banner for development indicators

**Asset Management**
- Static image assets stored in `attached_assets/generated_images/` directory
- Images referenced via Vite aliases (`@assets`) for type-safe imports
- Hero images, couple photos, and venue images pre-generated and bundled

**Styling & UI Libraries**
- **Tailwind CSS** with custom configuration for wedding theme
- **Radix UI** primitives (30+ component packages for accessibility)
- **Lucide React** for icon system
- **date-fns** for date formatting and manipulation

**Form & Validation**
- **react-hook-form** for form state management
- **Zod** for runtime validation schemas
- **@hookform/resolvers** for integrating Zod with react-hook-form

**Build & Development**
- **tsx** for TypeScript execution in development
- **esbuild** for server bundle production builds
- **PostCSS** with Autoprefixer for CSS processing