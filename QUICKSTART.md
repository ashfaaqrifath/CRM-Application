# Quick Start Guide

## Step 1: Setup
```bash
cd crm-app
npm install
```

## Step 2: Supabase Setup
1. Create a Supabase project.
2. Open the Supabase SQL editor and run the contents of `supabase-schema.sql`.
3. Copy `.env.example` to `.env`.
4. Fill in:
```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

## Step 3: Start Backend
```bash
npm start
```

You should see: `Server running on http://localhost:5000`

## Step 4: Open Frontend
In a new terminal, serve `index.html`:

```bash
npx http-server -p 3000
```

Then open: `http://localhost:3000`

## Login / Register
Use the Register tab to create an account. Turn off email confirmation in Supabase Auth so users can log in immediately.

## What You Can Do
- Create leads
- Edit/delete leads
- Update lead status
- Add notes to leads
- View dashboard
- Filter by status and source
- Search by name/company/email

## Troubleshooting

**Error: Cannot POST /api/auth/login**
- Backend not running. Run `npm start` in the project folder.

**Frontend shows blank**
- Make sure you're serving `index.html` from port 3000.
- Check the browser console for errors.

**Leads not saving**
- Check that the backend is running.
- Check that `.env` has your Supabase keys.
- Check the terminal where `npm start` is running for server errors.

**CORS errors**
- The backend is already configured with CORS enabled.
- Use separate ports for frontend and backend: frontend `3000`, backend `5000`.

## Files Breakdown
- `server.js` - Express API routes and Supabase calls
- `index.html` - Loads React, Tailwind, and app scripts
- `js/apiService.js` - Frontend API helper
- `js/components.js` - Reusable UI components
- `js/app.js` - Main app state and page logic
- `supabase-schema.sql` - Supabase table setup

## Data Persistence
Users, leads, and notes are stored in Supabase. Auth stores login accounts, and `public.users` stores each user's name/email profile. `db.json` is no longer used by the server.
