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

    const { currency, country, persona } = await req.json()

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    let profile

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          currency,
          country,
          persona,
        }
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          currency,
          country,
          persona,
        }
      })
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error('Profile error:', error)
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

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
