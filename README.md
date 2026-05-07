# CRM Lead Management System

A full-stack Lead Management CRM application for small sales teams to track leads, manage their progress through a sales pipeline, add notes, and view dashboard metrics.

## Tech Stack

- **Frontend**: React 18 via CDN, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **Ports**: 5000 backend, 3000 frontend

## Features

- Register and log in with Supabase Auth
- Save registered user details in the database
- Create, read, update, and delete leads
- Track lead status: New, Contacted, Qualified, Proposal Sent, Won, Lost
- Add notes to individual leads
- View dashboard totals and deal values
- Search and filter leads by status, source, name, company, or email

## How to Run Locally

### Prerequisites

- Node.js v20+
- npm
- A Supabase project

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the Supabase tables:
   - Open your Supabase project.
   - Go to SQL Editor.
   - Run the contents of `supabase-schema.sql`.

3. Configure environment variables:
   ```bash
   copy .env.example .env
   ```

   Fill in `.env`:
   ```bash
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
   PORT=5000
   ```

4. Start the backend:
   ```bash
   npm start
   ```

5. Serve the frontend from the project folder:
   ```bash
   npx http-server -p 3000
   ```

   Then open `http://localhost:3000`.

## Login / Register

Use the Register tab to create a new account. For this simple project, turn off email confirmation in Supabase Auth so registration logs in immediately.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get a Supabase access token

### Leads

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a lead
- `GET /api/leads/:id` - Get one lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Notes

- `GET /api/leads/:leadId/notes` - Get notes for a lead
- `POST /api/leads/:leadId/notes` - Add a note to a lead

### Dashboard

- `GET /api/dashboard` - Get dashboard metrics

## Database

The backend uses Supabase tables:

```sql
public.leads (
  id, name, company, email, phone, source, salesperson,
  status, deal_value, created_date, updated_date
)

public.notes (
  id, lead_id, content, created_by, created_date
)

public.users (
  id, name, email, created_date
)
```

Supabase Auth handles passwords/sessions. The `public.users` table stores each user's CRM profile details.

## Notes

- All authenticated users currently have full CRM access.
- Search is still client-side.
- Pagination and role-based access are good next production steps.
