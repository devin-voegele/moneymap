# Stripe Integration Setup Guide

## ✅ What's Been Implemented

All Stripe code is ready! You just need to configure your Stripe account and add the keys.

### Files Created:
1. `/lib/stripe.ts` - Stripe client configuration
2. `/app/api/stripe/checkout/route.ts` - Create checkout sessions
3. `/app/api/stripe/webhook/route.ts` - Handle Stripe events
4. `/app/api/stripe/portal/route.ts` - Customer portal access
5. Updated `/app/settings/billing/page.tsx` - Working upgrade buttons
6. Updated `/prisma/schema.prisma` - Added Stripe fields to Profile model

## 🚀 Setup Steps

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Sign up for an account
3. Complete verification (can test in test mode immediately)

### Step 2: Get Your API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 3: Create Products & Prices

#### Create Monthly Plan:
1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in:
   - **Name:** MoneyMap Pro (Monthly)
   - **Description:** Full access to MoneyMap Pro features
   - **Pricing:** Recurring
   - **Price:** €4.99
   - **Billing period:** Monthly
4. Click **Save product**
5. **Copy the Price ID** (starts with `price_`) - you'll need this!

#### Create Yearly Plan:
1. Click **"+ Add product"** again
2. Fill in:
   - **Name:** MoneyMap Pro (Yearly)
   - **Description:** Full access to MoneyMap Pro features - Save 35%!
   - **Pricing:** Recurring
   - **Price:** €39
   - **Billing period:** Yearly
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_`) - you'll need this!

### Step 4: Set Up Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
   (For local testing: Use ngrok or Stripe CLI)
4. Select events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_`)

### Step 5: Update Environment Variables

Add to your `.env` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id

# Make sure you have this too
NEXTAUTH_URL=http://localhost:3002
```

### Step 6: Update Database Schema

Run this command to add Stripe fields to your database:

```bash
npx prisma db push
```

This adds:
- `plan` (FREE or PRO)
- `stripeCustomerId`
- `stripeSubscriptionId`
- `stripePriceId`
- `stripeCurrentPeriodEnd`

### Step 7: Test Locally with Stripe CLI (Optional but Recommended)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3002/api/stripe/webhook
   ```
4. Use test card: `4242 4242 4242 4242` (any future date, any CVC)

## 🧪 Testing the Integration

### Test Upgrade Flow:

1. Go to `/settings/billing`
2. Click **"Monthly €4.99"** or **"Yearly €39"**
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. You'll be redirected back to `/settings/billing?success=true`
7. Your plan should now show as **PRO**!

### Test Subscription Management:

1. As a Pro user, click **"Manage Subscription in Stripe"**
2. You'll see the Stripe Customer Portal
3. You can:
   - Update payment method
   - View invoices
   - Cancel subscription
   - Update billing info

### Test Webhook Events:

When you complete checkout, the webhook should:
1. Receive `checkout.session.completed` event
2. Update user's profile to `plan: 'PRO'`
3. Store Stripe customer ID and subscription ID
4. Set the current period end date

## 🔒 Security Notes

### Webhook Signature Verification
The webhook route verifies that requests actually come from Stripe using the signing secret. Never skip this!

### Customer ID Validation
All Stripe operations validate that the customer belongs to the authenticated user.

### Test vs Production
- Use test keys (pk_test_, sk_test_) for development
- Switch to live keys (pk_live_, sk_live_) for production
- Webhooks need separate endpoints for test and live

## 📊 What Happens When User Upgrades

1. **User clicks upgrade** → Creates Stripe Checkout session
2. **User pays** → Stripe processes payment
3. **Stripe sends webhook** → Your API receives event
4. **Database updated** → User's plan set to PRO
5. **User redirected** → Back to billing page with success message

## 🎯 Plan Checking in Your App

Now you can check the user's plan anywhere:

```typescript
// In any component
const profile = await prisma.profile.findUnique({
  where: { userId: session.user.id }
})

if (profile?.plan === 'PRO') {
  // Show Pro features
} else {
  // Show upgrade prompt
}
```

## 🌐 Going Live

### Before Production:

1. **Switch to live keys** in `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_live_...
   NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_live_...
   ```

2. **Create live products** in Stripe dashboard (same as test)

3. **Update webhook endpoint** to production URL

4. **Enable Stripe Billing Portal**:
   - Go to https://dashboard.stripe.com/settings/billing/portal
   - Configure customer portal settings
   - Enable features you want customers to access

5. **Test with real card** (small amount first!)

## 💰 Pricing Recommendations

Current setup:
- **Monthly:** €4.99/month
- **Yearly:** €39/year (saves €20.88 = 35% off)

You can adjust these in Stripe dashboard anytime!

## 🆘 Troubleshooting

### Webhook not receiving events?
- Check webhook URL is correct
- Verify signing secret in `.env`
- Use Stripe CLI to forward events locally
- Check Stripe dashboard for webhook delivery attempts

### Checkout not working?
- Verify price IDs in `.env`
- Check Stripe secret key is correct
- Look at browser console for errors
- Check API route logs

### Plan not updating after payment?
- Check webhook is receiving events
- Verify webhook signature
- Look at database to see if profile updated
- Check Stripe dashboard for subscription status

## 📚 Resources

- Stripe Docs: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli
- Webhook Events: https://stripe.com/docs/api/events

---

## ✅ Quick Checklist

- [ ] Create Stripe account
- [ ] Get API keys (publishable & secret)
- [ ] Create Monthly product (€4.99)
- [ ] Create Yearly product (€39)
- [ ] Copy Price IDs
- [ ] Set up webhook endpoint
- [ ] Copy webhook signing secret
- [ ] Add all keys to `.env`
- [ ] Run `npx prisma db push`
- [ ] Test upgrade flow
- [ ] Test webhook events
- [ ] Test customer portal

**Once complete, your Stripe integration is live!** 🎉
