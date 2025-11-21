# Getting Started with MoneyMap

## Quick Start

### 1. Install Dependencies

```bash
cd C:\Users\devin\Downloads\MoneyMap
npm install
```

This will install all required packages including Next.js, React, Prisma, NextAuth, Tailwind CSS, and more.

### 2. Configure Environment Variables

Edit the `.env` file in the root directory:

```env
# Database - Add your Supabase connection string
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth - Generate a secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# OpenAI - Add your API key
OPENAI_API_KEY="sk-..."

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (Optional for now)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see your app!

## What's Working Right Now

✅ **Landing Page** - Beautiful marketing page at `/`
✅ **Sign Up** - Create account at `/auth/sign-up`
✅ **Sign In** - Login at `/auth/sign-in`
✅ **Authentication** - Email/password + Google OAuth ready
✅ **Database** - Full schema with all tables
✅ **Legal Pages** - Privacy policy and Terms of Service

## Project Structure

```
MoneyMap/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/
│   │       ├── [...nextauth]/    # NextAuth handler
│   │       └── register/         # Registration endpoint
│   ├── auth/                     # Auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── legal/                    # Legal pages
│   │   ├── privacy/
│   │   └── terms/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       └── dropdown-menu.tsx
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   └── next-auth.d.ts            # TypeScript types
├── middleware.ts                 # Route protection
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Database Schema

The Prisma schema includes:

- **User** - User accounts with auth
- **Profile** - User profile (currency, country, persona)
- **Income** - Income sources
- **FixedCost** - Fixed expenses
- **Subscription** - Subscription tracking
- **Goal** - Savings goals
- **ChatSession** - AI coach conversations
- **ChatMessage** - Individual chat messages

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
```

## Next Steps to Complete the App

### Pages to Build:
1. **Onboarding** (`/onboarding`) - Multi-step wizard for new users
2. **Dashboard** (`/dashboard`) - Main overview with charts
3. **Budget** (`/budget`) - Income and expenses management
4. **Subscriptions** (`/subscriptions`) - Subscription tracker
5. **Goals** (`/goals`) - Savings goals management
6. **Coach** (`/coach`) - AI chat interface
7. **Settings** (`/settings/*`) - Profile and billing

### API Routes to Build:
1. `/api/income` - CRUD for income
2. `/api/fixed-costs` - CRUD for expenses
3. `/api/subscriptions` - CRUD for subscriptions
4. `/api/goals` - CRUD for goals
5. `/api/coach` - AI chat endpoint
6. `/api/stripe/*` - Stripe integration

### Components to Build:
1. Navigation header
2. Chart components (using recharts)
3. Goal progress cards
4. Subscription cards
5. AI chat interface
6. Onboarding wizard steps

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Charts:** Recharts
- **AI:** OpenAI API
- **Payments:** Stripe

## Design System

The app uses a dark theme with:
- **Primary:** Blue (#2563EB)
- **Background:** Dark navy (#0B1120, #020617)
- **Cards:** Rounded corners (16-20px)
- **Typography:** Inter font
- **Components:** Glassmorphism effects

## Tips

1. **All lint errors are expected** until you run `npm install`
2. **Test authentication** by creating an account
3. **Use Prisma Studio** to view your database visually
4. **The landing page** showcases the full product vision
5. **Protected routes** are handled by `middleware.ts`

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env`
- Make sure your Supabase database is running
- Run `npx prisma db push` to create tables

### Authentication Issues
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your dev server
- For Google OAuth, add credentials to Google Cloud Console

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (requires 18+)

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com)

## Support

For questions or issues:
- Check `PROJECT_STATUS.md` for implementation status
- Review the original spec in the chat
- All core functionality is documented in code comments

---

**Ready to build!** Start by running `npm install` and then `npm run dev`. The foundation is solid and ready for you to add the remaining features. 🚀
