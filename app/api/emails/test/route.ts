import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Send a simple test email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: '🧪 MoneyMap Email Test',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
              }
              .content {
                background: #f8fafc;
                padding: 30px;
                border-radius: 10px;
                margin-top: 20px;
              }
              .success {
                background: #d1fae5;
                border-left: 4px solid #10b981;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Email Test Successful!</h1>
            </div>
            <div class="content">
              <p>Hi ${session.user.name || 'there'},</p>
              
              <div class="success">
                <p style="margin: 0; color: #065f46;">
                  ✅ <strong>Success!</strong> Your email system is working perfectly.
                </p>
              </div>

              <p>This is a test email from MoneyMap to verify that:</p>
              <ul>
                <li>✅ Resend API is configured correctly</li>
                <li>✅ Email templates are rendering properly</li>
                <li>✅ Emails are being delivered successfully</li>
              </ul>

              <p>You can now receive:</p>
              <ul>
                <li>📊 Weekly financial summaries</li>
                <li>🎯 Goal milestone notifications</li>
                <li>🔐 Password reset emails</li>
                <li>📅 Subscription reminders</li>
              </ul>

              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                Sent from MoneyMap at ${new Date().toLocaleString()}
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to send test email',
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      emailId: data?.id,
      sentTo: session.user.email
    })

  } catch (error: any) {
    console.error('Email test error:', error)
    
    // Check if it's a Resend API key error
    if (error.message?.includes('RESEND_API_KEY')) {
      return NextResponse.json({
        success: false,
        error: 'Resend API key not configured',
        help: 'Add RESEND_API_KEY to your .env file'
      }, { status: 500 })
    }

    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to send test email',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
