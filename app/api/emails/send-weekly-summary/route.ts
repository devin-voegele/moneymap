import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { WeeklySummaryEmail } from '@/lib/emails/WeeklySummary'
import { convertToMonthly } from '@/lib/utils'
import { renderToString } from 'react-dom/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Fetch user with all financial data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        income: true,
        fixedCosts: true,
        subscriptions: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has email notifications enabled
    if (!user.emailNotifications || !user.weeklyEmailEnabled) {
      return NextResponse.json({ message: 'Email notifications disabled for this user' })
    }

    // Calculate financial stats
    const totalIncome = user.income.reduce(
      (sum, inc) => sum + convertToMonthly(inc.amount, inc.frequency),
      0
    )
    const totalFixedCosts = user.fixedCosts.reduce(
      (sum, cost) => sum + convertToMonthly(cost.amount, cost.frequency),
      0
    )
    const totalSubscriptions = user.subscriptions.reduce(
      (sum, sub) => sum + convertToMonthly(sub.amount, sub.frequency),
      0
    )
    const totalExpenses = totalFixedCosts + totalSubscriptions
    const freeMoney = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((freeMoney / totalIncome) * 100) : 0

    // Render email HTML
    const emailHtml = renderToString(
      WeeklySummaryEmail({
        name: user.name || 'there',
        totalIncome,
        totalExpenses,
        savingsRate,
        freeMoney,
      })
    )

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: '📊 Your Weekly MoneyMap Summary',
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      message: 'Weekly summary sent successfully' 
    })

  } catch (error: any) {
    console.error('Send weekly summary error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send weekly summary' },
      { status: 500 }
    )
  }
}
