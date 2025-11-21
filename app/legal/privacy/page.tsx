import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PieChart, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">MoneyMap</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to MoneyMap. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data and tell you about 
              your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Data We Collect</h2>
            <p>We collect and process the following data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
              <li><strong>Financial Data:</strong> Income amounts, expense categories, subscription details, savings goals</li>
              <li><strong>Usage Data:</strong> How you interact with our service, features you use</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we don't store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Generate personalized insights and recommendations</li>
              <li>Process payments and subscriptions</li>
              <li>Improve our AI coach feature</li>
              <li>Send you important updates about your account</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal data. All financial data is 
              encrypted in transit and at rest. We use industry-standard security protocols and regularly update 
              our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>OpenAI:</strong> AI coach functionality (data is anonymized)</li>
              <li><strong>Supabase/PostgreSQL:</strong> Database hosting</li>
              <li><strong>Google OAuth:</strong> Optional sign-in method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to provide our services and comply with 
              legal obligations. When you delete your account, we will delete your personal data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and remember your preferences. We do not use 
              tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:privacy@moneymap.app" className="text-blue-400 hover:underline">privacy@moneymap.app</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-500 text-sm">
            © 2024 MoneyMap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
