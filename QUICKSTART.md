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
