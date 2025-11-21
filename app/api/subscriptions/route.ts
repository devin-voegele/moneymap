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

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Subscriptions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's plan and current subscription count
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    const subscriptionCount = await prisma.subscription.count({
      where: { userId: session.user.id }
    })

    // Free tier limit: 5 subscriptions
    if (profile?.plan !== 'PRO' && subscriptionCount >= 5) {
      return NextResponse.json({ 
        error: 'FREE_TIER_LIMIT',
        message: 'Free tier limited to 5 subscriptions. Upgrade to Pro for unlimited subscriptions.',
        limit: 5,
        current: subscriptionCount
      }, { status: 403 })
    }

    const body = await req.json()
    const { name, amount, frequency, category, nextBillingDate, worthIt } = body

    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        name,
        amount: parseFloat(amount),
        frequency: frequency || 'MONTHLY',
        category,
        nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : null,
        worthIt: worthIt || 'YES',
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Subscription creation error:', error)
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

    await prisma.subscription.delete({
      where: {
        id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, amount, frequency, category, nextBillingDate, worthIt, aiSuggestion } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const subscription = await prisma.subscription.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        amount: amount ? parseFloat(amount) : undefined,
        frequency,
        category,
        nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : undefined,
        worthIt,
        aiSuggestion,
      }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
