import * as React from 'react'

interface PasswordResetEmailProps {
  name: string
  resetLink: string
}

export const PasswordResetEmail = ({
  name,
  resetLink,
}: PasswordResetEmailProps) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f8fafc;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: 600;
          font-size: 16px;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #64748b;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>🔐 Reset Your Password</h1>
      </div>
      <div className="content">
        <p>Hi {name || 'there'},</p>
        
        <p>
          We received a request to reset your password for your MoneyMap account. 
          Click the button below to create a new password:
        </p>

        <center>
          <a href={resetLink} className="button">
            Reset Password
          </a>
        </center>

        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Or copy and paste this link into your browser:
          <br />
          <a href={resetLink} style={{ color: '#3b82f6', wordBreak: 'break-all' }}>
            {resetLink}
          </a>
        </p>

        <div className="warning">
          <p style={{ margin: 0, color: '#92400e' }}>
            ⚠️ <strong>Security Notice:</strong>
          </p>
          <ul style={{ margin: '10px 0 0 0', color: '#92400e' }}>
            <li>This link will expire in <strong>1 hour</strong></li>
            <li>If you didn't request this, please ignore this email</li>
            <li>Your password won't change unless you click the link above</li>
          </ul>
        </div>

        <p style={{ color: '#64748b', fontSize: '14px' }}>
          If you didn't request a password reset, you can safely ignore this email. 
          Your account is secure and no changes have been made.
        </p>

        <div className="footer">
          <p>This email was sent from MoneyMap</p>
          <p>
            Need help? Contact us at 
            <a href="mailto:support@moneymap.app" style={{ color: '#3b82f6' }}>
              support@moneymap.app
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
