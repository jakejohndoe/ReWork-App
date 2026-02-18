# ReWork - Claude Code Instructions

## First Steps for Any New Session
1. Read STATE.md for current project status
2. Read TODO.md for prioritized task list
3. Run `npm run dev` to verify the app boots
4. Ask what we're working on today

## Project Structure
- `src/app/` - Next.js app router pages + API routes
- `src/components/` - React components
- `src/lib/` - Utilities (storage.ts, openai.ts, prisma.ts)
- `src/types/` - TypeScript definitions
- `prisma/` - Database schema

## Key Files
- `src/lib/storage.ts` - Supabase Storage (was S3)
- `src/app/api/resumes/[id]/analyze/route.ts` - AI resume generation
- `src/components/resume-uploader.tsx` - File upload component
- `prisma/schema.prisma` - Database schema

## Environment
- `.env` file (not .env.local) - Prisma reads from .env
- Supabase region: us-west-2
- Database: Session pooler connection (port 5432)

## Rules
- Always test changes after making them
- Don't upgrade Prisma without explicit permission
- Don't run `npm audit fix --force` without explicit permission
- Make changes in small, testable chunks
- If something breaks, fix it before moving on