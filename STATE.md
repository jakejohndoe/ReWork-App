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
- Auto-fill from PDF fixed ✅
- Save button feedback added ✅
- "Resume not found" flash eliminated ✅
- Tutorial persistence for returning users ✅
- Live preview shows formatted template ✅

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

## Known Issues to Investigate
- Need to verify auto-fill actually works end-to-end (just fixed, not user-tested yet)
- Need to verify save actually persists (feedback added, but persistence not confirmed)
- PDF export may have issues (depends on old S3 references being fully cleaned up)
- 21 security vulnerabilities need addressing
- Some files are 600+ lines and need refactoring
- No tests exist

## Database Schema
8 models: Account, Session, User, Resume, ResumeVersion, JobApplication, Feedback, VerificationToken
3 enums: Plan (FREE/PREMIUM), ApplicationStatus, FeedbackType