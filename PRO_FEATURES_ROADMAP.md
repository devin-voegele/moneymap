# Pro Features Implementation Roadmap

## ✅ COMPLETED

### 1. Landing Page Improvements
- ✅ Updated hero copy: "See exactly where your money goes and how to reach your goals – without spreadsheets or finance jargon"
- ✅ Added "No credit card needed. Upgrade anytime for €4.99" under CTA
- ✅ Added ROI message in Pro card: "If MoneyMap helps you cancel just one €5–10/month subscription, it's already paid for itself"
- ✅ Added social proof: "Designed for students, apprentices & young workers"
- ✅ Added trust signals: "Cancel anytime. No hidden fees."
- ✅ Listed Pro features: What-if simulator, Smart suggestions, Monthly summary email

### 2. AI Coach Page Improvements
- ✅ Better copy: "I use your real numbers to give you clear, simple answers"
- ✅ Added: "No investing hype. Just straight talk about your budget and goals"
- ✅ Markdown rendering for formatted responses
- ✅ Cleaner, bigger interface

## 🚧 TO IMPLEMENT (Priority Order)

### HIGH PRIORITY: Free Plan Limits & Gates

#### 1. Subscriptions Page - 5 Subscription Limit
**Location:** `/app/subscriptions/page.tsx`

**Implementation:**
```typescript
// Add at top of component
const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
const userPlan = 'FREE' // Later: fetch from profile
const isAtLimit = userPlan === 'FREE' && subscriptions.length >= 5

// In "Add Subscription" button
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button disabled={isAtLimit}>
      <Plus className="h-4 w-4 mr-2" />
      Add Subscription
    </Button>
  </DialogTrigger>
  {/* ... */}
</Dialog>

// Add modal when clicking disabled button
{isAtLimit && (
  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-400 font-medium">Track unlimited subscriptions with Pro</p>
        <p className="text-slate-400 text-sm">Most Pro users discover at least one subscription to cancel.</p>
      </div>
      <Button size="sm">Upgrade (€4.99/month)</Button>
    </div>
  </div>
)}
```

#### 2. Goals Page - 1 Goal Limit
**Location:** `/app/goals/page.tsx`

**Implementation:**
```typescript
const userPlan = 'FREE'
const isAtLimit = userPlan === 'FREE' && goals.length >= 1

// In Add Goal button
<Button disabled={isAtLimit} onClick={() => setIsDialogOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Add Goal
</Button>

// Add upgrade prompt
{isAtLimit && (
  <Card className="bg-blue-500/10 border-blue-500/20 mt-6">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold mb-1">Want to save for multiple goals?</h3>
          <p className="text-slate-400 text-sm">Upgrade to Pro for unlimited savings goals.</p>
        </div>
        <Button>Upgrade to Pro</Button>
      </div>
    </CardContent>
  </Card>
)}
```

#### 3. AI Coach - Usage Tracking (7/10 questions)
**Location:** `/app/coach/page.tsx` + new API

**Database:** Add to `profiles` table:
```sql
ALTER TABLE profiles ADD COLUMN ai_questions_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN ai_questions_reset_date TIMESTAMP DEFAULT NOW();
```

**Implementation:**
```typescript
// In coach page
const [questionsUsed, setQuestionsUsed] = useState(7)
const [questionsLimit] = useState(10)
const userPlan = 'FREE'

// Show usage banner
{userPlan === 'FREE' && (
  <div className="p-4 bg-slate-800 border-b border-slate-700">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm font-medium">
              {questionsUsed}/{questionsLimit} questions used this month
            </span>
            {questionsUsed >= questionsLimit && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Limit reached</span>
            )}
          </div>
          <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${questionsUsed >= questionsLimit ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${(questionsUsed / questionsLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <Button size="sm" variant="outline">
        Unlimited with Pro
      </Button>
    </div>
  </div>
)}

// Disable input when at limit
<Input
  disabled={userPlan === 'FREE' && questionsUsed >= questionsLimit}
  placeholder={
    userPlan === 'FREE' && questionsUsed >= questionsLimit
      ? "Upgrade to Pro for unlimited questions"
      : "Ask me anything about your finances..."
  }
/>
```

### MEDIUM PRIORITY: Pro-Only Features

#### 4. What-if Simulator (Pro Feature)
**Location:** New component `/components/WhatIfSimulator.tsx`

**Add to Dashboard:**
```typescript
{/* What-if Simulator */}
{userPlan === 'PRO' ? (
  <Card className="bg-slate-900/50 border-slate-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        What-if Simulator
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">If you cancel...</Label>
          <Select>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select a subscription" />
            </SelectTrigger>
            <SelectContent>
              {subscriptions.map(sub => (
                <SelectItem key={sub.id} value={sub.id}>{sub.name} (€{sub.amount}/month)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white">And add it to...</Label>
          <Select>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map(goal => (
                <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 You'll reach your goal <strong>3 months earlier</strong> (by March 2025 instead of June 2025)
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
) : (
  <Card className="bg-slate-900/50 border-slate-700 relative overflow-hidden">
    <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/80 flex items-center justify-center z-10">
      <div className="text-center">
        <Lock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
        <p className="text-white font-medium mb-2">What-if Simulator</p>
        <p className="text-slate-400 text-sm mb-4">See how small changes impact your goals</p>
        <Button size="sm">Unlock with Pro</Button>
      </div>
    </div>
    <CardHeader className="blur-sm">
      <CardTitle className="text-white">What-if Simulator</CardTitle>
    </CardHeader>
    <CardContent className="blur-sm">
      <div className="h-48"></div>
    </CardContent>
  </Card>
)}
```

