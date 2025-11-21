import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check user's plan and current income count
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    const incomeCount = await prisma.income.count({
      where: { userId: session.user.id }
    })

    // Free tier limit: 1 income source
    if (profile?.plan !== 'PRO' && incomeCount >= 1) {
      return NextResponse.json({ 
        error: 'FREE_TIER_LIMIT',
        message: 'Free tier limited to 1 income source. Upgrade to Pro for unlimited income sources.',
        limit: 1,
        current: incomeCount
      }, { status: 403 })
    }

    const { name, amount, frequency } = await req.json()

    if (!name || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const income = await prisma.income.create({
      data: {
        userId: session.user.id,
        name,
        amount: parseFloat(amount),
        frequency: frequency || 'MONTHLY',
      }
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Income creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const incomes = await prisma.income.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(incomes, { status: 200 })
  } catch (error) {
    console.error('Income fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
