# Vidya Coachings — AI Mind Map

> **AI agents: Read this file first** before making any changes to this project.
> This is the single source of truth for architecture, routes, data, and workflows.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | Vidya Coachings |
| **Type** | Tuition centre website (Class 1–12) |
| **Location** | Badarpur & Jaitpur, Delhi |
| **Founder** | Amarpal Saini |
| **GitHub Repo** | `AKking5120/Vidya_Coachings` |
| **Live Deploy** | Vercel (SPA) |
| **Language** | React 19 + Vite (NOT plain HTML anymore) |

---

## 2. Tech Stack Mind Map

```
Vidya Coachings Website
├── Frontend: React 19 + Vite 6
├── Routing: React Router v7 (BrowserRouter)
├── Styling: CSS (style.css + gallery.css + downloads.css + global.css)
├── Database: Supabase (PostgreSQL)
│   ├── reviews table
│   ├── gallery_photos table
│   └── admin_config table (password)
├── Images (2 sources)
│   ├── Hardcoded → public/ folder (local paths)
│   └── Dynamic → GitHub raw URL (admin-added via Supabase)
└── Deploy: Vercel (vercel.json SPA rewrites required)
```

---

## 3. Routes Map

| URL | Page File | Purpose |
|-----|-----------|---------|
| `/` | `src/pages/Home.jsx` | Main site — hero, about, faculty, programs, reviews, contact |
| `/gallery` | `src/pages/Gallery.jsx` | Photo gallery with tabs (all/students/alumni/achievements) |
| `/downloads` | `src/pages/Downloads.jsx` | PDF notes & circulars download |
| `/teachers-day` | `src/pages/TeachersDay.jsx` | Teacher's Day tribute + teacher cards + photo gallery modal |
| `/admin` | `src/pages/Admin.jsx` | Admin panel — reviews approve, gallery photos add |

**Important:** All routes need `vercel.json` SPA rewrite or `/admin` gives 404 on Vercel.

---

## 4. Folder Structure

```
/workspace
├── index.html              ← Vite entry (NOT old static homepage)
├── vercel.json             ← SPA rewrites for Vercel (REQUIRED)
├── package.json
├── MINDMAP.md              ← THIS FILE (AI reads first)
├── README.md               ← Human setup guide
│
├── public/                 ← Static assets (served at /)
│   ├── logo.png
│   ├── photo/              ← 200+ hardcoded gallery photos
│   ├── teachers/           ← Teacher's Day photos
│   ├── achiment/           ← Achievement photos
│   ├── VC  Rising Stars/   ← Student photos
│   ├── downloads/          ← PDF files
│   └── aboutcontentphoto*.jpeg
│
├── src/
│   ├── main.jsx            ← React entry
│   ├── App.jsx             ← Routes definition
│   ├── components/
│   │   ├── Layout.jsx      ← Header + Footer wrapper
│   │   ├── Header.jsx      ← Nav links
│   │   ├── Footer.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── ReviewsSection.jsx
│   │   ├── ScrollTop.jsx
│   │   └── WhatsAppFloat.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── Downloads.jsx
│   │   ├── TeachersDay.jsx
│   │   └── Admin.jsx
│   ├── data/               ← Hardcoded content (edit here to add content)
│   │   ├── constants.js    ← Site info, social links, nav
│   │   ├── galleryData.js  ← 200+ general photos (HARDCODED)
│   │   ├── galleryHardcoded.js ← students/alumni/achievements
│   │   ├── downloadsData.js
│   │   ├── legacyReviews.js ← 79 old Google Sheet reviews
│   │   └── teachersDayData.js ← Teacher cards + photos
│   ├── lib/
│   │   ├── supabase.js     ← All DB + admin RPC calls
│   │   └── githubImages.js ← GitHub raw URL builder
│   └── styles/
│       ├── global.css      ← React overrides + imports old CSS
│       └── teachers-day.css
│
├── supabase/
│   └── schema.sql          ← Run once in Supabase SQL Editor
│
└── [LEGACY — do NOT use for new features]
    ├── gallery.html, downloads.html, index.html (old)
    ├── gallery.js, reviews.js, script.js
    └── style.css, gallery.css, downloads.css (still imported by React)
```

---

## 5. Data Flow Mind Map

### Reviews
```
User submits review (Home page)
    → Supabase INSERT reviews (approved=false)
    → Admin approves at /admin
    → Supabase RPC admin_approve_review
    → Approved reviews show on Home page
    + Legacy reviews always show (legacyReviews.js)
```

### Gallery Photos (2 types)
```
HARDCODED (keep as-is):
    galleryData.js + galleryHardcoded.js → local public/ paths

DYNAMIC (admin-added):
    Admin adds GitHub path → Supabase gallery_photos table
    → Gallery page fetches + loads from raw.githubusercontent.com
```

