'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Award } from 'lucide-react'
import Header from '@/components/Header'
import UpgradeButtonClient from '@/components/UpgradeButtonClient'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#10b981', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading analytics...</div>
        </main>
      </div>
    )
  }

  const categoryData = data?.categoryBreakdown || []
  const trendData = data?.monthlyTrend || []
  const bestMonth = data?.bestMonth
  const worstMonth = data?.worstMonth

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Deep insights into your spending patterns</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(data?.totalIncome || 0)}</div>
              <p className="text-xs text-slate-400 mt-1">Monthly average</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(data?.totalExpenses || 0)}</div>
              <p className="text-xs text-slate-400 mt-1">Monthly average</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Savings Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data?.savingsRate || 0}%</div>
              <p className="text-xs text-slate-400 mt-1">Of your income</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Spending by Category</CardTitle>
              <CardDescription className="text-slate-400">Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Trend</CardTitle>
              <CardDescription className="text-slate-400">Income vs Expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Best/Worst Months */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bestMonth && (
            <Card className="bg-gradient-to-br from-green-900/20 to-slate-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  Best Savings Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{bestMonth.month}</div>
                <p className="text-slate-300 mt-2">
                  Saved <span className="font-semibold text-white">{formatCurrency(bestMonth.saved)}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Keep up the great work! 🎉</p>
              </CardContent>
            </Card>
          )}

          {worstMonth && (
            <Card className="bg-gradient-to-br from-red-900/20 to-slate-900/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  Highest Spending Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{worstMonth.month}</div>
                <p className="text-slate-300 mt-2">
                  Spent <span className="font-semibold text-white">{formatCurrency(worstMonth.spent)}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Watch out for similar patterns</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Insights */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Smart Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.insights?.map((insight: string, index: number) => (
              <div key={index} className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">💡 {insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <UpgradeButtonClient />
    </div>
  )
}
