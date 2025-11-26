# Email Notifications Setup Guide

## ✅ What's Implemented

### 1. Dark/Light Mode Toggle
- ✅ Theme provider configured
- ✅ Toggle button in header
- ✅ Smooth transitions
- ✅ System preference detection

**How to use:**
- Click the sun/moon icon in the header
- Automatically saves preference
- Respects system dark mode

---

### 2. Email Notification System

**Features:**
- ✅ Weekly summary emails
- ✅ Goal milestone notifications (50%, 75%, 100%)
- ✅ User email preferences page
- ✅ Beautiful HTML email templates
- ✅ Resend integration ready

**Email Templates Created:**
1. `WeeklySummary.tsx` - Weekly financial overview
2. `GoalMilestone.tsx` - Goal progress celebrations

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

The email preference fields need to be added to your database:

```bash
npx prisma migrate dev --name add_email_preferences
npx prisma generate
```

This adds:
- `emailNotifications` - Master toggle
- `weeklyEmailEnabled` - Weekly summary emails
- `goalEmailsEnabled` - Goal milestone emails
- `subscriptionReminders` - Subscription renewal reminders

---

### Step 2: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your domain (or use their test domain for development)
4. Go to API Keys section
5. Create a new API key
6. Copy the key

---

### Step 3: Configure Environment Variables

Add to your `.env` file:

```bash
# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL="MoneyMap <noreply@yourdomain.com>"
```

**For Development:**
Use Resend's test email:
```bash
FROM_EMAIL="MoneyMap <onboarding@resend.dev>"
```

**For Production:**
Verify your domain and use:
```bash
FROM_EMAIL="MoneyMap <noreply@moneymap.app>"
```

---

### Step 4: Test Email Sending

You can test the weekly summary email manually:

```bash
# In your browser or API client (Postman, etc.)
POST http://localhost:3000/api/emails/send-weekly-summary
Content-Type: application/json

{
  "userId": "your_user_id_here"
}
```

Or create a test page to trigger it.

---

## 📧 Email Templates

### Weekly Summary Email
**Sent:** Every Monday (when cron is set up)
**Contains:**
- Total monthly income
- Total monthly expenses
- Free money available
- Savings rate percentage
- Personalized tips based on performance

### Goal Milestone Email
**Sent:** When goal reaches 50%, 75%, or 100%
**Contains:**
- Progress bar
- Current vs target amount
- Remaining amount
- Motivational message
- Call-to-action button

---

## 🔄 Setting Up Automated Emails

### Option A: Vercel Cron (Recommended for Vercel deployment)

1. Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-emails",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

2. Create the cron route (already done):
`app/api/cron/weekly-emails/route.ts`

3. Deploy to Vercel - cron runs automatically!

### Option B: External Cron Service

Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **GitHub Actions** (if using GitHub)

Set up a weekly HTTP request to:
```
POST https://your-domain.com/api/cron/weekly-emails
Authorization: Bearer YOUR_CRON_SECRET
```

Add to `.env`:
```bash
CRON_SECRET=your_random_secret_here
```

---

## 🎯 Goal Milestone Trigger

To automatically send goal milestone emails, add this to your goal update API:

```typescript
// In app/api/goals/route.ts (PUT handler)

// After updating goal
const previousProgress = (oldAmount / goal.targetAmount) * 100
const newProgress = (newAmount / goal.targetAmount) * 100

// Check if milestone crossed
const milestones = [50, 75, 100]
for (const milestone of milestones) {
  if (previousProgress < milestone && newProgress >= milestone) {
    // Send milestone email
    await fetch(`${process.env.NEXTAUTH_URL}/api/emails/send-goal-milestone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        goalId: goal.id,
        milestone
      })
    })
  }
}
```

---

## 📱 User Settings

Users can manage email preferences at:
**`/settings/notifications`**

Features:
- Master email toggle
- Individual notification type toggles
- Instant save
- Visual feedback

---

## 🧪 Testing Checklist

- [ ] Dark mode toggle works
- [ ] Light mode toggle works
- [ ] Theme persists on page reload
- [ ] Resend API key configured
- [ ] Test email sends successfully
- [ ] Weekly summary email looks good
- [ ] Goal milestone email looks good
- [ ] Email preferences page loads
- [ ] Toggles save correctly
- [ ] Emails respect user preferences

---

## 🎨 Customizing Email Templates

Email templates are in `lib/emails/`:

**To customize:**
1. Edit the React component
2. Modify inline styles
3. Test with different data
4. Check mobile responsiveness

**Tips:**
- Use inline styles (email clients don't support external CSS)
- Keep it simple and clean
- Test in multiple email clients
- Use web-safe fonts
- Optimize images

---

## 🔐 Security Notes

1. **Never expose RESEND_API_KEY** in client-side code
2. **Use CRON_SECRET** to protect cron endpoints
3. **Validate user IDs** before sending emails
4. **Rate limit** email sending endpoints
5. **Check user preferences** before sending

---

## 📊 Monitoring

Track email performance:
1. Resend Dashboard - delivery rates, opens, clicks
2. Log all email sends in your database
3. Monitor bounce rates
4. Track unsubscribe rates

---

## 🚨 Troubleshooting

### Emails not sending?
- Check RESEND_API_KEY is correct
- Verify domain is verified (for production)
- Check Resend dashboard for errors
- Look at server logs

### Emails going to spam?
- Verify your domain with SPF/DKIM
- Use a professional from address
- Avoid spam trigger words
- Include unsubscribe link

### Cron not running?
- Check Vercel cron logs
- Verify cron schedule syntax
- Test endpoint manually first
- Check CRON_SECRET matches

---

## 🎉 You're All Set!

Your email notification system is ready to go! Users will now receive:
- 📧 Weekly financial summaries
- 🎯 Goal milestone celebrations
- 📅 Subscription reminders (when implemented)

Next steps:
- Deploy to production
- Set up domain verification
- Monitor email delivery
- Gather user feedback

Happy emailing! 📬
