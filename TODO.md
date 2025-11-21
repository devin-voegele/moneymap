# MoneyMap - Development TODO

## ✅ Completed

- [x] Project setup and configuration
- [x] Database schema (Prisma)
- [x] Authentication system (NextAuth)
- [x] Landing page with full marketing content
- [x] Sign up / Sign in pages
- [x] Privacy policy and Terms of Service
- [x] UI component library (shadcn/ui style)
- [x] Utility functions for calculations
- [x] Route protection middleware

## 🚧 High Priority - Core Features

### Onboarding Flow (`/onboarding`)
- [ ] Step 1: User persona selection (Student/Worker/Part-time/Other)
- [ ] Step 2: Currency and country selection
- [ ] Step 3: Monthly income input
- [ ] Step 4: Fixed costs input (Rent, Food, Transport, etc.)
- [ ] Step 5: Quick subscription add (Netflix, Spotify, etc.)
- [ ] Step 6: First savings goal (optional)
- [ ] Step 7: Summary and "Go to Dashboard" button
- [ ] Create profile on completion
- [ ] Redirect logic based on completion status

### Dashboard (`/dashboard`)
- [ ] Navigation header component
- [ ] Key metrics cards (Income, Fixed Costs, Subscriptions, Free Money)
- [ ] Donut chart for budget breakdown (using recharts)
- [ ] Goals overview section with progress bars
- [ ] Insights card with AI-generated tips
- [ ] Coach teaser section
- [ ] Responsive layout (mobile/desktop)
- [ ] Server-side data fetching
- [ ] Plan badge (Free/Pro) in header

### Budget Management (`/budget`)
- [ ] Tabs: Overview / Income & Fixed Costs
- [ ] Income sources list with CRUD
- [ ] Fixed costs list with CRUD
- [ ] Category selection for fixed costs
- [ ] Frequency selection (Monthly/Weekly/Yearly)
- [ ] Summary calculations
- [ ] Add/Edit/Delete modals
- [ ] Form validation

### Subscriptions (`/subscriptions`)
- [ ] Subscription list/table view
- [ ] Add subscription modal with autocomplete
- [ ] Category filter
- [ ] Search functionality
- [ ] Monthly/Yearly cost display
- [ ] "Worth it?" rating system
- [ ] Next billing date tracking
- [ ] Edit/Delete functionality
- [ ] Summary cards (total monthly, yearly, count)
- [ ] AI suggestions for each subscription

### Goals (`/goals`)
- [ ] Goals grid/list view
- [ ] Add goal modal
- [ ] Goal detail view/modal
- [ ] Progress bars with percentage
- [ ] Required monthly savings calculation
- [ ] Status indicators (On track/At risk/Off track)
- [ ] Time remaining display
- [ ] Edit/Delete functionality
- [ ] Current saved amount tracking
- [ ] "What-if" slider for monthly savings

### AI Coach (`/coach`)
- [ ] Chat interface layout
- [ ] Message bubbles (user/assistant)
- [ ] User context sidebar (budget summary)
- [ ] Suggested prompt buttons
- [ ] Message input with send button
- [ ] Chat history persistence
- [ ] Loading states
- [ ] Free plan limit indicator (X/10 questions)
- [ ] Upgrade prompt for free users
- [ ] Error handling

## 🔌 API Routes

### Data Management
- [ ] `/api/income` - GET, POST, PUT, DELETE
- [ ] `/api/fixed-costs` - GET, POST, PUT, DELETE
- [ ] `/api/subscriptions` - GET, POST, PUT, DELETE
- [ ] `/api/goals` - GET, POST, PUT, DELETE
- [ ] `/api/profile` - GET, PUT

### AI Integration
- [ ] `/api/coach` - POST (send message, get response)
- [ ] Build user context for AI prompts
- [ ] OpenAI API integration
- [ ] Rate limiting for free users
- [ ] Monthly request counter reset logic
- [ ] Error handling and fallbacks

### Stripe Integration
- [ ] `/api/stripe/checkout` - Create checkout session
- [ ] `/api/stripe/webhook` - Handle Stripe events
- [ ] `/api/stripe/portal` - Customer portal session
- [ ] Handle subscription created
- [ ] Handle subscription updated
- [ ] Handle subscription cancelled
- [ ] Update user plan in database
- [ ] Feature gating based on plan

## ⚙️ Settings & Profile

### Profile Settings (`/settings/profile`)
- [ ] Edit name and email
- [ ] Change currency
- [ ] Update country
- [ ] Change persona
- [ ] Dark/Light mode toggle (optional)
- [ ] Delete account functionality

### Billing Settings (`/settings/billing`)
- [ ] Display current plan (Free/Pro)
- [ ] Upgrade to Pro button (if Free)
- [ ] Next billing date (if Pro)
- [ ] Manage subscription button → Stripe portal
- [ ] Billing history (optional)
- [ ] Cancel subscription flow

## 🎨 Components to Build

### Charts
- [ ] Donut chart component (budget breakdown)
- [ ] Bar chart component (monthly comparison)
- [ ] Line chart component (goal progress over time)
- [ ] Responsive chart wrapper

### Cards & Lists
- [ ] Metric card component
- [ ] Goal card component
- [ ] Subscription card component
- [ ] Insight card component
- [ ] Empty state components

### Forms
- [ ] Income form component
- [ ] Fixed cost form component
- [ ] Subscription form component
- [ ] Goal form component
- [ ] Form field components with validation

### Navigation
- [ ] Main navigation header
- [ ] User dropdown menu
- [ ] Mobile menu
- [ ] Plan badge component
- [ ] Breadcrumbs (optional)

## 🧪 Testing & Polish

- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test Stripe integration (test mode)
- [ ] Test AI coach with various queries
- [ ] Mobile responsiveness testing
- [ ] Form validation testing
- [ ] Error state handling
- [ ] Loading state improvements
- [ ] Accessibility improvements
- [ ] SEO optimization

## 📝 Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guide
- [ ] Environment setup guide
- [ ] Contributing guidelines (if open source)

## 🚀 Deployment

- [ ] Set up production database
- [ ] Configure production environment variables
- [ ] Set up Stripe production keys
- [ ] Deploy to Vercel/Netlify
- [ ] Set up custom domain
- [ ] Configure email service (optional)
- [ ] Set up monitoring/analytics
- [ ] Set up error tracking (Sentry, etc.)

## 💡 Nice-to-Have Features

- [ ] Export data functionality
- [ ] Import from CSV
- [ ] Recurring expense reminders
- [ ] Budget vs actual tracking
- [ ] Multi-currency support
- [ ] Shared budgets (family/roommates)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Email notifications
- [ ] Budget templates
- [ ] Financial reports (PDF export)

## 📊 Analytics & Insights

- [ ] Track user engagement
- [ ] Monitor AI coach usage
- [ ] Conversion tracking (Free → Pro)
- [ ] Feature usage analytics
- [ ] Performance monitoring

---

## Priority Order

1. **Week 1:** Onboarding + Dashboard + Basic CRUD APIs
2. **Week 2:** Budget, Subscriptions, Goals pages
3. **Week 3:** AI Coach + Stripe integration
4. **Week 4:** Settings, Polish, Testing
5. **Week 5:** Deployment + Documentation

**Current Status:** Foundation complete, ready for feature development!
