import * as React from 'react'

interface WeeklySummaryEmailProps {
  name: string
  totalIncome: number
  totalExpenses: number
  savingsRate: number
  freeMoney: number
}

export const WeeklySummaryEmail = ({
  name,
  totalIncome,
  totalExpenses,
  savingsRate,
  freeMoney,
}: WeeklySummaryEmailProps) => (
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
        .stat-card {
          background: white;
          padding: 20px;
          margin: 15px 0;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .stat-label {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .stat-value {
          color: #0f172a;
          font-size: 24px;
          font-weight: bold;
        }
        .button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          color: #64748b;
          font-size: 12px;
          margin-top: 30px;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>📊 Your Weekly MoneyMap Summary</h1>
      </div>
      <div className="content">
        <p>Hi {name || 'there'},</p>
        <p>Here's your financial summary for this week:</p>

        <div className="stat-card">
          <div className="stat-label">💰 Monthly Income</div>
          <div className="stat-value">€{totalIncome.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">💸 Monthly Expenses</div>
          <div className="stat-value">€{totalExpenses.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">💎 Free Money</div>
          <div className="stat-value" style={{ color: freeMoney >= 0 ? '#10b981' : '#ef4444' }}>
            €{freeMoney.toFixed(2)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">📈 Savings Rate</div>
          <div className="stat-value" style={{ color: savingsRate >= 20 ? '#10b981' : '#f59e0b' }}>
            {savingsRate.toFixed(1)}%
          </div>
        </div>

        {savingsRate >= 20 && (
          <p style={{ color: '#10b981', fontWeight: 'bold' }}>
            🎉 Great job! You're saving {savingsRate.toFixed(1)}% of your income!
          </p>
        )}

        {savingsRate < 10 && savingsRate >= 0 && (
          <p style={{ color: '#f59e0b' }}>
            💡 Tip: Try to save at least 10-20% of your income for better financial health.
          </p>
        )}

        {freeMoney < 0 && (
          <p style={{ color: '#ef4444' }}>
            ⚠️ You're spending more than you earn. Review your expenses in MoneyMap.
          </p>
        )}

        <center>
          <a href="https://moneymap.app/dashboard" className="button">
            View Full Dashboard
          </a>
        </center>

        <div className="footer">
          <p>You're receiving this because you enabled weekly email summaries.</p>
          <p>
            <a href="https://moneymap.app/settings/profile" style={{ color: '#3b82f6' }}>
              Manage email preferences
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
