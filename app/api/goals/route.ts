import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Goals fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's plan and current goal count
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    const goalCount = await prisma.goal.count({
      where: { userId: session.user.id }
    })

    // Free tier limit: 1 goal
    if (profile?.plan !== 'PRO' && goalCount >= 1) {
      return NextResponse.json({ 
        error: 'FREE_TIER_LIMIT',
        message: 'Free tier limited to 1 savings goal. Upgrade to Pro for unlimited goals.',
        limit: 1,
        current: goalCount
      }, { status: 403 })
    }

    const body = await req.json()
    const { name, targetAmount, currentAmount, deadline } = body

    if (!name || !targetAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : null,
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Goal creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    await prisma.goal.delete({
      where: {
        id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Goal deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, targetAmount, currentAmount, deadline } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const goal = await prisma.goal.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      }
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Goal update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
