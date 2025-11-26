import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create sample income
    await prisma.income.create({
      data: {
        userId: session.user.id,
        name: 'Monthly Salary',
        amount: 2500,
        frequency: 'MONTHLY',
      },
    })

    // Create sample fixed costs
    await prisma.fixedCost.createMany({
      data: [
        {
          userId: session.user.id,
          name: 'Rent',
          amount: 800,
          frequency: 'MONTHLY',
          category: 'HOUSING',
        },
        {
          userId: session.user.id,
          name: 'Groceries',
          amount: 300,
          frequency: 'MONTHLY',
          category: 'FOOD',
        },
        {
          userId: session.user.id,
          name: 'Transport',
          amount: 100,
          frequency: 'MONTHLY',
          category: 'TRANSPORT',
        },
      ],
    })

    // Create sample subscriptions
    await prisma.subscription.createMany({
      data: [
        {
          userId: session.user.id,
          name: 'Netflix',
          amount: 12.99,
          frequency: 'MONTHLY',
          category: 'ENTERTAINMENT',
          nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        },
        {
          userId: session.user.id,
          name: 'Spotify',
          amount: 9.99,
          frequency: 'MONTHLY',
          category: 'ENTERTAINMENT',
          nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        },
      ],
    })

    // Create sample goals
    await prisma.goal.createMany({
      data: [
        {
          userId: session.user.id,
          name: 'Emergency Fund',
          targetAmount: 5000,
          currentAmount: 1200,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
        },
        {
          userId: session.user.id,
          name: 'Summer Vacation',
          targetAmount: 2000,
          currentAmount: 500,
          deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months from now
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Sample data created successfully' })
  } catch (error: any) {
    console.error('Sample data error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create sample data' },
      { status: 500 }
    )
  }
}