#### 5. Smart Suggestions (Pro Feature)
**Location:** Add to `/app/subscriptions/page.tsx` and `/app/dashboard/page.tsx`

**Implementation:**
```typescript
// Generate suggestions based on data
const suggestions = [
  {
    type: 'warning',
    message: `You pay for ${subscriptions.length} streaming services. Most users are fine with 1–2.`,
    savings: '€20/month'
  },
  {
    type: 'info',
    message: `Your subscriptions are ${((totalSubs / totalIncome) * 100).toFixed(0)}% of your income. We recommend staying under 10–12%.`,
    savings: null
  },
  {
    type: 'success',
    message: `You marked ${subscriptions.filter(s => s.worthIt === 'NO').length} subscriptions as "Not worth it". Consider canceling them.`,
    savings: '€35/month'
  }
]

// Show in UI
<Card className="bg-slate-900/50 border-slate-700">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-white">Smart Suggestions</CardTitle>
      {userPlan === 'FREE' && (
        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
          1 of 3 shown • Unlock all with Pro
        </span>
      )}
    </div>
  </CardHeader>
  <CardContent className="space-y-3">
    {suggestions.slice(0, userPlan === 'FREE' ? 1 : 3).map((suggestion, i) => (
      <div key={i} className={`p-4 rounded-lg border ${
        suggestion.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
        suggestion.type === 'info' ? 'bg-blue-500/10 border-blue-500/20' :
        'bg-green-500/10 border-green-500/20'
      }`}>
        <p className={`text-sm ${
          suggestion.type === 'warning' ? 'text-yellow-400' :
          suggestion.type === 'info' ? 'text-blue-400' :
          'text-green-400'
        }`}>
          {suggestion.message}
          {suggestion.savings && (
            <strong className="ml-1">Save {suggestion.savings}!</strong>
          )}
        </p>
      </div>
    ))}
    {userPlan === 'FREE' && suggestions.length > 1 && (
      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg blur-sm relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="sm">Unlock 2 more suggestions</Button>
        </div>
        <p className="text-slate-400 text-sm">Hidden suggestion...</p>
      </div>
    )}
  </CardContent>
</Card>
```

#### 6. Goals Page - Advanced Projections (Pro)
**Location:** `/app/goals/page.tsx`

**Add to each goal card:**
```typescript
{userPlan === 'PRO' ? (
  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
    <p className="text-blue-400 text-sm">
      📊 <strong>Projection:</strong> At your current rate, you'll reach this goal by {projectedDate}. 
      Add €20 more per month to finish 1 month earlier.
    </p>
  </div>
) : (
  <div className="mt-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Lock className="h-4 w-4 text-slate-500" />
      <span className="text-slate-400 text-sm">Advanced Projections (Pro)</span>
    </div>
    <Button size="sm" variant="ghost">Unlock</Button>
  </div>
)}
```

### LOW PRIORITY: Nice-to-Have

#### 7. Monthly Summary Email (Pro)
- Create email template
- Add cron job to send monthly
- Store in database: last_email_sent_date

#### 8. Budget vs Actual Tracking
- Track actual spending vs budget
- Show variance
- Alerts when over budget

## 📝 Implementation Notes

### User Plan Detection
Add to all pages:
```typescript
'use client'
import { useSession } from 'next-auth/react'

const { data: session } = useSession()
const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE')

useEffect(() => {
  // Fetch user plan from profile
  fetch('/api/profile')
    .then(res => res.json())
    .then(data => setUserPlan(data.plan || 'FREE'))
}, [])
```

### Database Changes Needed
```sql
-- Add plan to profiles
ALTER TABLE profiles ADD COLUMN plan VARCHAR(10) DEFAULT 'FREE';

-- Add AI usage tracking
ALTER TABLE profiles ADD COLUMN ai_questions_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN ai_questions_reset_date TIMESTAMP DEFAULT NOW();

-- Add Stripe customer info
ALTER TABLE profiles ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE profiles ADD COLUMN stripe_subscription_id VARCHAR(255);
```

## 🎯 Quick Wins (Do These First)

1. **Subscriptions 5-item limit** - 30 min
2. **Goals 1-item limit** - 20 min
3. **AI Coach usage banner** - 45 min
4. **Smart Suggestions (1 shown for Free)** - 1 hour
5. **What-if Simulator with blur** - 2 hours

Total: ~5 hours for core Free/Pro differentiation

## 💰 Conversion Strategy

**Pain Points to Surface:**
1. Try to add 6th subscription → "Upgrade to track unlimited"
2. Try to add 2nd goal → "Save for multiple goals with Pro"
3. Use 10 AI questions → "You've used all your questions this month"
4. See blurred suggestions → "Unlock 2 more money-saving tips"
5. See locked What-if → "See how changes impact your goals"

**Value Props:**
- "Most Pro users find at least one subscription to cancel"
- "If you cancel just one €5–10 subscription, Pro pays for itself"
- "Unlimited everything for less than a coffee"

This creates natural upgrade moments without being annoying!
