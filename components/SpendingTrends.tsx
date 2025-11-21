'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SpendingTrendsProps {
  totalIncome: number
  totalFixedCosts: number
  totalSubscriptions: number
  freeMoney: number
}

export default function SpendingTrends({ totalIncome, totalFixedCosts, totalSubscriptions, freeMoney }: SpendingTrendsProps) {
  const fixedCostsPercentage = totalIncome > 0 ? (totalFixedCosts / totalIncome) * 100 : 0
  const subscriptionsPercentage = totalIncome > 0 ? (totalSubscriptions / totalIncome) * 100 : 0
  const freeMoneyPercentage = totalIncome > 0 ? (freeMoney / totalIncome) * 100 : 0

  const categories = [
    {
      name: 'Fixed Costs',
      amount: totalFixedCosts,
      percentage: fixedCostsPercentage,
      color: 'bg-orange-500',
      textColor: 'text-orange-400'
    },
    {
      name: 'Subscriptions',
      amount: totalSubscriptions,
      percentage: subscriptionsPercentage,
      color: 'bg-red-500',
      textColor: 'text-red-400'
    },
    {
      name: 'Available',
      amount: freeMoney,
      percentage: freeMoneyPercentage,
      color: 'bg-green-500',
      textColor: 'text-green-400'
    }
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Spending Breakdown
        </CardTitle>
        <CardDescription className="text-slate-400">
          Where your money goes each month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{category.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${category.textColor}`}>
                  {category.percentage.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-400">
                  {formatCurrency(category.amount)}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`${category.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(category.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}

        {/* Health Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          {freeMoney > totalIncome * 0.2 ? (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-400 text-sm font-semibold">Healthy Budget!</p>
                <p className="text-green-400/80 text-xs mt-1">
                  You're saving over 20% of your income. Keep it up!
                </p>
              </div>
            </div>
          ) : freeMoney > 0 ? (
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-400 text-sm font-semibold">Room for Improvement</p>
                <p className="text-blue-400/80 text-xs mt-1">
                  Try to save at least 20% of your income for financial security.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-semibold">Budget Alert</p>
                <p className="text-red-400/80 text-xs mt-1">
                  You're spending more than you earn. Review your expenses urgently.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
