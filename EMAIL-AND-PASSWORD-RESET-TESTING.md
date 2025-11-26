# Email & Password Reset Testing Guide

## 🧪 Testing Email System

### Step 1: Configure Resend API Key

Add to your `.env` file:
```bash
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL="MoneyMap <onboarding@resend.dev>"  # For testing
```

Get your API key from [resend.com](https://resend.com) (free tier available)

---

### Step 2: Run Database Migrations

```bash
# Add password reset and email preference fields
npx prisma migrate dev --name add_password_reset_and_email_prefs

# Generate Prisma client
npx prisma generate
```

---

### Step 3: Test Email Sending

#### Option A: Test Endpoint (Easiest)

1. Start your dev server:
```bash
npm run dev
```

2. Sign in to your account

3. Visit in your browser:
```
http://localhost:3000/api/emails/test
```

4. Check your email inbox! You should receive a test email.

**What to expect:**
- ✅ Success response with email ID
- ✅ Email arrives in your inbox within seconds
- ✅ Beautiful HTML email with MoneyMap branding

**If it fails:**
- Check console for error messages
- Verify RESEND_API_KEY is correct
- Make sure FROM_EMAIL is set
- Check Resend dashboard for delivery logs

---

#### Option B: Test Weekly Summary

```bash
# Using curl or Postman
POST http://localhost:3000/api/emails/send-weekly-summary
Content-Type: application/json

{
  "userId": "your_user_id_here"
}
```

Get your user ID from the database or browser dev tools (session).

---

## 🔐 Testing Password Reset

### Full Password Reset Flow

#### 1. Request Password Reset

1. Go to sign-in page: `http://localhost:3000/auth/sign-in`
2. Click "Forgot password?" link
3. Enter your email address
4. Click "Send Reset Link"
5. You should see success message

**Expected behavior:**
- ✅ Success message appears (even if email doesn't exist - security)
- ✅ Email sent to your inbox
- ✅ Token created in database

#### 2. Check Your Email

You should receive an email with:
- 🔐 "Reset Your Password" subject
- Beautiful HTML template
- Reset password button
- Security warnings
- 1-hour expiration notice

#### 3. Reset Your Password

1. Click the reset link in the email
2. You'll be redirected to `/auth/reset-password?token=...`
3. Enter new password (min 8 characters)
4. Confirm password
5. Click "Reset Password"

**Expected behavior:**
- ✅ Password match indicator shows green when passwords match
- ✅ Success message appears
- ✅ Auto-redirect to sign-in page after 2 seconds
- ✅ Old password no longer works
- ✅ New password works for sign-in

#### 4. Verify Security

Try these security tests:

**Test 1: Token Expiration**
- Request reset link
- Wait 1 hour
- Try to use the link
- Should show "Token expired" error

**Test 2: Token Reuse**
- Reset password successfully
- Try to use the same link again
- Should show "Invalid token" error

**Test 3: Multiple Requests**
- Request reset link
- Request another reset link for same email
- Only the newest link should work
- Old link should be invalid

---

## 📧 Email Notification Settings

### Test User Preferences

1. Go to: `http://localhost:3000/settings/notifications`

2. Test each toggle:
   - ✅ Master email notifications toggle
   - ✅ Weekly summary emails
   - ✅ Goal milestone emails
   - ✅ Subscription reminders

3. Click "Save Preferences"

4. Verify settings persist after page reload

---

## 🎯 Email Templates Preview

### Templates Created:

1. **Test Email** (`/api/emails/test`)
   - Simple success confirmation
   - Verifies email system works

2. **Weekly Summary** (`WeeklySummary.tsx`)
   - Financial overview
   - Income, expenses, savings rate
   - Personalized tips
   - Color-coded insights

3. **Goal Milestone** (`GoalMilestone.tsx`)
   - Progress celebration
   - Visual progress bar
   - Motivational messages
   - Different emojis for 50%, 75%, 100%

4. **Password Reset** (`PasswordReset.tsx`)
   - Reset link button
   - Security warnings
   - Expiration notice
   - Professional design

---

## 🔍 Troubleshooting

### Email Not Sending?

**Check 1: Resend API Key**
```bash
# In your terminal
echo $RESEND_API_KEY  # Should show your key
```

**Check 2: Server Logs**
Look for errors in your terminal where `npm run dev` is running

**Check 3: Resend Dashboard**
- Go to [resend.com/emails](https://resend.com/emails)
- Check delivery status
- View error logs

**Check 4: Spam Folder**
Test emails might go to spam initially

---

### Password Reset Not Working?

**Issue: "Invalid token" error**
- Token might be expired (1 hour limit)
- Token might have been used already
- Request a new reset link

**Issue: Email not arriving**
- Check spam folder
- Verify email address is correct
- Check Resend dashboard for delivery status

**Issue: Can't sign in with new password**
- Make sure you're using the NEW password
- Clear browser cache/cookies
- Try incognito mode

---

## 📊 Database Verification

Check if everything is working in the database:

```sql
-- Check password reset tokens
SELECT * FROM password_reset_tokens;

-- Check email preferences
SELECT email, "emailNotifications", "weeklyEmailEnabled" 
FROM users 
WHERE email = 'your@email.com';

-- Check if password was updated
SELECT email, "passwordHash", "updatedAt" 
FROM users 
WHERE email = 'your@email.com';
```

---

## ✅ Complete Testing Checklist

### Email System
- [ ] Resend API key configured
- [ ] Test email sends successfully
- [ ] Email arrives in inbox
- [ ] HTML renders correctly
- [ ] Links in email work

### Password Reset
- [ ] Forgot password page loads
- [ ] Reset email sends
- [ ] Reset link works
- [ ] Password updates successfully
- [ ] Can sign in with new password
- [ ] Old password no longer works
- [ ] Token expires after 1 hour
- [ ] Used tokens become invalid

### Email Preferences
- [ ] Settings page loads
- [ ] Toggles work correctly
- [ ] Settings save successfully
- [ ] Settings persist after reload
- [ ] Emails respect user preferences

### Security
- [ ] Tokens are unique and random
- [ ] Tokens expire properly
- [ ] Used tokens can't be reused
- [ ] Multiple requests invalidate old tokens
- [ ] No email enumeration (same message for valid/invalid emails)

---

## 🚀 Production Deployment

Before deploying to production:

1. **Verify Domain in Resend**
   - Add your domain to Resend
   - Set up SPF and DKIM records
   - Verify domain ownership

2. **Update Environment Variables**
   ```bash
   FROM_EMAIL="MoneyMap <noreply@moneymap.app>"
   NEXTAUTH_URL="https://moneymap.app"
   ```

3. **Test in Production**
   - Send test email
   - Complete password reset flow
   - Check email deliverability

4. **Monitor**
   - Watch Resend dashboard
   - Check bounce rates
   - Monitor spam complaints

---

## 💡 Tips

- **Development**: Use `onboarding@resend.dev` for testing
- **Production**: Verify your own domain for better deliverability
- **Testing**: Create a test account to avoid affecting real users
- **Debugging**: Check both server logs and Resend dashboard
- **Security**: Never log or expose password reset tokens

---

## 🎉 You're Ready!

Your email and password reset system is fully functional! Users can now:
- ✅ Receive email notifications
- ✅ Reset forgotten passwords securely
- ✅ Manage email preferences
- ✅ Get weekly financial summaries
- ✅ Celebrate goal milestones

Happy testing! 📧🔐
