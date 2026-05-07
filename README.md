# CRM Application

A full-stack CRM Lead Management application for a small sales team. The app lets authenticated users manage sales leads, track each lead through a sales pipeline, add internal notes, and review basic dashboard metrics.

## Project Overview

This project was built for the full-stack CRM take-home assessment. It demonstrates:

- Frontend UI for login, dashboard, lead management, filtering, search, and notes
- Backend API routes for authentication, lead CRUD, lead notes, and dashboard metrics
- Persistent storage with Supabase Postgres
- Authentication with Supabase Auth
- Clear local setup and database setup instructions

## Tech Stack

- Frontend: React 18 via CDN, Tailwind CSS
- Backend: Node.js, Express.js
- Database: Supabase Postgres
- Authentication: Supabase Auth
- Local ports: backend `5000`, frontend `3000`

## Features Implemented

- Login and registration flow
- Protected CRM screens that require authentication
- Create, view, edit, and delete leads
- Lead fields: name, company, email, phone, source, assigned salesperson, status, estimated deal value, created date, and last updated date
- Lead statuses: New, Contacted, Qualified, Proposal Sent, Won, Lost
- Add notes to individual leads with author and created date
- Dashboard metrics for total leads, New, Qualified, Won, Lost, total estimated deal value, and won deal value
- Filter leads by status and lead source in the UI
- Backend support for filtering by assigned salesperson
- Search leads by lead name, company name, or email
- Supabase row level security policies for authenticated access

## Test Login Credentials

Use this test account for the demo:

```text
Email: admin@example.com
Password: password123
```

If the account does not exist yet, create it from the Register tab using the same email and password, or create it in Supabase Authentication. For the smoothest local demo, disable email confirmation in Supabase Auth settings so registration returns a usable session immediately.

## Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
PORT=5000
```

`SUPABASE_ANON_KEY` is also accepted by the server as a fallback if you prefer that variable name.

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the full contents of `supabase-schema.sql`.
4. In Supabase Authentication settings, turn off email confirmation for local testing, or manually confirm the test user after registration.
5. Create or register the demo user:
   - Email: `admin@example.com`
   - Password: `password123`

The schema creates:

```sql
public.users
public.leads
public.notes
```

It also adds indexes, a trigger that updates lead `updated_date`, and row level security policies for authenticated users.

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the backend API:

```bash
npm start
```

The API should run at:

```text
http://localhost:5000
```

Serve the frontend from the project root in a second terminal:

```bash
npx http-server -p 3000
```

Then open:

```text
http://localhost:3000
```

If `http-server` is not installed and you do not want `npx` to download it, use any static file server from the project root, such as:

```bash
python -m http.server 3000
```

## API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`

Leads:

- `GET /api/leads`
- `POST /api/leads`
- `GET /api/leads/:id`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

Notes:

- `GET /api/leads/:leadId/notes`
- `POST /api/leads/:leadId/notes`

Dashboard:

- `GET /api/dashboard`

## Demo Video Checklist

The assessment asks for a 5 to 10 minute demo video. The video should show:

- How to run the backend and frontend locally
- Login flow using the test credentials
- Dashboard metrics
- Creating a lead
- Editing a lead
- Updating lead status
- Adding notes to a lead
- Searching or filtering leads
- Brief explanation of the backend API and Supabase database

Demo video link: add the YouTube, Loom, or Google Drive link here before submission.

## Deployment Status

Deployed application link: not deployed yet.

If the app is deployed later, add the public URL here and confirm it works in an incognito/private browser window. Keep the test credentials in this README if login is required.

## Known Limitations

- All authenticated users can manage all leads and notes; there are no roles or per-user ownership rules yet.
- The UI currently filters by status and lead source. Assigned salesperson filtering is supported by the backend API but is not exposed as a UI control yet.
- Search is handled client-side after the filtered lead list is loaded.
- Email confirmation must be disabled or users must be manually confirmed in Supabase for immediate local login after registration.
- Automated tests are not included yet.
- The app is currently configured for local development rather than production deployment.

## Reflection

I focused on building a complete, runnable CRM workflow instead of only a static interface. Supabase was useful because it provided both Postgres persistence and authentication while still requiring real backend API design, token handling, table design, row level security, and error handling.

The most important product flow is the lead lifecycle: a sales user can log in, create a lead, update the lead as it moves through the pipeline, add notes after follow-ups, and see dashboard totals change as data changes. If I continued improving the project, I would add role-based access, salesperson ownership, server-side search, pagination, automated tests, and deployment-ready configuration.

## Submission Notes

Before submitting:

- Make the GitHub repository public.
- Add the demo video link above.
- Add a deployed application link if one is available, or leave the deployment note as not deployed.
- Test the repository, demo video, and deployment links in an incognito/private browser window.
- Confirm the test login credentials work.
