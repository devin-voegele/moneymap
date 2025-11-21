import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, PieChart, CreditCard, Target, MessageSquare, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">MoneyMap</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-white">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Understand your money in 5 minutes
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              See exactly where your money goes and how to reach your goals – without spreadsheets or finance jargon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-slate-400 mt-2">
                No credit card needed. Upgrade anytime for €4.99.
              </p>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-slate-700">
              <div className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monthly Income</span>
                  <span className="text-2xl font-bold text-green-400">€1,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fixed Costs</span>
                  <span className="text-2xl font-bold text-orange-400">€1,180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subscriptions</span>
                  <span className="text-2xl font-bold text-red-400">€91</span>
                </div>
                <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                  <span className="text-slate-400">Free Money</span>
                  <span className="text-3xl font-bold text-blue-400">€529</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MoneyMap Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Why MoneyMap?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <PieChart className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Finally see where money goes</CardTitle>
              <CardDescription className="text-slate-400">
                Get instant clarity on your income, fixed costs, and what's left to spend or save.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Keep subs under control</CardTitle>
              <CardDescription className="text-slate-400">
                Track all your subscriptions and see their yearly cost. Cancel what you don't need.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Hit your goals faster</CardTitle>
              <CardDescription className="text-slate-400">
                Set savings goals and see exactly how much to save each month to reach them.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Budget Overview</CardTitle>
              <CardDescription className="text-slate-400">
                See your income vs expenses at a glance with beautiful charts and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Track multiple income sources
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Categorize fixed costs
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Visual breakdown of spending
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Tracker</CardTitle>
              <CardDescription className="text-slate-400">
                Never lose track of what you're paying for each month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Monthly & yearly cost view
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Mark subscriptions worth keeping
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  AI suggestions to optimize
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Savings Goals</CardTitle>
              <CardDescription className="text-slate-400">
                Save for what matters: a new phone, PC, holiday, or emergency fund.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Set target amount & date
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Track progress visually
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Get monthly savings plan
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Money Coach</CardTitle>
              <CardDescription className="text-slate-400">
                Ask questions about your budget and get personalized advice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  "Can I afford this subscription?"
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  "How to reach my goal faster?"
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Simple, friendly advice
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-slate-400 mb-2">Designed for students, apprentices & young workers</p>
        <p className="text-center text-slate-500 text-sm mb-12">Cancel anytime. No hidden fees.</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free</CardTitle>
              <CardDescription className="text-slate-400">
                Perfect to get started
              </CardDescription>
              <div className="text-4xl font-bold text-white mt-4">€0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  1 income source
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  1 savings goal
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Up to 5 subscriptions
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  10 AI coach questions/month
                </li>
              </ul>
              <Link href="/auth/sign-up">
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Pro</CardTitle>
              <CardDescription className="text-slate-300">
                For serious money management
              </CardDescription>
              <div className="text-4xl font-bold text-white mt-4">
                €4.99
                <span className="text-lg text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">or €39/year (save 35%)</p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-3">
                <p className="text-green-400 text-sm">
                  💡 If MoneyMap helps you cancel just one €5–10/month subscription, it's already paid for itself.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited income sources
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited savings goals
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited subscriptions
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited AI coach queries
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  What-if simulator
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Smart suggestions
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Monthly summary email
                </li>
              </ul>
              <Link href="/auth/sign-up">
                <Button className="w-full mt-6">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 text-center border border-slate-700">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to take control of your money?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students and young adults who finally understand where their money goes.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <PieChart className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">MoneyMap</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="/legal/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white transition">Terms</Link>
              <Link href="mailto:contact@moneymap.app" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm mt-4">
            © 2024 MoneyMap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
