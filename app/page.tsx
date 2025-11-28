'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, PieChart, TrendingUp, Target, Sparkles, Zap, CreditCard, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MoneyMap",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "name": "Free Plan"
      },
      {
        "@type": "Offer",
        "price": "2.99",
        "priceCurrency": "EUR",
        "name": "Pro Plan - Monthly",
        "priceValidUntil": "2025-12-31"
      },
      {
        "@type": "Offer",
        "price": "19",
        "priceCurrency": "EUR",
        "name": "Pro Plan - Yearly",
        "priceValidUntil": "2025-12-31"
      }
    ],
    "description": "Track your budget, manage subscriptions, and reach savings goals. Built for students, apprentices & young workers aged 15-30.",
    "screenshot": "https://moneymap.app/screenshot.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "Budget tracking",
      "Subscription management",
      "Savings goals",
      "AI financial coach",
      "Expense tracking",
      "Financial insights"
    ]
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MoneyMap",
    "url": "https://moneymap.app",
    "logo": "https://moneymap.app/logo.png",
    "sameAs": [
      "https://twitter.com/moneymap",
      "https://facebook.com/moneymap",
      "https://instagram.com/moneymap"
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <PieChart className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            <span className="text-xl md:text-2xl font-bold text-white">MoneyMap</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-white">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/80 z-[9999]"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-950 overflow-y-auto shadow-2xl"
            >
              {/* Close button */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800">
                <span className="text-white font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white p-2 hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="px-4 py-6 space-y-4">
                <Link href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full text-white justify-start text-lg h-14">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full text-lg h-14">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
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
              className="text-base sm:text-lg md:text-xl text-slate-300 mb-8"
            >
              See exactly where your money goes and how to reach your goals – without spreadsheets or finance jargon.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col gap-3"
            >
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full group">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs text-slate-500 text-center sm:text-left">
                No credit card required • €2.99/mo for Pro
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-12 md:mt-0"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-slate-700 shadow-2xl"
            >
              <div className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm sm:text-base text-slate-400">Monthly Income</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                    className="text-xl sm:text-2xl font-bold text-green-400"
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
                  <span className="text-sm sm:text-base text-slate-400">Fixed Costs</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                    className="text-xl sm:text-2xl font-bold text-orange-400"
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
                  <span className="text-sm sm:text-base text-slate-400">Subscriptions</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0, type: "spring" }}
                    className="text-xl sm:text-2xl font-bold text-red-400"
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
                  <span className="text-sm sm:text-base text-slate-400 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    Free Money
                  </span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
                    className="text-2xl sm:text-3xl font-bold text-blue-400"
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

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "€2.5M", label: "Money Tracked" },
            { number: "15K+", label: "Goals Reached" },
            { number: "4.8★", label: "User Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why MoneyMap Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why MoneyMap?
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Built for students, apprentices & young workers who want clarity without complexity
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: PieChart,
              title: "Finally see where money goes",
              description: "Get instant clarity on your income, fixed costs, and what's left to spend or save.",
              delay: 0.1,
              color: "blue"
            },
            {
              icon: CreditCard,
              title: "Keep subs under control",
              description: "Track all your subscriptions and see their yearly cost. Cancel what you don't need.",
              delay: 0.2,
              color: "purple"
            },
            {
              icon: Target,
              title: "Hit your goals faster",
              description: "Set savings goals and see exactly how much to save each month to reach them.",
              delay: 0.3,
              color: "green"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="bg-slate-900/50 border-slate-700 h-full hover:border-slate-600 transition-all">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`h-12 w-12 text-${feature.color}-500 mb-4`} />
                  </motion.div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-slate-900/30 rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Everything you need
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Simple tools that actually help you manage money
          </p>
        </motion.div>
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

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Loved by students & young adults
          </h2>
          <p className="text-slate-400 text-center mb-12">
            See what our users are saying
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              role: "University Student",
              text: "Finally understand where my money goes! Saved €200 in the first month by canceling unused subscriptions.",
              rating: 5
            },
            {
              name: "Tom K.",
              role: "Apprentice",
              text: "The AI coach is amazing. It's like having a financial advisor who actually speaks my language.",
              rating: 5
            },
            {
              name: "Lisa R.",
              role: "First Job",
              text: "Hit my first savings goal in 3 months! MoneyMap made it so easy to track and stay motivated.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700 h-full hover:border-slate-600 transition-all">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-3">
            <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 animate-pulse">
              🔥 BLACK FRIDAY SPECIAL - 40% OFF
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-slate-400 mb-2">Designed for students, apprentices & young workers</p>
          <p className="text-center text-slate-500 text-sm mb-12">Cancel anytime. No hidden fees.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8 }}
          >
            <Card className="bg-slate-900/50 border-slate-700 h-full hover:border-slate-600 transition-all">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="border-blue-500 bg-slate-900/90 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 -z-10"></div>
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            <CardHeader className="bg-transparent">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  BLACK FRIDAY
                </span>
              </div>
              <CardDescription className="text-slate-300">
                For serious money management
              </CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-bold text-white">
                    €2.99
                    <span className="text-lg text-slate-400">/month</span>
                  </div>
                  <div className="text-2xl text-slate-500 line-through">
                    €4.99
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <p className="text-slate-400 text-sm">or <span className="text-white font-semibold">€19/year</span></p>
                  <p className="text-slate-500 text-sm line-through">€39/year</p>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                    SAVE 51%
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3 mt-3">
                <p className="text-orange-400 text-sm font-semibold">
                  🔥 Limited Time Offer - Black Friday Special!
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Lock in this price forever. Cancel anytime.
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
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center border border-slate-700 relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6"
            >
              Ready to take control of your money?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto"
            >
              Join thousands of students and young adults who finally understand where their money goes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/auth/sign-up">
                <Button size="lg" className="group w-full sm:w-auto">
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
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
