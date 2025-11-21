'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, PieChart, TrendingUp, Target, Sparkles, Zap, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

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
      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">AI-Powered Financial Clarity</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                Understand your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                money in 5 minutes
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-slate-300 mb-8"
            >
              See exactly where your money goes and how to reach your goals – without spreadsheets or finance jargon.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col gap-1">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View demo
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  No credit card • €4.99/mo for Pro
                </p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-slate-700 shadow-2xl"
            >
              <div className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-400">Monthly Income</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                    className="text-2xl font-bold text-green-400"
                  >
                    €1,800
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-400">Fixed Costs</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                    className="text-2xl font-bold text-orange-400"
                  >
                    €1,180
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-400">Subscriptions</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0, type: "spring" }}
                    className="text-2xl font-bold text-red-400"
                  >
                    €91
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="border-t border-slate-700 pt-4 flex items-center justify-between"
                >
                  <span className="text-slate-400 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    Free Money
                  </span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-blue-400"
                  >
                    €529
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              Live Preview
            </motion.div>
          </motion.div>
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

          <Card className="border-blue-500 bg-slate-900/90 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 -z-10"></div>
            <CardHeader className="bg-transparent">
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
            <CardContent className="bg-transparent">
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
