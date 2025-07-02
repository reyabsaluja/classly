<div align="center">
  <h1>🎓 Classly</h1>
  <p>AI-Powered Classroom Management & Student Tracking System</p>
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/classly)
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-green)](https://supabase.com/)
  [![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-blue)](https://ai.google.dev/)

  <br />

  https://github.com/user-attachments/assets/f23ca431-3d68-4f81-8c58-99c68e2714c3
  
</div>

---

## ✨ Features

### 🎯 **Core Functionality**
- **Student Management** - Comprehensive student profiles with grades, notes, and tags
- **Group Management** - Create and organize student groups with drag-and-drop
- **Assignment Tracking** - Track assignments, submissions, and performance
- **Real-time Updates** - Live collaboration with instant data synchronization

### 🤖 **AI-Powered Insights**
- **Grade Predictions** - AI-powered academic performance forecasting
- **Risk Assessment** - Early intervention alerts for at-risk students
- **Group Optimization** - Smart group suggestions based on learning styles
- **Parent Communications** - AI-generated personalized parent updates
- **Learning Analytics** - Deep insights into student engagement and progress

### 🎨 **User Experience**
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Dark/Light Mode** - Customizable theme preferences
- **Accessibility** - WCAG compliant with keyboard navigation
- **Drag & Drop** - Intuitive student and group management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Supabase Account** ([Sign up free](https://supabase.com))
- **Google AI Studio API Key** ([Get one free](https://aistudio.google.com/app/apikey))

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/classly)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/classly.git
   cd classly
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
   ```

4. **Set up the database**
   - Visit `/setup` in your browser for automated setup
   - Or manually run SQL scripts from the `scripts/` folder

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Configure AI features**
   - Visit `/api-setup` to set up Google Gemini integration

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 with App Router |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **AI/ML** | Google Gemini 2.0 Flash |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + shadcn/ui |
| **State Management** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel (recommended) |

</div>

---

## 📋 Database Setup

### Automated Setup (Recommended)
1. Navigate to `/setup` in your browser
2. Click "Run Database Setup"
3. Wait for completion confirmation

### Manual Setup
Run these SQL scripts in your Supabase SQL editor:

```sql
-- 1. Basic tables
\i scripts/001-create-tables.sql

-- 2. Sample data
\i scripts/002-seed-data.sql

-- 3. Foreign key fixes
\i scripts/003-fix-foreign-key.sql

-- 4. AI features
\i scripts/004-ai-features-schema.sql
```

---

## 🤖 AI Configuration

Classly uses Google Gemini for AI features. To enable:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add it to your environment variables
3. Visit `/api-setup` to verify configuration

### AI Features Include:
- 📊 **Grade Predictions** - Forecast student performance
- ⚠️ **Risk Alerts** - Early intervention recommendations  
- 👥 **Smart Grouping** - Optimize group compositions
- 📧 **Parent Communications** - Generate personalized updates
- 📈 **Learning Insights** - Comprehensive analytics

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Click the deploy button above, or:
2. Import your repo to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

See our comprehensive [Deployment Guide](./DEPLOYMENT.md) for:
- Netlify
- Railway  
- Self-hosting
- Docker deployment

---

## 🎯 Usage Examples

### Student Management
```typescript
// Add a new student
const student = {
  name: "John Doe",
  email: "john@example.com", 
  grade: 85,
  notes: "Excellent participation",
  tags: ["math", "science"]
}
```

### AI-Powered Insights
```typescript
// Get grade predictions
const predictions = await aiTeachingAssistant.predictGrades(students)

// Generate parent communication
const communication = await aiTeachingAssistant.generateParentCommunication(
  student, 
  "positive"
)
```

---

## 🔒 Security & Privacy

- 🔐 **Data Encryption** - All data encrypted at rest and in transit
- 🛡️ **Row Level Security** - Supabase RLS policies protect user data
- 🔑 **API Key Security** - Environment variables for sensitive data
- 🚫 **No Data Sharing** - Your data stays in your Supabase instance
- ✅ **GDPR Compliant** - Built with privacy by design

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Google Gemini](https://ai.google.dev/) - Advanced AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

<div align="center">
  <p>Made with ❤️ for educators everywhere</p>
  <p>
    <a href="https://github.com/yourusername/classly/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/classly/issues">Request Feature</a> •
    <a href="https://github.com/yourusername/classly/discussions">Discussions</a>
  </p>
</div>
