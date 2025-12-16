# Personal Activity Notes Dashboard

A production-ready Next.js SaaS application demonstrating full-stack architecture, authentication, database integration, and modern web development practices.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Auth.js) with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Ready for Vercel/Railway/Fly.io

## Features Demonstrated

### Authentication & Authorization
- Google OAuth integration
- Protected server-side routes
- Session management

### Database Architecture
- Prisma schema design
- Relational data modeling (User, Note, Category)
- Transaction handling
- Indexed queries for performance

### Server Actions
- Form handling with server actions
- Data validation
- Path revalidation for cache updates

### UI/UX
- Responsive design with Tailwind CSS
- Server components for optimal performance
- Client-side interactivity where needed
- Clean, modern interface

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (`.env.local`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/activity_notes"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   NEXTAUTH_SECRET="a-long-random-secret-string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` and sign in with Google.

## Architecture Highlights

- **Server Components**: Dashboard and pages use React Server Components for optimal performance
- **Type Safety**: Full TypeScript coverage with Prisma-generated types
- **Security**: Authentication required for all data operations
- **Scalability**: Indexed database queries, efficient data fetching patterns

## Project Structure

```
src/
  app/
    api/auth/[...nextauth]/  # Auth.js route handlers
    dashboard/                # Protected dashboard
      actions.ts              # Server actions
      page.tsx               # Dashboard UI
    page.tsx                 # Landing page
  lib/
    auth.ts                  # Auth.js configuration
    prisma.ts                # Prisma client singleton
    ai.ts                    # Placeholder note generation
```

## Portfolio Use

This project demonstrates:
- Full-stack SaaS development
- Modern Next.js patterns
- Authentication implementation
- Database design and ORM usage
- Production-ready code structure
Suitable for:
- Learning reference
