'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit, DollarSign, CreditCard, TrendingUp } from 'lucide-react'
import { formatCurrency, convertToMonthly } from '@/lib/utils'
import Header from '@/components/Header'
import { toast } from 'sonner'

type Income = {
  id: string
  name: string
  amount: number
  frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
}

type FixedCost = {
  id: string
  name: string
  amount: number
  category: string
  frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
}

const CATEGORIES = [
  'Rent',
  'Food',
  'Transport',
  'Phone',
  'Insurance',
  'Utilities',
  'Other'
]

export default function BudgetPage() {
  const router = useRouter()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Income dialog state
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)
  const [incomeName, setIncomeName] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeFrequency, setIncomeFrequency] = useState<'MONTHLY' | 'WEEKLY' | 'YEARLY'>('MONTHLY')
  
  // Fixed cost dialog state
  const [isFixedCostDialogOpen, setIsFixedCostDialogOpen] = useState(false)
  const [fixedCostName, setFixedCostName] = useState('')
  const [fixedCostAmount, setFixedCostAmount] = useState('')
  const [fixedCostCategory, setFixedCostCategory] = useState('Rent')
  const [fixedCostFrequency, setFixedCostFrequency] = useState<'MONTHLY' | 'WEEKLY' | 'YEARLY'>('MONTHLY')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [incomesRes, fixedCostsRes] = await Promise.all([
        fetch('/api/income'),
        fetch('/api/fixed-costs')
      ])

      if (incomesRes.ok) {
        const incomesData = await incomesRes.json()
        setIncomes(incomesData)
      }

      if (fixedCostsRes.ok) {
        const fixedCostsData = await fixedCostsRes.json()
        setFixedCosts(fixedCostsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddIncome = async () => {
    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: incomeName,
          amount: parseFloat(incomeAmount),
          frequency: incomeFrequency,
        })
      })

      if (res.ok) {
        await fetchData()
        setIsIncomeDialogOpen(false)
        setIncomeName('')
        setIncomeAmount('')
        setIncomeFrequency('MONTHLY')
      }
    } catch (error) {
      console.error('Error adding income:', error)
    }
  }

  const handleDeleteIncome = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income source?')) return

    try {
      const res = await fetch(`/api/income?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting income:', error)
    }
  }

  const handleAddFixedCost = async () => {
    try {
      const res = await fetch('/api/fixed-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fixedCostName,
          amount: parseFloat(fixedCostAmount),
          category: fixedCostCategory,
          frequency: fixedCostFrequency,
        })
      })

      if (res.ok) {
        await fetchData()
        setIsFixedCostDialogOpen(false)
        setFixedCostName('')
        setFixedCostAmount('')
        setFixedCostCategory('Rent')
        setFixedCostFrequency('MONTHLY')
      }
    } catch (error) {
      console.error('Error adding fixed cost:', error)
    }
  }

  const handleDeleteFixedCost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixed cost?')) return

    try {
      const res = await fetch(`/api/fixed-costs?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting fixed cost:', error)
    }
  }

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + convertToMonthly(income.amount, income.frequency), 0)
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + convertToMonthly(cost.amount, cost.frequency), 0)
  const freeMoney = totalIncome - totalFixedCosts

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Budget</h1>
          <p className="text-slate-400">Manage your income and fixed costs</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Fixed Costs</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalFixedCosts)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Free Money</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${freeMoney >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(freeMoney)}
              </div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income & Fixed Costs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Budget Summary</CardTitle>
                <CardDescription className="text-slate-400">
                  Your monthly financial overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Total Income</span>
                  <span className="text-green-500 font-semibold">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Fixed Costs</span>
                  <span className="text-orange-500 font-semibold">-{formatCurrency(totalFixedCosts)}</span>
                </div>
                <div className="h-px bg-slate-700"></div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-white font-medium">Available</span>
                  <span className={`font-bold text-lg ${freeMoney >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(freeMoney)}
                  </span>
                </div>
                
                {freeMoney > 0 && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      <span className="font-semibold">Tip:</span> You have {formatCurrency(freeMoney)} available each month. Consider setting up a savings goal!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income & Fixed Costs Tab */}
          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Section */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Income Sources</CardTitle>
                      <CardDescription className="text-slate-400">
                        {incomes.length} source{incomes.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Income
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Add Income Source</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Add a new source of income
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="income-name" className="text-white">Name</Label>
                            <Input
                              id="income-name"
                              placeholder="e.g., Monthly Salary"
                              value={incomeName}
                              onChange={(e) => setIncomeName(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="income-amount" className="text-white">Amount</Label>
                            <Input
                              id="income-amount"
                              type="number"
                              placeholder="0.00"
                              value={incomeAmount}
                              onChange={(e) => setIncomeAmount(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="income-frequency" className="text-white">Frequency</Label>
                            <Select value={incomeFrequency} onValueChange={(value: any) => setIncomeFrequency(value)}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddIncome} className="w-full">
                            Add Income
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incomes.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">
                      No income sources yet. Add one to get started!
                    </p>
                  ) : (
                    incomes.map((income) => (
                      <div key={income.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{income.name}</p>
                          <p className="text-sm text-slate-400">
                            {formatCurrency(income.amount)} / {income.frequency.toLowerCase()}
                            {income.frequency !== 'MONTHLY' && (
                              <span className="text-slate-500"> (≈ {formatCurrency(convertToMonthly(income.amount, income.frequency))}/mo)</span>
                            )}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIncome(income.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Fixed Costs Section */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Fixed Costs</CardTitle>
                      <CardDescription className="text-slate-400">
                        {fixedCosts.length} cost{fixedCosts.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Dialog open={isFixedCostDialogOpen} onOpenChange={setIsFixedCostDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Cost
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Add Fixed Cost</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Add a new fixed expense
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cost-category" className="text-white">Category</Label>
                            <Select value={fixedCostCategory} onValueChange={setFixedCostCategory}>
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
                            <Label htmlFor="cost-name" className="text-white">Description</Label>
                            <Input
                              id="cost-name"
                              placeholder="e.g., Apartment Rent"
                              value={fixedCostName}
                              onChange={(e) => setFixedCostName(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cost-amount" className="text-white">Amount</Label>
                            <Input
                              id="cost-amount"
                              type="number"
                              placeholder="0.00"
                              value={fixedCostAmount}
                              onChange={(e) => setFixedCostAmount(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cost-frequency" className="text-white">Frequency</Label>
                            <Select value={fixedCostFrequency} onValueChange={(value: any) => setFixedCostFrequency(value)}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddFixedCost} className="w-full">
                            Add Fixed Cost
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fixedCosts.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">
                      No fixed costs yet. Add your expenses!
                    </p>
                  ) : (
                    fixedCosts.map((cost) => (
                      <div key={cost.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{cost.name}</p>
                          <p className="text-sm text-slate-400">
                            {cost.category} • {formatCurrency(cost.amount)} / {cost.frequency.toLowerCase()}
                            {cost.frequency !== 'MONTHLY' && (
                              <span className="text-slate-500"> (≈ {formatCurrency(convertToMonthly(cost.amount, cost.frequency))}/mo)</span>
                            )}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFixedCost(cost.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
