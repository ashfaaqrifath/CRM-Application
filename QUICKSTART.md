# Quick Start Guide

## 1. Install Dependencies

```bash
cd project root folder
npm install
```

## 2. Set Up Supabase

1. Create a Supabase project.
2. Open SQL Editor in Supabase.
3. Run the full contents of `supabase-schema.sql`.
4. In Authentication settings, disable email confirmation for local testing, or manually confirm registered users.
5. Create the required demo user by registering in the app or adding the user in Supabase Auth:

```text
Email: test1@gmail.com
Password: 123456
```

## 3. Create `.env`

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
PORT=5000
```

## 4. Start the Backend

```bash
npm start
```

Expected output:

```text
Server running on http://localhost:5000
```

## 5. Open the Frontend

In a second terminal, serve the frontend from the project root:

```bash
npx http-server -p 3000
```

Then open:

```text
http://localhost:3000 or http://127.0.0.1:3000
```

## Assessment Requirements Covered

- Authentication with test credentials
- Protected CRM screens after login
- Lead CRUD
- Lead status updates
- Lead notes
- Dashboard metrics
- Filtering by status and lead source
- Search by lead name, company, or email
- Supabase database persistence
- README with setup, environment variables, database setup, limitations, and reflection

## Demo Video Checklist

- Local setup and run commands
- Login with `test1@gmail.com` / `123456`
- Dashboard
- Creating a lead
- Editing a lead
- Updating lead status
- Adding notes
- Searching or filtering leads
- Backend API and Supabase database explanation
- `index.html` - Loads React, Tailwind, and frontend scripts
- `js/apiService.js` - Frontend API helper
- `js/components.js` - Reusable UI components
- `js/app.js` - Main app state and page logic
- `supabase-schema.sql` - Supabase tables, indexes, trigger, and RLS policies
- `README.md` - Full assessment-facing project documentation
