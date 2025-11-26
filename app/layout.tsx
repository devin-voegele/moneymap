import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { Toaster } from 'sonner'
import NavigationProgress from '@/components/NavigationProgress'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://moneymap.app'),
  title: {
    default: 'MoneyMap - Simple Budget Tracker for Students & Young Adults',
    template: '%s | MoneyMap'
  },
  description: 'Track your budget, manage subscriptions, and reach savings goals. Built for students, apprentices & young workers aged 15-30. AI-powered financial coach included. Start free!',
  keywords: [
    'budget tracker',
    'money management app',
    'subscription tracker',
    'savings goals',
    'student budget app',
    'personal finance for students',
    'budget planner',
    'expense tracker',
    'financial planning for young adults',
    'AI financial coach',
    'free budget app',
    'money management for students'
  ],
  authors: [{ name: 'MoneyMap' }],
  creator: 'MoneyMap',
  publisher: 'MoneyMap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://moneymap.app',
    title: 'MoneyMap - Simple Budget Tracker for Students & Young Adults',
    description: 'Track your budget, manage subscriptions, and reach savings goals. Built for students, apprentices & young workers. AI-powered financial coach included.',
    siteName: 'MoneyMap',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MoneyMap - Budget Tracker for Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyMap - Simple Budget Tracker for Students & Young Adults',
    description: 'Track your budget, manage subscriptions, and reach savings goals. Built for students, apprentices & young workers.',
    images: ['/og-image.png'],
    creator: '@moneymap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProgress />
          <Providers>{children}</Providers>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
