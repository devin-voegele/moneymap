# Stripe Price Update Instructions

## Issue
The Stripe checkout is showing the old price (€4.99) even though you updated the price IDs in your `.env` file. This is because **Stripe prices are immutable** - you can't change the price of an existing Price object.

## Solution

You need to create **NEW** price objects in Stripe with the Black Friday pricing:

### Step 1: Create New Prices in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Find your "MoneyMap Pro" product
3. Click "Add another price"

**Create Monthly Price:**
- Price: €2.99
- Billing period: Monthly
- Description: "Black Friday Special - Monthly"
- Click "Add price"
- **Copy the new Price ID** (starts with `price_...`)

**Create Yearly Price:**
- Price: €19.00
- Billing period: Yearly
- Description: "Black Friday Special - Yearly"
- Click "Add price"
- **Copy the new Price ID** (starts with `price_...`)

### Step 2: Update Environment Variables

Update your `.env` file with the NEW price IDs:

```bash
# OLD (€4.99/month, €39/year)
# NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_old_monthly_id
# NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_old_yearly_id

# NEW Black Friday Prices (€2.99/month, €19/year)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_NEW_MONTHLY_ID_HERE
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_NEW_YEARLY_ID_HERE
```

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Test the Checkout

1. Go to Settings > Billing
2. Click "Monthly €2.99" or "Yearly €19"
3. Verify Stripe checkout shows the correct new price

## Important Notes

- **Keep the old prices active** in Stripe for existing subscribers
- Existing subscribers will continue paying the old price
- New subscribers will get the Black Friday price
- You can archive old prices later if needed

## Verification Checklist

- [ ] Created new €2.99/month price in Stripe
- [ ] Created new €19/year price in Stripe
- [ ] Updated NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID in .env
- [ ] Updated NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID in .env
- [ ] Restarted dev server
- [ ] Tested checkout - shows €2.99 for monthly
- [ ] Tested checkout - shows €19 for yearly

## Alternative: Using Stripe CLI

If you prefer using the Stripe CLI:

```bash
# Create monthly price
stripe prices create \
  --product prod_YOUR_PRODUCT_ID \
  --unit-amount 299 \
  --currency eur \
  --recurring[interval]=month \
  --nickname="Black Friday Monthly"

# Create yearly price
stripe prices create \
  --product prod_YOUR_PRODUCT_ID \
  --unit-amount 1900 \
  --currency eur \
  --recurring[interval]=year \
  --nickname="Black Friday Yearly"
```

Then copy the returned price IDs to your `.env` file.
