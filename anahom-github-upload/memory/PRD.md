# Anahom Stays — PRD

## Problem Statement
Scroll-driven storytelling (scrollytelling) luxury website for Anahom Stays, a newly founded
hospitality / home-management company in North Goa. Editorial, calm, premium, memorable.
Emotion over information. Mobile is highest priority (QR-code traffic). Future routes:
/stay /partner /about /journal /contact /invest.

## Stack
- Frontend: React 19, framer-motion, Lenis smooth scroll, Tailwind, shadcn/ui (accordion), sonner.
- Backend: FastAPI + MongoDB (motor). Contact submissions.
- Design system: /app/design_guidelines.json (Cormorant Garamond + Hanken Grotesk; warm-white/
  travertine/sand/stone/olive/bronze/charcoal palette; no gradients/bright colors).

## Architecture
- /app/frontend/src/pages/Home.jsx assembles sections in order.
- Sections in /app/frontend/src/components/site/: Hero, Philosophy, OurStory, HomesWeLove,
  WhyChoose, Partnership (drag comparison slider), Process (self-drawing house SVG),
  FoundersLetter, Faqs, Marquee, Contact, Nav (scroll progress), Footer.
- SmoothScroll.jsx mounts Lenis, exposes window.__lenis.
- Backend: POST/GET /api/contact (ContactCreate: name,email,phone,message,intent).

## Implemented (2026-07-17)
- Full 10-chapter scrollytelling one-page experience with masked reveals, parallax,
  self-drawing SVG, interactive comparison slider, editorial marquee, breathing buttons.
- Mobile-first responsive; hero video desktop-only (>=768px) for performance.
- Contact form persists to Mongo. SEO meta + title set.
- Tested: backend 6/6, frontend 100% desktop + mobile, zero horizontal overflow.

## Prioritized Backlog
- P0: Replace placeholder media (hero drone video, gallery/founder photos) with client assets.
- P0: Replace placeholder contact details (WhatsApp/phone/email) — currently in Contact.jsx.
- P1: Align copy with client's Framer content (Our Vision, What We Look For chips, preferred
  locations, Revenue Sharing vs Guaranteed Lease, owner value cards, founder "Arun Singh").
- P1: Admin panel to upload/swap media & view contact submissions.
- P1: Email notification on new contact (Resend, Emergent-managed).
- P2: Build out future routes (/stay /partner /journal /invest).
- P2: Contact form spam protection (honeypot/throttle) before public QR launch.

## Notes
- No auth. Lenis intercepts native scroll; use window.__lenis.scrollTo for programmatic nav.

## Update 2026-07-17 (content pass)
- Founders: Arun Singh & Tanishka Verma (photos pending — "photo coming soon" placeholders in FoundersLetter.jsx).
- Copy rewritten in brand voice: Hero "It begins with home." + "A Conscious Living Brand"; Philosophy = brand-name story (Ananta + Om); Our Story = "We're at the beginning" homeowner-partner invitation; Homes = "The Anahom Aesthetic"; Contact = "Partner With Us"; email partner@anahomstays.com.
- Inserted client's 5 real interior photos (warm wood / white plaster / travertine) via customer-assets URLs in HomesWeLove.jsx (3) and OurStory.jsx (2).
- Phase 1 positioning confirmed: single premium landing page whose sole goal is converting property owners into partners (no bookings/blog/gallery-as-distraction).
- Still pending from client: logo, hero drone video, founder photos, real WhatsApp/phone numbers.

## Update 2026-07-17 (sections pass)
- Hero: now a single still image (client's poolside villa, customer-assets) — video removed.
- Philosophy "What Anahom Means": added two editorial images (arched-niche lounge + canopy bed).
- NEW "What Makes Anahom Different" (#different) replaces old Why Choose Us: 9 principles reveal one-by-one on scroll, sticky heading, lucide icons, charcoal bg. (WhatMakesDifferent.jsx)
- "Our Process" (#process) rewritten as a 7-step scroll journey (Discover/Evaluate/Curate/Prepare/Host/Preserve/Grow Together) with a bronze progress line that fills on scroll + icon nodes.
- REMOVED Partnership section + the words "Partnership Models / Co-Hosting / By Invitation" (deleted Partnership.jsx). Nav/Footer "Partnership" -> "Difference".
- Tested iteration_2: all features pass desktop + mobile; fixed a 6px mobile overflow in Process (added overflow-hidden). Zero horizontal overflow confirmed (390=390).
