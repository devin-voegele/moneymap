import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PieChart, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using MoneyMap, you accept and agree to be bound by the terms and provision of 
              this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
            <p>
              MoneyMap is a personal finance management tool designed to help users track income, expenses, 
              subscriptions, and savings goals. The service includes an AI-powered coach feature that provides 
              general financial guidance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Accounts</h2>
            <p>To use MoneyMap, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 15 years old (or have parental consent)</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Subscription and Payments</h2>
            <p>
              MoneyMap offers both free and paid subscription plans. By subscribing to a paid plan, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pay all fees associated with your chosen plan</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
              <li>Our refund policy: refunds within 14 days of initial purchase</li>
              <li>Price changes with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. User Data and Privacy</h2>
            <p>
              Your use of MoneyMap is also governed by our Privacy Policy. You retain ownership of all data you 
              input into the service. We use your data only as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. AI Coach Disclaimer</h2>
            <p className="font-semibold text-yellow-400">
              Important: The AI Money Coach is not a financial advisor.
            </p>
            <p>
              The AI coach provides general information and suggestions only. It does not constitute professional 
              financial advice. You should consult with a qualified financial advisor for personalized advice. 
              We are not responsible for any financial decisions you make based on AI coach suggestions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Share your account with others</li>
              <li>Reverse engineer or copy any part of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of MoneyMap are owned by us and are protected by 
              international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              MoneyMap is provided "as is" without warranties of any kind. We are not liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time for violations of these terms. 
              You may cancel your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. We will notify you of significant changes via email or 
              through the service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Governing Law</h2>
            <p>
              These terms are governed by the laws of your jurisdiction. Any disputes will be resolved in the 
              courts of your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Contact</h2>
            <p>
              For questions about these terms, contact us at:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:legal@moneymap.app" className="text-blue-400 hover:underline">legal@moneymap.app</a>
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
