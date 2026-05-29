# Admin Panel Setup (Gallery + Downloads)

Admin panel se aap **photos** aur **notes/circulars (PDF)** website par add kar sakte ho — bina `downloads.js` ya `gallery.html` edit kiye.

---

## Step 1: Google Sheet

1. Apna Reviews wala Sheet use kar sakte ho, ya naya Sheet banao.
2. URL se **Sheet ID** copy karo:  
   `https://docs.google.com/spreadsheets/d/ **SHEET_ID** /edit`
3. Script khud **Gallery** aur **Downloads** tabs bana lega.

---

## Step 2: Google Apps Script

1. [script.google.com](https://script.google.com) → **New project**
2. File `Code.gs` ki jagah paste karo:  
   `google-apps-script/ContentBackend.gs`
3. Edit karo:
   - `SPREADSHEET_ID` = apna Sheet ID
   - `ADMIN_KEY` = strong password (ye admin login password hai)
   - `UPLOAD_FOLDER_ID` (optional) = Drive folder ID jahan files save hon
4. **Save** → **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. **Deploy** → **Web app URL** copy karo

---

## Step 3: Website config

`config.js` mein paste karo:

```javascript
window.VIDYA_CONFIG = {
    CMS_API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    ADMIN_KEY: 'same-as-ADMIN_KEY-in-script'
};
```

**Important:** `CMS_API_URL` aur `ADMIN_KEY` dono set karo. Password `ContentBackend.gs` wala `ADMIN_KEY` hona chahiye.

---

## Step 4: Admin panel use karo

1. Site **Live Server** se chalao (VS Code extension).
2. Browser mein kholo: **`admin.html`**
3. Admin password daalo → Login
4. **Gallery** tab: photo upload + category (Students / Alumni / Achievements)
5. **Downloads** tab: PDF upload + Notes ya Circular

**Publish:** “Show on website immediately” checked = turant site par dikhega.  
Uncheck = Sheet mein `pending` — baad mein **Publish** button se live karo.

---

## Kya site par dikhega?

| Feature | Behaviour |
|--------|-----------|
| **Gallery** | Purani static photos + admin se nayi photos (upar dikhengi) |
| **Downloads** | Sirf admin / CMS se add ki files (sample PDFs hata diye gaye) |

---

## Security notes

- `admin.html` ko public nav mein mat daalo — sirf aapko link ya bookmark rakho.
- `ADMIN_KEY` strong rakho; kabhi GitHub par public mat karo.
- Reviews ke liye alag script URL hai — CMS ke liye naya deploy URL use karo.

---

## Problems?

| Problem | Fix |
|--------|-----|
| Login fail | `ADMIN_KEY` script aur password same hon |
| Upload fail | File size chhota karo (photo 5MB, PDF 8MB) |
| Site par nahi dikhta | “Publish” / auto-approve on; script **Anyone** deploy |
| CORS / network error | Web app dubara deploy; Live Server use karo |

Debug: Browser mein kholo  
`YOUR_CMS_URL?action=gallery`  
— JSON array aana chahiye.
