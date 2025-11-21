import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, DollarSign, CreditCard, Target, LogOut, TrendingUp, Settings } from 'lucide-react'
import { formatCurrency, convertToMonthly, getGoalProgress, getGoalStatus } from '@/lib/utils'
import BudgetChart from '@/components/BudgetChart'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch all data
  const [incomes, fixedCosts, subscriptions, goals] = await Promise.all([
    prisma.income.findMany({ where: { userId: session.user.id } }),
    prisma.fixedCost.findMany({ where: { userId: session.user.id } }),
    prisma.subscription.findMany({ where: { userId: session.user.id } }),
    prisma.goal.findMany({ where: { userId: session.user.id }, take: 3, orderBy: { createdAt: 'desc' } }),
  ])

  // Calculate totals
  const totalIncome = incomes.reduce((sum, inc) => sum + convertToMonthly(inc.amount, inc.frequency), 0)
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + convertToMonthly(cost.amount, cost.frequency), 0)
  const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + convertToMonthly(sub.amount, sub.frequency), 0)
  const freeMoney = totalIncome - totalFixedCosts - totalSubscriptions

  // Prepare chart data
  const chartData = [
    { name: 'Fixed Costs', value: totalFixedCosts, color: '#F97316' },
    { name: 'Subscriptions', value: totalSubscriptions, color: '#DC2626' },
    { name: 'Free Money', value: Math.max(0, freeMoney), color: '#2563EB' },
  ].filter(item => item.value > 0)

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
              <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Your financial overview at a glance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Fixed Costs
              </CardTitle>
              <CreditCard className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalFixedCosts)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalSubscriptions)}</div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Free Money
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${freeMoney >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(freeMoney)}
              </div>
              <p className="text-xs text-slate-500">per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Breakdown Chart */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Budget Breakdown</CardTitle>
              <CardDescription className="text-slate-400">
                Where your money goes each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <BudgetChart data={chartData} totalIncome={totalIncome} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <p>Add income and expenses to see your budget breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals Overview */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Savings Goals</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your progress toward your goals
                  </CardDescription>
                </div>
                <Link href="/goals">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">No goals yet</p>
                  <Link href="/goals">
                    <Button size="sm">Create Your First Goal</Button>
                  </Link>
                </div>
              ) : (
                goals.map((goal) => {
                  const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
                  const status = getGoalStatus(goal.currentAmount, goal.targetAmount, goal.deadline)
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{goal.name}</h4>
                          <p className="text-sm text-slate-400">
                            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          status === 'on-track' ? 'bg-blue-500/20 text-blue-400' :
                          status === 'at-risk' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {status === 'completed' ? 'Complete' :
                           status === 'on-track' ? 'On Track' :
                           status === 'at-risk' ? 'At Risk' :
                           'Off Track'}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-slate-500">{progress}% complete</p>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Manage your finances
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/budget" className="block">
              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-white font-medium mb-1">Manage Budget</h3>
                <p className="text-sm text-slate-400">Add income & costs</p>
              </div>
            </Link>
            <Link href="/subscriptions" className="block">
              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                <CreditCard className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="text-white font-medium mb-1">Subscriptions</h3>
                <p className="text-sm text-slate-400">Track your subs</p>
              </div>
            </Link>
            <Link href="/goals" className="block">
              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                <Target className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-white font-medium mb-1">Goals</h3>
                <p className="text-sm text-slate-400">Set & track goals</p>
              </div>
            </Link>
            <Link href="/coach" className="block">
              <div className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-white font-medium mb-1">AI Coach</h3>
                <p className="text-sm text-slate-400">Get advice</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Insights */}
        {totalIncome > 0 && (
          <Card className="bg-slate-900/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {totalSubscriptions > totalIncome * 0.15 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Your subscriptions ({formatCurrency(totalSubscriptions)}) are {((totalSubscriptions / totalIncome) * 100).toFixed(1)}% of your income. Consider reviewing them!
                  </p>
                </div>
              )}
              {freeMoney > 0 && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    💡 You have {formatCurrency(freeMoney)} available each month. That's {formatCurrency(freeMoney * 12)} per year you could save!
                  </p>
                </div>
              )}
              {freeMoney < 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">
                    🚨 You're spending {formatCurrency(Math.abs(freeMoney))} more than you earn each month. Review your expenses!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
