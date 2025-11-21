'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PieChart, LogOut, Settings, Check, Zap, Loader2 } from 'lucide-react'

export default function BillingSettingsPage() {
  const [currentPlan, setCurrentPlan] = useState<'FREE' | 'PRO'>('FREE')
  const [isLoading, setIsLoading] = useState(false)
  const [periodEnd, setPeriodEnd] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setCurrentPlan(data.plan || 'FREE')
        if (data.stripeCurrentPeriodEnd) {
          setPeriodEnd(new Date(data.stripeCurrentPeriodEnd).toLocaleDateString())
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST'
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening portal:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Get price IDs from environment
  const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
  const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <PieChart className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">MoneyMap</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
              <Link href="/budget" className="text-slate-400 hover:text-white transition">Budget</Link>
              <Link href="/subscriptions" className="text-slate-400 hover:text-white transition">Subscriptions</Link>
              <Link href="/goals" className="text-slate-400 hover:text-white transition">Goals</Link>
              <Link href="/coach" className="text-slate-400 hover:text-white transition">Coach</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings/profile">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="billing" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="profile">
              <Link href="/settings/profile">Profile</Link>
            </TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Current Plan</CardTitle>
                <CardDescription className="text-slate-400">
                  You are currently on the {currentPlan} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium text-lg">
                      {currentPlan === 'FREE' ? 'Free Plan' : 'MoneyMap Pro'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {currentPlan === 'FREE' 
                        ? 'Basic features with limitations' 
                        : '€4.99/month - All features unlocked'}
                    </p>
                  </div>
                  {currentPlan === 'FREE' ? (
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                      Current
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                      Active
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Section */}
            {currentPlan === 'FREE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Free</CardTitle>
                    <div className="text-3xl font-bold text-white">€0</div>
                    <CardDescription className="text-slate-400">Forever free</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-center text-slate-300">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        1 income source
                      </li>
                      <li className="flex items-center text-slate-300">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        1 savings goal
                      </li>
                      <li className="flex items-center text-slate-300">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Up to 5 subscriptions
                      </li>
                      <li className="flex items-center text-slate-300">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        10 AI coach questions/month
                      </li>
                    </ul>
                    <Button variant="outline" disabled className="w-full">
                      Current Plan
                    </Button>
                  </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-gradient-to-b from-blue-900/20 to-slate-900/50 border-blue-500/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                    POPULAR
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      MoneyMap Pro
                    </CardTitle>
                    <div className="text-3xl font-bold text-white">
                      €4.99
                      <span className="text-lg text-slate-400 font-normal">/month</span>
                    </div>
                    <CardDescription className="text-slate-400">
                      or €39/year (save 34%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        <strong>Unlimited</strong>&nbsp;income sources
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        <strong>Unlimited</strong>&nbsp;savings goals
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        <strong>Unlimited</strong>&nbsp;subscriptions
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        <strong>Unlimited</strong>&nbsp;AI coach questions
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        Advanced insights & projections
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-blue-400 mr-2" />
                        Priority support
                      </li>
                    </ul>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        className="w-full" 
                        onClick={() => handleUpgrade(MONTHLY_PRICE_ID)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Monthly €4.99'
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={() => handleUpgrade(YEARLY_PRICE_ID)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Yearly €39'
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-2">
                      Secure payment powered by Stripe
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pro Plan Management */}
            {currentPlan === 'PRO' && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Manage Subscription</CardTitle>
                  <CardDescription className="text-slate-400">
                    Update payment method or cancel subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Next billing date</span>
                      <span className="text-white">December 21, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Amount</span>
                      <span className="text-white">€4.99</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
                    ) : (
                      'Manage Subscription in Stripe'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Next Billing */}
            {currentPlan === 'PRO' && periodEnd && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Your Pro subscription is active. Next billing date: {periodEnd}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
