# Design Guidelines: Modern Wedding Website

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern wedding platforms (The Knot, Zola, Joy), luxury e-commerce (Shopify weddings), and visual-rich experiences (Pinterest, Instagram). This wedding site prioritizes emotional impact, romantic aesthetics, and visual storytelling with generous animations.

**Core Principles**:
- Romantic yet contemporary visual language
- Generous whitespace with elegant typography
- Smooth, delightful animations throughout
- Photo-centric design celebrating the couple's journey
- Intuitive navigation with emotional resonance

## Color Palette

**Light Mode (Primary)**:
- Primary: 340 82% 52% (Romantic Rose/Pink)
- Primary Light: 340 100% 95% (Blush background accents)
- Secondary: 200 18% 46% (Sophisticated Sage)
- Accent: 45 93% 47% (Warm Gold - for CTAs and highlights)
- Background: 0 0% 100% (Pure White)
- Surface: 340 40% 98% (Soft Blush tint)
- Text Primary: 240 10% 15% (Deep Charcoal)
- Text Secondary: 240 6% 45% (Medium Gray)

**Dark Mode (Admin Panel)**:
- Background: 240 10% 8%
- Surface: 240 8% 12%
- Primary: 340 70% 60%
- Text: 0 0% 95%

## Typography

**Fonts** (via Google Fonts CDN):
- Primary/Headings: 'Playfair Display' (serif, romantic elegance)
- Body: 'Inter' (sans-serif, modern readability)
- Accent/Script: 'Great Vibes' (cursive, for couple names and special moments)

**Scale**:
- Hero Title: text-6xl md:text-7xl lg:text-8xl font-serif
- Section Headings: text-4xl md:text-5xl font-serif
- Couple Names: text-5xl md:text-6xl font-cursive
- Body: text-base md:text-lg
- Small/Meta: text-sm

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-20 md:py-32
- Card spacing: p-6 md:p-8
- Element gaps: gap-8 md:gap-12

**Grid System**:
- Container: max-w-7xl mx-auto px-4
- Gallery: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 (masonry-style)
- Features: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Timeline: Single column with alternating left/right cards

## Component Library

**Hero Section**:
- Full-screen (min-h-screen) with romantic couple photo background
- Overlay gradient (from primary-light/30 to transparent)
- Centered couple names in cursive font
- Wedding date and countdown timer
- Animated scroll indicator
- Blurred-background outline buttons for RSVP/Registry

**Navigation**:
- Sticky transparent header with blur backdrop (backdrop-blur-md)
- Logo/Monogram on left, menu items centered
- Smooth scroll to sections
- Mobile: hamburger menu with slide-in panel

**Photo Gallery**:
- Masonry grid layout with varying heights
- Hover: subtle scale (scale-105) and overlay with caption
- Lightbox modal with image carousel, prev/next navigation
- Categories: Pre-wedding, Engagement, Couple moments

**Timeline Cards**:
- Alternating left/right layout on desktop
- Vertical line connecting events
- Rounded cards with shadow-lg, hover:shadow-2xl
- Icons for each event (ceremony, reception, party)
- Time, location, and description

**RSVP Form**:
- Two-column layout: form on left, event details/illustration on right
- Floating labels, soft rounded inputs (rounded-xl)
- Radio buttons for attendance, dropdown for meal preferences
- Guest count stepper
- Primary button with gradient background

**Message Board**:
- Card grid showing guest messages (grid-cols-1 md:grid-cols-2)
- Each card: guest name, message, timestamp
- Submit form: textarea with character limit, name field
- New messages appear with fade-in animation

**Location Map**:
- Split layout: embedded Google Maps on left, venue details on right
- Address, directions button, parking info
- Venue photo gallery thumbnail strip

**Registry/Wishlist**:
- Grid of gift cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: image, item name, price, "View" button
- Links to external registry sites (Amazon, Target, etc.)

**Footer**:
- Three columns: Quick links, Contact info, Social media
- Newsletter signup for wedding updates
- Copyright with couple names and heart icon

**Admin Panel**:
- Sidebar navigation (dark mode)
- Dashboard with statistics cards (total guests, RSVP count, messages)
- Data tables with sorting, filtering
- Image upload with drag-drop
- Rich text editor for content management

## Animations

**Entrance Animations** (using Framer Motion or CSS):
- Fade-in + slide-up for section content (duration: 0.6s, delay: stagger 0.1s)
- Scale-in for cards (from 0.9 to 1, duration: 0.4s)
- Hero elements: staggered fade-in (names → date → CTA)

**Scroll Animations**:
- Parallax effect on hero background (slower scroll than content)
- Timeline events reveal on scroll into view
- Photo gallery items fade-in as they enter viewport

**Hover Effects**:
- Cards: lift with shadow (translateY(-4px), shadow expansion)
- Photos: subtle zoom (scale-105) with brightness increase
- Buttons: gradient shift, soft glow
- Links: underline slide-in animation

**Page Transitions**:
- Smooth scroll behavior (scroll-smooth)
- Modal/lightbox: backdrop fade-in, content scale from center
- Form submission: success animation with confetti effect

**Special Effects**:
- Floating hearts animation on hero section (CSS keyframes)
- Countdown timer with flip animation for digits
- Music player: vinyl record rotation when playing

## Images

**Required Images**:
1. **Hero Background**: Full-screen romantic couple photo (engagement or pre-wedding shoot), soft focus background, couple in center-right composition
2. **About Section**: Side-by-side individual portraits of bride and groom, circular crops with elegant borders
3. **Our Story**: 3-4 milestone photos in timeline format (first meeting, proposal, engagement)
4. **Gallery**: 20+ high-quality photos across categories (pre-wedding, candid moments, venues)
5. **Venue**: Exterior and interior shots of wedding location
6. **Registry Cards**: Product images for wishlist items

**Image Treatment**:
- Rounded corners (rounded-2xl) for gallery photos
- Circular crops for portraits (rounded-full)
- Soft shadow overlays for text readability
- Lazy loading for performance
- Optimized formats (WebP with JPEG fallback)

## Responsive Behavior

- Mobile-first approach
- Single column on mobile, multi-column on tablet/desktop
- Hamburger menu below 768px
- Touch-friendly tap targets (min 44px)
- Optimized image sizes per breakpoint
- Simplified animations on mobile (reduced motion)

This design creates a visually stunning, emotionally resonant wedding website that celebrates the couple's journey with modern aesthetics and delightful interactions.