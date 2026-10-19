# Peptide Certification Level 1

A static, dependency-free course site:

- **Register / sign in** (Supabase Auth, or a local demo mode when Supabase isn't configured)
- **7 lessons** — introduction & disclaimer, how peptides work (amino-acid chains, receptors, signaling), research vs. FDA-approved peptides, quality/sourcing/reconstitution & storage concepts, safety/contraindications/adverse events, the regulatory landscape (FDA, 503A/503B compounding, research-use-only labeling), and ethics & informed consent. Each lesson ends with **key takeaways** and a short, unscored **knowledge check**. Plus a searchable **glossary** (`#/glossary`). Education only — no dosing amounts or protocols.
- **Progress tracker**, dark biotech theme (glassmorphism, animated peptide-chain canvas that pauses when hidden and respects `prefers-reduced-motion`), Inter + Space Grotesk fonts, mobile-first
- **25-question multiple-choice assessment**, 80% (20/25) to pass, retakes allowed
- **Congratulations screen** and a **printable certificate** (name, date, unique certificate ID, Level 1)
- **Public verification page** (`verify.html?id=PC1-XXXX-XXXX-XXXX`)

```
index.html            App (hash-routed: #/login, #/register, #/dashboard, #/lessons, #/lesson/N, #/glossary, #/test, #/result, #/certificate)
verify.html           Public certificate lookup
assets/config.js      ← Supabase URL + anon key go here
assets/backend.js     Data layer (Supabase or localStorage demo)
assets/app.js         UI / routing
assets/lessons.js     Lesson content, takeaways, knowledge checks, glossary
assets/bg.js          Lightweight animated background (canvas)
assets/questions.js   Questions (no answers)
assets/styles.css     Styles incl. print stylesheet for the certificate
supabase/schema.sql   `peptide` schema: tables, RLS, grading + verification RPCs
vercel.json           Static hosting headers
```

## 1. Run locally (demo mode)

No build step. Serve the folder with any static server:

```bash
cd peptide-cert
python3 -m http.server 8080      # then open http://localhost:8080
```

With the placeholder values in `assets/config.js` the site runs in **local demo mode** (yellow banner): accounts, attempts and certificates live only in that browser's `localStorage`, and the verify page can only find certificates issued in the same browser. Demo mode is for previewing — it is not secure.

## 2. Supabase backend (shared project, isolated schema)

The live site uses the shared Supabase project **james-sites** (`oiousqgzqcjanikglkxl`). This app's data is kept in its **own Postgres schema `peptide`** so it cannot collide with the other apps in that project:

- `peptide.profiles`, `peptide.attempts`, `peptide.certificates`, `peptide.quiz_answer_key` — RLS on, **no grants to `anon`/`authenticated`**, schema not exposed to the Data API. The answer key is readable only by `postgres`/`service_role`.
- Public RPC wrappers (SECURITY DEFINER, `search_path = ''`, touch only `peptide.*`):
  - `peptide_get_profile()` — returns the profile, creating it lazily on first use (no trigger on `auth.users`)
  - `peptide_update_name(p_full_name)`
  - `peptide_submit_attempt(p_answers)` — grades **server-side**, records the attempt, issues the certificate at ≥ 80% (max 10 attempts/hour/user)
  - `peptide_list_attempts()`, `peptide_my_certificate()`
  - `peptide_verify_certificate(p_certificate_id)` — anon; returns only name, course, level, issue date, revoked
- `supabase/schema.sql` creates all of this and is safe to re-run (SQL Editor or migration).
- `assets/config.js` holds the project URL and the **anon** key (public by design). Never put the `service_role` key in this site.

**Auth is shared** with the other james-sites apps (same `auth.users`, same email settings, same Site URL). "Confirm email" is on, so new users must click the confirmation link before signing in. Add `https://platinum00001.github.io/peptide-cert/` under **Authentication → URL Configuration → Redirect URLs** (do not change the Site URL — other apps rely on it).

### Admin tasks (SQL Editor)

```sql
-- recent certificates
select certificate_id, full_name, issued_at, revoked from peptide.certificates order by issued_at desc;
-- revoke one
update peptide.certificates set revoked = true, revoked_reason = 'Issued in error' where certificate_id = 'PC1-XXXX-XXXX-XXXX';
```

### Editing questions

`assets/questions.js` holds question text/options (no answers). The key lives only in the database: the `insert into peptide.quiz_answer_key` block in `schema.sql` (0-based option index). Re-run that block after changes. The pass mark (80%) is set in `config.js` (`PASS_PERCENT`, display only) and in `peptide_submit_attempt` (`c_pass_percent`, authoritative).

## 3. Publish via GitHub + Vercel

1. Create a GitHub repo and push this folder:
   ```bash
   cd peptide-cert
   git init && git add . && git commit -m "Peptide Certification Level 1"
   git branch -M main
   git remote add origin https://github.com/<you>/peptide-cert.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repo. Framework preset **Other**, no build command, output directory `.` (root). Deploy.
3. Put the Vercel URL (or your custom domain) into Supabase **Site URL / Redirect URLs** (step 2.4).
4. Every push to `main` redeploys automatically.

(Any static host works — Netlify, Cloudflare Pages, GitHub Pages — since there is no build step.)

## Notes

- **Content**: educational overview only, no dosing, reconstitution or administration instructions. Regulatory content is a high-level, U.S.-focused summary that changes over time — have it reviewed by a qualified professional before launch and periodically afterwards.
- **Certificate name** is taken from the profile at the moment the certificate is issued and is not changed by later profile edits.
- **Lesson progress** (which lessons are marked complete) is stored in the browser; the server enforces only the test and certificate.
- **Printing**: the certificate page has a print stylesheet (US Letter landscape, one page). In the print dialog enable "Background graphics" for the seal colours. "Save as PDF" produces a shareable file.
- Supabase JS v2 loads from the jsDelivr CDN (`@supabase/supabase-js@2`). Pin an exact version in `index.html`/`verify.html` if you want fully reproducible builds.
