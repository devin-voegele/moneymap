# MoneyMap

**Simple money clarity for students & young adults.**

MoneyMap helps 15–30-year-olds understand where their money goes, manage subscriptions, and hit small savings goals without complex finance tools.

## Features

- 💰 **Budget Overview** - Track income and fixed costs
- 📱 **Subscription Tracker** - Monitor all your subscriptions and their yearly costs
- 🎯 **Savings Goals** - Set and track progress toward your financial goals
- 🤖 **AI Money Coach** - Get personalized advice about your budget
- 📊 **Visual Insights** - Beautiful charts and breakdowns

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Supabase)
- OpenAI API key (for AI coach feature)
- Stripe account (for Pro subscriptions)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd MoneyMap
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **AI:** OpenAI API
- **Payments:** Stripe

## Project Structure

```
MoneyMap/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # Onboarding flow
│   └── ...
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## License

MIT

## Support

For support, email contact@moneymap.app
