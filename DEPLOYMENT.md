# Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/classly)

## Manual Deployment Steps

### 1. Environment Variables

Set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `001-create-tables.sql`
   - `002-seed-data.sql`
   - `003-fix-foreign-key.sql`
   - `004-ai-features-schema.sql`

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_GENERATIVE_AI_API_KEY

# Redeploy with environment variables
vercel --prod
```

### 5. Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Set environment variables in Netlify dashboard

### 6. Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Supabase database set up
- [ ] Google Gemini API key added
- [ ] Build passes (`npm run build`)
- [ ] Error boundaries tested
- [ ] Security headers configured
- [ ] Analytics (optional)
- [ ] Custom domain (optional)

## Performance Optimization

The app is optimized for production with:

- ✅ Next.js App Router for optimal performance
- ✅ Static generation where possible
- ✅ Image optimization
- ✅ Bundle analysis available (`npm run build:analyze`)
- ✅ Compressed responses
- ✅ Security headers
- ✅ Error boundaries

## Monitoring

Consider adding these monitoring services:

- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for user session recording
