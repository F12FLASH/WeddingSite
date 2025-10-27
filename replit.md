# Wedding Website - Xuân Lâm & Xuân Lợi

## Overview

This is a full-stack Vietnamese wedding website platform designed for Xuân Lâm & Xuân Lợi. It provides a complete wedding management system including:

- **Public Wedding Site**: A beautiful, responsive landing page with hero section, couple story, photo gallery, schedule, RSVP, guest messages, location map, and gift registry with QR code support
- **Admin Dashboard**: Comprehensive management panel for editing content, managing RSVPs, approving messages, and customizing settings
- **Database-Driven**: All content is stored in PostgreSQL and dynamically loaded
- **Vietnamese-First**: Fully localized UI and content in Vietnamese language

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 2025)

### Font Customization Feature
- **Date**: October 27, 2025
- **Changes**:
  - Added comprehensive font customization system with 4 font types:
    - `fontHeading` - Main heading font
    - `fontBody` - Body text font
    - `fontCursive` - Decorative/artistic font for names and special elements
    - `fontSerif` - Additional serif font for special sections
  - All fonts support Vietnamese characters (dấu thanh, diacritics)
  - Dynamic Google Fonts loading via FontProvider component
  - Admin UI with live preview for each font selection
  - Vietnamese-compatible font options:
    - Cursive: Dancing Script, Yellowtail, Yesteryear
    - Serif: Cormorant Garamond, Playfair Display, Noto Serif, Crimson Text, Lora
    - System fonts: Georgia, Times New Roman
  - CSS variables automatically updated when fonts change
  - Production-ready with Vercel deployment support

### Windows Development Script
- Improved `start-local.bat` with better Vietnamese language support
- Enhanced error handling and user experience
- Interactive database setup options
- Better visual feedback with colored output

## System Architecture

### Frontend Architecture

**Technology Stack**:
- React 18.3 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Framer Motion for animations
- Tailwind CSS for styling
- shadcn/ui component library (New York style variant)

**Key Design Patterns**:
- Component-based architecture with clear separation between pages and reusable UI components
- Query-based data fetching with automatic caching and revalidation
- Form handling with React Hook Form and Zod validation
- Responsive design with mobile-first approach
- Image upload via base64 encoding (can be extended to cloud storage)

**State Management**:
- Server state managed via TanStack Query with queryClient
- Local state with React hooks
- Form state with React Hook Form
- Authentication state checked via `/api/auth/user` endpoint

**Route Structure**:
- `/` - Public landing page
- `/login` - Admin login
- `/admin/*` - Protected admin dashboard routes

### Backend Architecture

**Technology Stack**:
- Node.js 20.x with Express.js
- TypeScript with ES modules
- Drizzle ORM for database operations
- Passport.js with Local Strategy for authentication
- Express-session with PostgreSQL store
- Bcrypt for password hashing

**API Design**:
- RESTful API endpoints under `/api/*`
- Session-based authentication with HTTP-only cookies
- Protected routes using `isAuthenticated` middleware
- JSON request/response format
- File upload handling via base64 data URLs

**Key Endpoints**:
- `/api/login`, `/api/logout`, `/api/auth/user` - Authentication
- `/api/couple` - Couple information
- `/api/schedule` - Wedding schedule events
- `/api/photos` - Photo gallery
- `/api/messages` - Guest messages (with approval workflow)
- `/api/rsvps` - RSVP submissions
- `/api/settings` - Site configuration
- `/api/wedding-party` - Wedding party members
- `/api/popups` - Welcome/scroll-end popups

**Database Schema**:
The application uses PostgreSQL with the following main tables:
- `users` - Admin authentication
- `sessions` - Session storage (critical for serverless)
- `couple_info` - Bride/groom details and story
- `schedule_events` - Wedding timeline
- `photos` - Gallery images with categories
- `guest_messages` - Guest wishes (with approval)
- `rsvps` - Guest responses
- `settings` - Site-wide configuration (venue, music, QR codes, fonts, social links)
- `wedding_party` - Bridesmaids/groomsmen
- `popups` - Welcome and scroll-end promotional images
- `music_tracks` - Background music playlist

**Authentication Flow**:
- Admin credentials stored with bcrypt-hashed passwords
- Session-based auth using PostgreSQL session store
- Trust proxy enabled for Vercel deployment
- Secure cookies in production (SameSite=none, Secure=true)

**Serverless Optimization**:
- Minimal database connection pooling (max: 1) to prevent "too many connections" errors
- PostgreSQL session store required (MemoryStore incompatible with serverless)
- Stateless function design
- No idle timeout on connections

### External Dependencies

**Database**:
- **PostgreSQL (Neon)**: Production database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for Express

**Asset Storage**:
- Images stored as base64 data URLs in database
- Static files served from `/attached_assets` directory
- Music files served from `/attached_assets/wedding_music`
- Supports future migration to cloud storage (Cloudinary, AWS S3)

**Third-Party Services** (Optional):
- Google Maps embedded iframe for venue location
- Google Fonts API for dynamic font loading
- Social media links (Instagram, Facebook, Twitter)

**Deployment**:
- **Vercel**: Serverless deployment platform
- Build command: `npm run build`
- Output directory: `dist/public`
- Serverless function: `api/index.js`
- Environment variables: `DATABASE_URL`, `SESSION_SECRET`, `ALLOWED_ORIGINS`

**Development Tools**:
- esbuild for server bundling
- TypeScript compiler for type checking
- Drizzle Kit for database migrations
- TSX for running TypeScript files directly

**UI Framework**:
- Radix UI primitives for accessible components
- Tailwind CSS with custom theme configuration
- Custom color system with HSL values
- Multiple font families supporting Vietnamese characters

**Key Configuration Files**:
- `drizzle.config.ts` - Database connection and migration settings
- `vite.config.ts` - Frontend build configuration
- `vercel.json` - Serverless deployment configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Styling theme

**Environment Variables Required**:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Session encryption key
- `ALLOWED_ORIGINS` - CORS allowed origins (optional)
- `NODE_ENV` - Environment flag (development/production)