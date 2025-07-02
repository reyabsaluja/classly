import type { Metadata, Viewport } from 'next'
import ErrorBoundary from '@/components/error-boundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'Classly - Student Management System',
  description: 'AI-powered classroom management and student tracking system',
  keywords: ['education', 'classroom management', 'student tracking', 'AI', 'teaching'],
  authors: [{ name: 'Classly Team' }],
  creator: 'Classly',
  publisher: 'Classly',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://classly.app',
    title: 'Classly - Student Management System',
    description: 'AI-powered classroom management and student tracking system',
    siteName: 'Classly',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Classly - Student Management System',
    description: 'AI-powered classroom management and student tracking system',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
