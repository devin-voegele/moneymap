'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Search, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency, convertToMonthly } from '@/lib/utils'
import UpgradeModal from '@/components/UpgradeModal'
import Header from '@/components/Header'

type Subscription = {
  id: string
  name: string
  amount: number
  frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
  category: string | null
  nextBillingDate: string | null
  worthIt: 'YES' | 'MAYBE' | 'NO' | null
  aiSuggestion: string | null
}

const CATEGORIES = ['Entertainment', 'Gaming', 'Cloud Storage', 'Music', 'Fitness', 'Software', 'Other']

const WORTH_IT_OPTIONS = [
  { value: 'YES', label: 'Yes', color: 'text-green-500' },
  { value: 'MAYBE', label: 'Maybe', color: 'text-yellow-500' },
  { value: 'NO', label: 'No', color: 'text-red-500' },
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [subName, setSubName] = useState('')
  const [subAmount, setSubAmount] = useState('')
  const [subFrequency, setSubFrequency] = useState<'MONTHLY' | 'WEEKLY' | 'YEARLY'>('MONTHLY')
  const [subCategory, setSubCategory] = useState('Entertainment')
  const [subNextBilling, setSubNextBilling] = useState('')
  const [subWorthIt, setSubWorthIt] = useState<'YES' | 'MAYBE' | 'NO'>('YES')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions')
      if (res.ok) {
        const data = await res.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subName,
          amount: parseFloat(subAmount),
          frequency: subFrequency,
          category: subCategory,
          nextBillingDate: subNextBilling || null,
          worthIt: subWorthIt,
        })
      })

      if (res.status === 403) {
        // Hit free tier limit
        const data = await res.json()
        if (data.error === 'FREE_TIER_LIMIT') {
          setIsDialogOpen(false)
          setShowUpgradeModal(true)
          return
        }
      }

      if (res.ok) {
        await fetchSubscriptions()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error adding subscription:', error)
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    try {
      const res = await fetch(`/api/subscriptions?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  const handleUpdateWorthIt = async (id: string, worthIt: 'YES' | 'MAYBE' | 'NO') => {
    try {
      const sub = subscriptions.find(s => s.id === id)
      if (!sub) return

      const res = await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          worthIt,
        })
      })

      if (res.ok) {
        await fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  const resetForm = () => {
    setSubName('')
    setSubAmount('')
    setSubFrequency('MONTHLY')
    setSubCategory('Entertainment')
    setSubNextBilling('')
    setSubWorthIt('YES')
  }

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Calculate totals
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + convertToMonthly(sub.amount, sub.frequency), 0)
  const totalYearly = totalMonthly * 12
  const largestSub = subscriptions.length > 0 
    ? subscriptions.reduce((max, sub) => {
        const monthly = convertToMonthly(sub.amount, sub.frequency)
        const maxMonthly = convertToMonthly(max.amount, max.frequency)
        return monthly > maxMonthly ? sub : max
      })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-slate-400">Track what you pay every month and year</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalMonthly)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Yearly Cost</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalYearly)}</div>
              <p className="text-xs text-slate-500">per year</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Subs</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{subscriptions.length}</div>
              <p className="text-xs text-slate-500">subscriptions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Largest Sub</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {largestSub ? formatCurrency(convertToMonthly(largestSub.amount, largestSub.frequency)) : '€0'}
              </div>
              <p className="text-xs text-slate-500 truncate">{largestSub?.name || 'None'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Subscription</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Track a new subscription
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-name" className="text-white">Name</Label>
                  <Input
                    id="sub-name"
                    placeholder="e.g., Netflix, Spotify"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub-amount" className="text-white">Amount</Label>
                    <Input
                      id="sub-amount"
                      type="number"
                      placeholder="0.00"
                      value={subAmount}
                      onChange={(e) => setSubAmount(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub-frequency" className="text-white">Frequency</Label>
                    <Select value={subFrequency} onValueChange={(value: any) => setSubFrequency(value)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-category" className="text-white">Category</Label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-billing" className="text-white">Next Billing Date (Optional)</Label>
                  <Input
                    id="sub-billing"
                    type="date"
                    value={subNextBilling}
                    onChange={(e) => setSubNextBilling(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-worth" className="text-white">Worth It?</Label>
                  <Select value={subWorthIt} onValueChange={(value: any) => setSubWorthIt(value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORTH_IT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSubscription} className="w-full">
                  Add Subscription
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="py-12">
                <p className="text-slate-400 text-center">
                  {searchQuery || categoryFilter !== 'all' 
                    ? 'No subscriptions match your filters'
                    : 'No subscriptions yet. Add one to get started!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubscriptions.map((sub) => (
              <Card key={sub.id} className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{sub.name}</h3>
                        {sub.category && (
                          <span className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded">
                            {sub.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="text-lg font-semibold text-white">
                          {formatCurrency(sub.amount)} / {sub.frequency.toLowerCase()}
                        </span>
                        {sub.frequency !== 'MONTHLY' && (
                          <span className="text-slate-500">
                            ≈ {formatCurrency(convertToMonthly(sub.amount, sub.frequency))}/month
                          </span>
                        )}
                        <span className="text-slate-500">
                          • {formatCurrency(convertToMonthly(sub.amount, sub.frequency) * 12)}/year
                        </span>
                      </div>
                      {sub.nextBillingDate && (
                        <p className="text-sm text-slate-400">
                          Next billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-slate-400">Worth it?</span>
                        {WORTH_IT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleUpdateWorthIt(sub.id, opt.value as any)}
                            className={`px-3 py-1 text-sm rounded transition ${
                              sub.worthIt === opt.value
                                ? `${opt.color} bg-slate-800 font-medium`
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubscription(sub.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Insights */}
        {subscriptions.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 Your subscriptions cost {formatCurrency(totalYearly)} per year. That's {((totalMonthly / 1000) * 100).toFixed(1)}% of a €1000 monthly income.
                </p>
              </div>
              {subscriptions.filter(s => s.worthIt === 'NO').length > 0 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    ⚠️ You marked {subscriptions.filter(s => s.worthIt === 'NO').length} subscription(s) as "Not worth it". 
                    Canceling them could save you {formatCurrency(
                      subscriptions
                        .filter(s => s.worthIt === 'NO')
                        .reduce((sum, s) => sum + convertToMonthly(s.amount, s.frequency) * 12, 0)
                    )} per year!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="subscription"
        message="You've reached the Free tier limit of 5 subscriptions. Upgrade to Pro to track unlimited subscriptions and discover hidden costs."
      />
    </div>
  )
}