### Teacher Photos
```
public/teachers/photo.jpeg
    → teachersDayData.js photos: ['teachers/photo.jpeg']
    → Card click opens gallery modal
    ⚠️ NEVER use 'public/' in path — only 'teachers/filename.jpeg'
```

---

## 6. Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GITHUB_REPO=AKking5120/Vidya_Coachings   # optional
VITE_GITHUB_BRANCH=main                        # optional
```

Without these, reviews and admin panel won't work (page still loads).

---

## 7. Admin Panel

```
URL: /admin
Password: stored in Supabase admin_config table (key='password')
Default: change-me-vidya2026 (CHANGE THIS!)

Tabs:
├── Pending Reviews → approve / delete
├── Gallery Photos  → view dynamic photos
└── Add Photo       → enter GitHub path (e.g. photo/photo226.jpeg)
```

---

## 8. How To Add Content (Quick Reference)

| What to add | Where | Steps |
|-------------|-------|-------|
| Gallery photo (hardcoded) | `src/data/galleryData.js` | Put file in `public/photo/`, add `{ src: 'photo/x.jpeg', alt: '...', cat: 'general' }` |
| Student photo | `src/data/galleryHardcoded.js` | Put in `public/VC  Rising Stars/` |
| Download PDF | `src/data/downloadsData.js` | Put in `public/downloads/notes/` |
| Teacher photo | `src/data/teachersDayData.js` | Put in `public/teachers/`, add to `photos: ['teachers/name.jpeg']` |
| Dynamic gallery photo | Admin `/admin` | Upload to GitHub repo first, then add path in admin |
| New review | Auto | User submits on site, admin approves |

---

## 9. Known Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `/admin` 404 on Vercel | No SPA rewrite | Ensure `vercel.json` exists with rewrites |
| Orange lines on site | `gallery.css .section-title::before` conflict | Use `page-section-head` class, not `section-title` |
| Teacher photo broken | Path has `public/` prefix | Use `teachers/file.jpeg` NOT `public/teachers/file.jpeg` |
| Photo fails to load | File missing | `onError` falls back to avatar initials |
| Reviews not loading | Missing `.env` on Vercel | Add Supabase env vars in Vercel dashboard |
| Build fails legacyReviews | Missing file | `src/data/legacyReviews.js` must exist |

---

## 10. CSS Architecture

```
global.css
  ├── @import style.css      (main site styles)
  ├── @import gallery.css    (gallery + lightbox)
  ├── @import downloads.css
  ├── @import teachers-day.css
  └── React overrides (page-section-head, admin panel, modern cards)

⚠️ gallery.css .gallery-section-title has ::before orange bar
   → ONLY use on gallery page headings, NOT SectionTitle component
```

---

## 11. Component Dependency Map

```
App.jsx
└── Layout.jsx
    ├── Header.jsx (nav)
    ├── <Outlet> pages
    │   ├── Home.jsx
    │   │   └── ReviewsSection.jsx → supabase.js + legacyReviews.js
    │   ├── Gallery.jsx → galleryData + galleryHardcoded + supabase
    │   ├── Downloads.jsx → downloadsData.js
    │   ├── TeachersDay.jsx → teachersDayData.js + gallery modal
    │   └── Admin.jsx → supabase.js RPC functions
    ├── Footer.jsx
    ├── WhatsAppFloat.jsx
    └── ScrollTop.jsx
```

---

## 12. Supabase Tables

```sql
reviews          → id, name, role, rating, text, approved, created_at
gallery_photos   → id, github_path, alt, category, created_at
admin_config     → key, value (password stored here)

RPC functions (admin_key required):
  verify_admin_key, admin_get_pending_reviews, admin_approve_review,
  admin_delete_review, admin_add_gallery_photo, admin_delete_gallery_photo,
  admin_list_gallery_photos
```

Schema file: `supabase/schema.sql`

---

## 13. User Rules (Owner Preferences)

- **Hardcoded images** — existing gallery photos must stay hardcoded in `src/data/`
- **Hinglish OK** — owner communicates in Hindi+English mix
- **Simple changes** — don't over-engineer, minimal diffs
- **GitHub for new photos** — admin adds path, image lives in repo
- **Supabase for reviews** — replaced Google Sheets
- **Modern UI** — glass header, eyebrow section titles, no orange line artifacts

---

## 14. Commands

```bash
npm install          # install deps
npm run dev          # http://localhost:5173
npm run build        # output → dist/
npm run preview      # preview production build
```

---

## 15. Contact Info (Site)

- Phone: +91 98717 49012
- Email: vidyacoachings1@gmail.com
- WhatsApp: 919871749012
- Branches: Vidya 1.0, Vidya 2.0 (Main), Branch 3.0 — all Badarpur/Jaitpur Delhi

---

*Last updated: September 2026 | React migration complete*
