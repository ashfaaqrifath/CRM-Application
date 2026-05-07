# CRM Application

## Overview

This project was built for the full-stack CRM take-home assessment. It demonstrates:

- Frontend UI for login, dashboard, lead management, filtering, search, and notes
- Backend API routes for authentication, lead CRUD, lead notes, and dashboard metrics
- Persistent storage with Supabase
- Authentication with Supabase Auth
- Clear local setup and database setup instructions

## Tech Stack

- Frontend: React 18, Tailwind CSS
- Backend: Node.js, Express.js
- Database: Supabase
- Local ports: backend `5000`, frontend `3000`

## Features Implemented

- Login and registration
- Protected CRM screens that require authentication
- Create, view, edit, and delete leads
- Lead fields: name, company, email, phone, source, assigned salesperson, status, deal value, created date, and last updated date
- Lead statuses: New, Contacted, Qualified, Proposal Sent, Won, Lost
- Add notes to individual leads with author and created date
- Dashboard metrics for total leads, New, Qualified, Won, Lost, total estimated deal value, and won deal value
- Filter leads by status and lead source in the UI
- Backend support for filtering by assigned salesperson
- Search leads by lead name, company name, or email
- Supabase row level security policies for authenticated access


Create account from the Register tab using email and password. For the smoothest local demo, disable email confirmation in Supabase Auth settings so registration returns a usable session immediately.

## Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
PORT=5000
```

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Copy paste and run the full contents of `supabase-schema.sql`.
4. In Supabase Authentication settings, turn off email confirmation for local testing, or manually confirm the test user after registration.
5. Create the demo user:

The sql schema creates:

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
http://localhost:3000 or http://127.0.0.1:3000
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

- How to run the backend and frontend locally
- Login flow using the test credentials
- Dashboard metrics
- Creating a lead
- Editing a lead
- Updating lead status
- Adding notes to a lead
- Searching or filtering leads
- Brief explanation of the backend and database

Demo video link: https://drive.google.com/file/d/1BK5yVZj9gQFs18cbZ5aYYV7Rn7AQfPdy/view?usp=drive_link

Application not deployed


## Known Limitations

- All authenticated users can manage all leads and notes; there are no roles or per-user ownership rules yet.
- Email confirmation must be disabled or users must be manually confirmed in Supabase for immediate local login after registration.
- The app is currently configured for local deployment.

## Reflection

I focused on building a complete, runnable CRM workflow instead of only a static interface. Supabase was useful because it provided both Postgres persistence and authentication while still requiring real backend API design, token handling, table design, row level security, and error handling.

The most important product flow is the lead lifecycle. A sales user can log in, create a lead, update the lead as it moves through the pipeline, add notes after follow ups, and see dashboard totals change as data changes.
