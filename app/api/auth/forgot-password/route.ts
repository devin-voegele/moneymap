import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { PasswordResetEmail } from '@/lib/emails/PasswordReset'
import crypto from 'crypto'
import { render } from '@react-email/components'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      })
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() }
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt,
      }
    })

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

    // Render email HTML
    const emailHtml = await render(
      PasswordResetEmail({
        name: user.name || 'there',
        resetLink,
      })
    )

    // Send email
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🔐 Reset Your MoneyMap Password',
      html: emailHtml,
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.'
    })

  } catch (error: any) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
