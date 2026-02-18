# ReWork Project State

## Project Overview
**Project:** ReWork (rework.solutions) - AI-powered resume optimization platform

## Tech Stack
- Next.js 15.3.2 (Turbopack)
- TypeScript
- PostgreSQL via Supabase (us-west-2, project ref: oxedndnmssyuffkfkcug)
- Prisma ORM v6.8.2
- NextAuth v4 with Google OAuth
- Supabase Storage (replaced AWS S3)
- OpenAI API (GPT-4o)
- Tailwind CSS + Radix UI
- @react-pdf/renderer for PDF generation

## Environment Variables Required
- DATABASE_URL (Supabase PostgreSQL session pooler, us-west-2)
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- OPENAI_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## What's Working ✅
- Database connected and all 8 tables created ✅
- Google OAuth authentication ✅
- App boots and all pages load ✅
- Storage switched from AWS S3 to Supabase Storage ✅
- Upload UX fixed (removed fake progress bar) ✅
- AI prompt rewritten (484 lines → 82 lines, analysis → generation) ✅
- Auto-fill from PDF with accurate AI parsing (no placeholders) ✅
- Null byte sanitization for PostgreSQL compatibility ✅
- Save button feedback added ✅
- "Resume not found" flash eliminated with proper loading states ✅
- Tutorial persistence for returning users (localStorage flags) ✅
- Live preview with empty state and real-time updates ✅
- Duplicate toast notifications fixed (removed from providers.tsx) ✅
- Professional badge positioning fixed in preview ✅
- Job URL auto-fill feature (paste URL → extract job details) ✅
- Smooth upload redirect with transition message ✅

## What's NOT Done Yet
- Stripe integration for payments (FREE/PREMIUM plans exist in schema)
- npm audit fix (21 vulnerabilities: 3 critical, 4 high)
- Prisma upgrade (6.8.2 → 7.x available)
- End-to-end testing of full resume flow
- PDF export testing
- Production deployment
- Admin panel completion
- Feedback system completion
- Rate limiting on API routes
- Error boundaries
- Resume versioning UI

## Latest Fixes (2/18/26)

### Round 1 - Core Auto-fill & UI Fixes
- **Auto-fill null byte error**: Fixed by sanitizing PDF text to remove \u0000 and control characters
- **PDF parsing accuracy**: Replaced regex parsing with OpenAI GPT-4o-mini for intelligent extraction
- **Tutorial persistence**: Fixed localStorage flag handling (tutorial_completed, tutorial_dismissed, tutorial_seen)
- **Duplicate toasts**: Removed duplicate Toaster from providers.tsx, kept only in layout.tsx
- **Resume not found flash**: Added proper loading state management (isDataLoading flag)
- **Live preview**: Added empty state, fixed data display, fixed Professional badge overlap

### Round 2 - Polish & Feature Additions
- **Work Experience parsing**: Updated OpenAI prompt to extract ACTUAL job data, not placeholders
- **Education parsing**: Fixed prompt to extract real school names and programs from resume text
- **Live preview sections**: Fixed experience/education display to show all entries with proper formatting
- **Job URL auto-fill**: Added new feature to paste job posting URL and auto-extract details using cheerio + OpenAI
- **Upload redirect UX**: Reduced delay from 1.5s to 0.5s, added "Taking you to the editor..." toast message
- **Section completion logic**: Identified issue (isComplete prop vs completionScore) - needs refactor to sync

## Known Issues to Investigate
- PDF export may have issues (depends on old S3 references being fully cleaned up)
- 21 security vulnerabilities need addressing
- Some files are 600+ lines and need refactoring
- No tests exist

## Database Schema
8 models: Account, Session, User, Resume, ResumeVersion, JobApplication, Feedback, VerificationToken
3 enums: Plan (FREE/PREMIUM), ApplicationStatus, FeedbackType