# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment

### Database
- [ ] Run all pending migrations: `npx prisma migrate deploy`
- [ ] Verify database backups are configured
- [ ] Set up connection pooling (PgBouncer recommended)
- [ ] Test database performance under load

### Environment Variables
```bash
# Production .env template
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID="price_..."
RESEND_API_KEY="re_..."
FROM_EMAIL="MoneyMap <noreply@yourdomain.com>"
GOOGLE_CLIENT_ID="..." # Optional
GOOGLE_CLIENT_SECRET="..." # Optional
```

### Stripe Setup
- [ ] Switch to live mode keys
- [ ] Create live products and prices
- [ ] Update price IDs in environment variables
- [ ] Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Test webhook with Stripe CLI
- [ ] Verify subscription flows work

### Email Setup
- [ ] Verify domain with Resend
- [ ] Update FROM_EMAIL to use your domain
- [ ] Test password reset emails
- [ ] Test notification emails
- [ ] Add SPF/DKIM records

### Security
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Add rate limiting (Upstash Rate Limit)
- [ ] Configure CORS properly
- [ ] Add CSP headers
- [ ] Review all API routes for auth checks

---

## 🔧 Code Changes Needed

### 1. Add Error Boundary
Create `app/error.tsx`:
```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  )
}
```

### 2. Add Loading States
Create `app/loading.tsx`:
```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )
}
```

### 3. Add Rate Limiting
Install: `npm install @upstash/ratelimit @upstash/redis`

Add to AI coach API route:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

// In API route:
const { success } = await ratelimit.limit(session.user.id)
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

### 4. Add SEO Meta Tags
Update `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'MoneyMap - Simple Money Clarity for Students',
  description: 'Track your budget, manage subscriptions, and reach savings goals. Built for 15-30 year olds.',
  openGraph: {
    title: 'MoneyMap',
    description: 'Simple money clarity for students & young adults',
    url: 'https://yourdomain.com',
    siteName: 'MoneyMap',
    images: ['/og-image.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyMap',
    description: 'Simple money clarity for students & young adults',
    images: ['/og-image.png'],
  },
}
```

### 5. Add robots.txt
Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /settings/

Sitemap: https://yourdomain.com/sitemap.xml
```

### 6. Add Legal Pages
- [ ] Create `app/privacy/page.tsx`
- [ ] Create `app/terms/page.tsx`
- [ ] Add links in footer

---

## 📊 Monitoring Setup

### Error Tracking
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Analytics
```bash
npm install @vercel/analytics
# or
npm install plausible-tracker
```

### Logging
- Set up Better Stack (Logtail)
- Configure log levels for production
- Add structured logging

---

## 🧪 Testing

### Manual Tests
- [ ] Sign up flow
- [ ] Sign in flow
- [ ] Password reset
- [ ] Add income/expenses
- [ ] Create subscription
- [ ] Set goal
- [ ] AI coach (free tier limit)
- [ ] Upgrade to Pro
- [ ] Payment flow
- [ ] Cancel subscription
- [ ] Export to Excel
- [ ] Email notifications
- [ ] Dark/light mode
- [ ] Mobile responsiveness

### Stripe Tests
- [ ] Test card: 4242 4242 4242 4242
- [ ] Successful payment
- [ ] Failed payment
- [ ] Subscription renewal
- [ ] Subscription cancellation
- [ ] Webhook delivery

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Post-Deployment
- [ ] Verify all pages load
- [ ] Test authentication
- [ ] Test payments
- [ ] Test webhooks
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## 📈 Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Check payment success rate
- [ ] Review user feedback
- [ ] Fix critical bugs

### Month 1
- [ ] Analyze user behavior
- [ ] Optimize slow queries
- [ ] Add requested features
- [ ] Improve onboarding

---

## 🔒 Security Audit

- [ ] Run `npm audit`
- [ ] Update all dependencies
- [ ] Review all API routes for vulnerabilities
- [ ] Test for SQL injection
- [ ] Test for XSS
- [ ] Verify CSRF protection
- [ ] Check for exposed secrets

---

## 💰 Pricing Verification

Current pricing:
- Free: 5 AI questions/month
- Pro Monthly: €2.99/month
- Pro Yearly: €29.99/year

- [ ] Verify Stripe prices match
- [ ] Test upgrade flow
- [ ] Test downgrade flow
- [ ] Verify limits are enforced

---

## 📞 Support Setup

- [ ] Set up support email
- [ ] Create help documentation
- [ ] Add FAQ page
- [ ] Set up feedback form
- [ ] Create status page

---

## ✅ Final Checklist

- [ ] All migrations run
- [ ] All environment variables set
- [ ] Stripe configured
- [ ] Email working
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Legal pages added
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security audit complete
- [ ] Backups configured
- [ ] Monitoring active

**Ready to launch!** 🚀
