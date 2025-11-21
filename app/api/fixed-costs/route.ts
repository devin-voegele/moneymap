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

    const fixedCosts = await prisma.fixedCost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(fixedCosts)
  } catch (error) {
    console.error('Fixed costs fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, amount, category, frequency } = await req.json()

    if (!name || !amount || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fixedCost = await prisma.fixedCost.create({
      data: {
        userId: session.user.id,
        name,
        amount: parseFloat(amount),
        category,
        frequency: frequency || 'MONTHLY',
      }
    })

    return NextResponse.json(fixedCost, { status: 201 })
  } catch (error) {
    console.error('Fixed cost creation error:', error)
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

    await prisma.fixedCost.delete({
      where: {
        id,
        userId: session.user.id, // Ensure user owns this record
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fixed cost deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, amount, category, frequency } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const fixedCost = await prisma.fixedCost.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        amount: amount ? parseFloat(amount) : undefined,
        category,
        frequency,
      }
    })

    return NextResponse.json(fixedCost)
  } catch (error) {
    console.error('Fixed cost update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
