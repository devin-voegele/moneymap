import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { convertToMonthly } from '@/lib/utils'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all user data
    const [incomes, fixedCosts, subscriptions, goals] = await Promise.all([
      prisma.income.findMany({ where: { userId: session.user.id } }),
      prisma.fixedCost.findMany({ where: { userId: session.user.id } }),
      prisma.subscription.findMany({ where: { userId: session.user.id } }),
      prisma.goal.findMany({ where: { userId: session.user.id } }),
    ])

    // Calculate totals
    const totalIncome = incomes.reduce((sum, inc) => sum + convertToMonthly(inc.amount, inc.frequency), 0)
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + convertToMonthly(cost.amount, cost.frequency), 0)
    const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + convertToMonthly(sub.amount, sub.frequency), 0)
    const totalExpenses = totalFixedCosts + totalSubscriptions
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0

    // Category breakdown
    const categoryBreakdown: { name: string; value: number }[] = []
    
    // Group fixed costs by category
    const categoryMap = new Map<string, number>()
    fixedCosts.forEach(cost => {
      const monthly = convertToMonthly(cost.amount, cost.frequency)
      categoryMap.set(cost.category, (categoryMap.get(cost.category) || 0) + monthly)
    })

    categoryMap.forEach((value, name) => {
      categoryBreakdown.push({ name, value })
    })

    // Add subscriptions as a category
    if (totalSubscriptions > 0) {
      categoryBreakdown.push({ name: 'Subscriptions', value: totalSubscriptions })
    }

    // Generate monthly trend (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const monthlyTrend = []
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      monthlyTrend.push({
        month: monthNames[monthIndex],
        income: totalIncome,
        expenses: totalExpenses,
      })
    }

    // Best and worst months (simulated for now - in real app, track historical data)
    const bestMonth = {
      month: monthNames[(currentMonth - 2 + 12) % 12],
      saved: totalIncome - totalExpenses + 200,
    }

    const worstMonth = {
      month: monthNames[(currentMonth - 4 + 12) % 12],
      spent: totalExpenses + 150,
    }

    // Generate insights
    const insights: string[] = []
    
    if (savingsRate > 20) {
      insights.push(`Great job! You're saving ${savingsRate}% of your income.`)
    } else if (savingsRate > 0) {
      insights.push(`You're saving ${savingsRate}% of your income. Try to increase this to 20% for better financial health.`)
    } else {
      insights.push(`You're spending more than you earn. Review your expenses to find areas to cut back.`)
    }

    if (totalSubscriptions > totalIncome * 0.1) {
      insights.push(`Subscriptions are ${Math.round((totalSubscriptions / totalIncome) * 100)}% of your income. Consider canceling unused ones.`)
    }

    const topCategory = categoryBreakdown.sort((a, b) => b.value - a.value)[0]
    if (topCategory) {
      insights.push(`${topCategory.name} is your biggest expense category at €${topCategory.value.toFixed(2)}/month.`)
    }

    if (goals.length > 0) {
      const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount).length
      insights.push(`You have ${activeGoals} active savings goal${activeGoals !== 1 ? 's' : ''}. Stay focused!`)
    }

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      savingsRate,
      categoryBreakdown,
      monthlyTrend,
      bestMonth,
      worstMonth,
      insights,
    })

  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
