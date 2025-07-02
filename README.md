# Classly - Student Management System

An AI-powered classroom management and student tracking system built with Next.js, Supabase, and OpenAI.

## Features

- Student management with profiles and grouping
- AI-powered insights and predictions
- Mood tracking and engagement scoring
- Assignment management
- Real-time collaboration
- Beautiful, responsive UI with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account and project
- An OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.local` and fill in your credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Set up your Supabase database:
   - Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor
   - Or use the built-in database setup at `/setup`

5. Run the development server:
   ```bash
   pnpm dev
   ```

### Database Setup

The application requires several database tables. You can set them up in two ways:

1. **Automated Setup**: Visit `/setup` in your browser and use the automated database setup tool
2. **Manual Setup**: Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `001-create-tables.sql` - Creates the basic tables
   - `002-seed-data.sql` - Adds sample data
   - `003-fix-foreign-key.sql` - Fixes foreign key constraints
   - `004-ai-features-schema.sql` - Adds AI-related columns and tables

### AI Features Setup

To enable AI features, visit `/api-setup` and configure your OpenAI API key.

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm
