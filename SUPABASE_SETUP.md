# Supabase Setup Guide

This guide will help you set up Supabase for cross-device document synchronization in the Mobile Email Editor Demo.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose an organization and give your project a name like "mobile-editor-demo"
4. Set a database password (save this!)
5. Choose a region close to you
6. Click "Create new project"

## Step 2: Create the Documents Table

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query" 
3. Copy and paste this SQL:

```sql
-- Create the documents table
CREATE TABLE documents (
  id text PRIMARY KEY,
  name text NOT NULL,
  content jsonb NOT NULL,
  created timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now()
);

-- Enable Row Level Security (optional - disable for easy demo)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demo purposes
-- This allows anyone to read/write documents without authentication
CREATE POLICY "Allow anonymous access" ON documents FOR ALL USING (true);
```

4. Click "Run" to execute the SQL

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 4: Update the App Configuration

1. Open `utils/supabase.ts` in your project
2. Replace the placeholder values:

```typescript
const supabaseUrl = 'https://your-project.supabase.co'; // ← Your Project URL
const supabaseAnonKey = 'your-anon-key'; // ← Your Anon/Public Key
```

3. Save the file

## Step 5: Test the Integration

1. Run your app (locally or in Snack)
2. Check the browser console for Supabase connection logs
3. Edit a document and save it
4. Open the app on another device/browser - you should see the same changes!

## Verification

To verify everything is working:

1. **Check the database**: In Supabase dashboard → **Table Editor** → select `documents` table
2. **Check console logs**: Look for 🚀 💾 ✅ emoji logs indicating successful operations
3. **Test cross-device**: Edit on one device, reload on another

## Security Notes

- The current setup allows **anyone** to read/write documents (good for demos)
- For production, you'd want to add user authentication and restrict access
- The anon key is safe to expose in client-side code (it's designed for that)

## Troubleshooting

**Can't connect to Supabase?**
- Check your URL and key are correct
- Make sure the `documents` table exists
- Check the browser console for error messages

**Documents not syncing?**
- Verify the RLS policy is set to allow anonymous access
- Check network connectivity
- Look for error logs in the console

**Need help?**
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- The app will fallback to bundled documents if Supabase fails