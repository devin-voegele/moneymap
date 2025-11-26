import * as React from 'react'

interface GoalMilestoneEmailProps {
  name: string
  goalName: string
  targetAmount: number
  currentAmount: number
  progress: number
  milestone: number // 50, 75, or 100
}

export const GoalMilestoneEmail = ({
  name,
  goalName,
  targetAmount,
  currentAmount,
  progress,
  milestone,
}: GoalMilestoneEmailProps) => {
  const emoji = milestone === 100 ? '🎉' : milestone === 75 ? '🔥' : '🎯'
  const message = milestone === 100 
    ? 'Congratulations! You reached your goal!' 
    : `You're ${milestone}% of the way there!`

  return (
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
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            color: white;
            padding: 40px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .emoji {
            font-size: 64px;
            margin-bottom: 10px;
          }
          .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .progress-bar {
            background: #e2e8f0;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
          }
          .progress-fill {
            background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transition: width 0.3s ease;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
          }
          .stat-label {
            color: #64748b;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: #10b981;
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
          <div className="emoji">{emoji}</div>
          <h1>{message}</h1>
          <p style={{ fontSize: '18px', margin: '10px 0 0 0' }}>{goalName}</p>
        </div>
        <div className="content">
          <p>Hi {name || 'there'},</p>
          
          {milestone === 100 ? (
            <p style={{ fontSize: '18px', color: '#10b981', fontWeight: 'bold' }}>
              Amazing work! You've successfully saved €{currentAmount.toFixed(2)} and reached your goal of €{targetAmount.toFixed(2)}! 🎊
            </p>
          ) : (
            <p>
              Great progress on your savings goal! You've reached {milestone}% of your target.
            </p>
          )}

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              {progress.toFixed(1)}%
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-value">€{currentAmount.toFixed(2)}</div>
              <div className="stat-label">Current</div>
            </div>
            <div className="stat">
              <div className="stat-value">€{targetAmount.toFixed(2)}</div>
              <div className="stat-label">Target</div>
            </div>
            <div className="stat">
              <div className="stat-value">€{(targetAmount - currentAmount).toFixed(2)}</div>
              <div className="stat-label">Remaining</div>
            </div>
          </div>

          {milestone !== 100 && (
            <p style={{ background: '#dbeafe', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              💡 <strong>Keep it up!</strong> You're doing great. Stay consistent with your savings to reach your goal even faster!
            </p>
          )}

          {milestone === 100 && (
            <p style={{ background: '#d1fae5', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              🎯 <strong>What's next?</strong> Consider setting a new goal to keep the momentum going!
            </p>
          )}

          <center>
            <a href="https://moneymap.app/goals" className="button">
              View Your Goals
            </a>
          </center>

          <div className="footer">
            <p>You're receiving this because you enabled goal milestone notifications.</p>
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
}
