# Vidya Coachings — React + Supabase

Modern React website for Vidya Coachings tuition centre with Supabase reviews and GitHub-hosted gallery photos.

## Features

- **React + Vite** — Fast, modern single-page app
- **Supabase** — Reviews stored in database (replaces Google Sheets)
- **Admin Panel** (`/admin`) — Approve reviews, add gallery photos, publish alerts & notices
- **Alerts & Notices** — Banner at top of site; manage from admin panel
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

## Deploy to Vercel

`vercel.json` is included — all routes (`/admin`, `/gallery`, `/teachers-day`, etc.) work correctly.

1. Connect repo to Vercel
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` — **free** key from [Google AI Studio](https://aistudio.google.com/apikey) (powers student doubt-solving bot)

Deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.

## Student Bot (AI Doubt Solver)

The **Vidya Study Buddy** chatbot (bottom-left on site) uses:

1. **Instant FAQ** — admission, branches, contact, Study Game
2. **Google Gemini (free tier)** — solves Math, Science, English doubts in Hinglish

### Setup Gemini (free)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create a free API key (no credit card for basic tier)
3. In **Vercel** → Project → Settings → Environment Variables:
   - Name: `GEMINI_API_KEY`
   - Value: your key
4. Redeploy the site

> **Important:** Never put `GEMINI_API_KEY` in `.env` with `VITE_` prefix — it would be exposed in the browser. The key stays server-side in `/api/student-chat`.

For local API testing, run `npx vercel dev` (not just `npm run dev`).

## Admin Panel

Visit **`/admin`** on your website (e.g. `https://yoursite.com/admin`).

### Login steps

1. Open `/admin` in browser
2. Enter your **admin password** (set in Supabase `admin_config` table)
3. Default password after running schema: `change-me-vidya2026` — change it immediately:
   ```sql
   UPDATE admin_config SET value = 'your-secure-password' WHERE key = 'password';
   ```

### What you can do in Admin

| Tab | Action |
|-----|--------|
| **Pending Reviews** | Approve or delete student/parent reviews |
| **Gallery Photos** | View admin-added photos (from GitHub) |
| **Add Photo** | Add new gallery photo by GitHub path |

### Adding teacher photos (Teacher's Day page)

1. Add image to `public/teachers/` folder (e.g. `amarpal-saini.jpg`)
2. Edit `src/data/teachersDayData.js` — set `photo: 'teachers/amarpal-saini.jpg'` for that teacher
3. Rebuild and deploy

## Teacher's Day Page

Visit **`/teachers-day`** — tribute page with teacher cards showing subject, best quality, and tribute line.

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
