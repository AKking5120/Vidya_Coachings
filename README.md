# Vidya Coachings — React + Supabase

Modern React website for Vidya Coachings tuition centre with Supabase reviews and GitHub-hosted gallery photos.

## Features

- **React + Vite** — Fast, modern single-page app
- **Supabase** — Reviews stored in database (replaces Google Sheets)
- **Admin Panel** (`/admin`) — Approve reviews & add gallery photos via GitHub paths
- **GitHub Images** — New photos stored in repo; admin enters path, site loads from GitHub raw URL
- **Hardcoded Gallery** — All existing photos remain as-is in the codebase

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Change the default admin password in the SQL or update `admin_config` table:
   ```sql
   UPDATE admin_config SET value = 'your-secure-password' WHERE key = 'password';
   ```
4. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 4. Build for production

```bash
npm run build
```

Deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.

## Admin Panel

Visit `/admin` and login with your admin password (set in Supabase `admin_config` table).

### Adding a new photo

1. Upload the image file to your GitHub repo (e.g. `photo/photo226.jpeg`)
2. In Admin → **Add Photo**, enter the path: `photo/photo226.jpeg`
3. Select category and save — the gallery loads the image from GitHub automatically

### Approving reviews

1. Users submit reviews on the home page
2. Admin → **Pending Reviews** → click **Approve**
3. Approved reviews appear on the website

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Home, Gallery, Downloads, Admin
  data/           # Hardcoded gallery & downloads data
  lib/            # Supabase & GitHub image helpers
public/           # Static images (logo, photos, PDFs)
supabase/         # Database schema SQL
```

## Tech Stack

- React 19 + Vite
- React Router
- Supabase (PostgreSQL + RLS)
- Font Awesome + Google Fonts
