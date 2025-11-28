# 🔧 Database Migration Required

## ⚠️ Chat History Won't Work Until You Run This

Your chat history sidebar is empty because the database table doesn't exist yet.

---

## 🚀 How to Fix (2 minutes)

### Step 1: Make sure your database is running
Check that your Supabase/PostgreSQL database is accessible.

### Step 2: Run the migration
```bash
npx prisma migrate dev --name add_chat_conversations
```

This will:
- ✅ Create the `chat_conversations` table
- ✅ Generate the Prisma client
- ✅ Fix all TypeScript errors
- ✅ Enable chat history

### Step 3: Restart your dev server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## ✅ After Migration

Your chat history will work:
- ✅ Conversations appear in sidebar
- ✅ Click to load old chats
- ✅ Delete conversations
- ✅ Auto-saves every message
- ✅ Persists across refreshes

---

## 🐛 If Migration Fails

### Error: "Can't reach database"
- Check your DATABASE_URL in `.env`
- Make sure Supabase project is running
- Check your internet connection

### Error: "Migration already exists"
```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev
```

### Still having issues?
```bash
# Force push schema to database
npx prisma db push
```

---

## 📊 What Gets Created

**Table: `chat_conversations`**
- `id` - Unique conversation ID
- `userId` - Who owns it
- `title` - Auto-generated from first message
- `messages` - JSON array of all messages
- `createdAt` - When created
- `updatedAt` - Last modified

---

## 🧪 Test After Migration

1. Go to `/coach`
2. Ask AI a question
3. Check sidebar - conversation should appear!
4. Click "New Chat"
5. Old chat stays in sidebar
6. Click old chat to reload it

**Everything should work perfectly!** 🎉
