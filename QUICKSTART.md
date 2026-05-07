# Quick Start Guide

## 1. Install Dependencies

```bash
cd crm-app
npm install
```

## 2. Set Up Supabase

1. Create a Supabase project.
2. Open SQL Editor in Supabase.
3. Run the full contents of `supabase-schema.sql`.
4. In Authentication settings, disable email confirmation for local testing, or manually confirm registered users.
5. Create the required demo user by registering in the app or adding the user in Supabase Auth:

```text
Email: admin@example.com
Password: password123
```

## 3. Create `.env`

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
PORT=5000
```

`SUPABASE_ANON_KEY` can be used instead of `SUPABASE_PUBLISHABLE_KEY`.

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
http://localhost:3000
```

Alternative static server:

```bash
python -m http.server 3000
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

Record a 5 to 10 minute demo showing:

- Local setup and run commands
- Login with `admin@example.com` / `password123`
- Dashboard
- Creating a lead
- Editing a lead
- Updating lead status
- Adding notes
- Searching or filtering leads
- Backend API and Supabase database explanation

Add the demo video link to `README.md` before submission.

## Deployment Note

The app is not deployed yet. If you deploy it, add the public application link to `README.md` and test it in an incognito/private browser window.

## Troubleshooting

`Supabase is not configured`

Check that `.env` exists and contains `SUPABASE_URL` plus a Supabase publishable or anon key.

`Login failed`

Confirm the test user exists in Supabase Auth and is confirmed if email confirmation is enabled.

`Cannot POST /api/auth/login`

The backend is not running or the frontend is pointing at the wrong API URL. Start the backend with `npm start`.

Blank frontend page

Serve the project from the root folder and check the browser console for script errors.

Leads or notes do not save

Confirm the SQL schema was run, the backend is running, and Supabase row level security policies were created.

## File Breakdown

- `server.js` - Express API routes, Supabase Auth, and Supabase database calls
- `index.html` - Loads React, Tailwind, and frontend scripts
- `js/apiService.js` - Frontend API helper
- `js/components.js` - Reusable UI components
- `js/app.js` - Main app state and page logic
- `supabase-schema.sql` - Supabase tables, indexes, trigger, and RLS policies
- `README.md` - Full assessment-facing project documentation
