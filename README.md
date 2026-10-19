# Peptide Certification Level 1

A static, dependency-free course site:

- **Register / sign in** (Supabase Auth, or a local demo mode when Supabase isn't configured)
- **7 lessons** — what peptides are, common categories, storage & handling basics, safety, regulations, informed consent, plus a clear *education-only / not medical advice* disclaimer. No dosing instructions.
- **25-question multiple-choice assessment**, 80% (20/25) to pass, retakes allowed
- **Congratulations screen** and a **printable certificate** (name, date, unique certificate ID, Level 1)
- **Public verification page** (`verify.html?id=PC1-XXXX-XXXX-XXXX`)

```
index.html            App (hash-routed: #/login, #/register, #/dashboard, #/lessons, #/lesson/N, #/test, #/result, #/certificate)
verify.html           Public certificate lookup
assets/config.js      ← Supabase URL + anon key go here
assets/backend.js     Data layer (Supabase or localStorage demo)
assets/app.js         UI / routing
assets/lessons.js     Lesson content
assets/questions.js   Questions (no answers)
assets/answer-key.js  Answer key — demo mode only (loaded on demand)
assets/styles.css     Styles incl. print stylesheet for the certificate
supabase/schema.sql   Tables, RLS, grading + verification functions
vercel.json           Static hosting headers
```

## 1. Run locally (demo mode)

No build step. Serve the folder with any static server:

```bash
cd peptide-cert
python3 -m http.server 8080      # then open http://localhost:8080
```

With the placeholder values in `assets/config.js` the site runs in **local demo mode** (yellow banner): accounts, attempts and certificates live only in that browser's `localStorage`, and the verify page can only find certificates issued in the same browser. Demo mode is for previewing — it is not secure.

## 2. Connect Supabase

1. Create a project at <https://supabase.com> (free tier is fine).
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**. It is safe to re-run.
   It creates:
   - `profiles`, `attempts`, `certificates` (RLS on; users can read only their own rows)
   - `private.quiz_answer_key` (not exposed through the API)
   - `submit_attempt(p_answers)` — grades **server-side**, records the attempt, issues the certificate at ≥ 80% (max 10 attempts/hour/user)
   - `verify_certificate(p_certificate_id)` — public lookup returning only name, course, level, issue date and revoked status
   - a trigger that creates a profile on sign-up from the `full_name` entered on the register form
3. **Project Settings → API**: copy the **Project URL** and the **anon public** key into `assets/config.js`:
   ```js
   SUPABASE_URL: "https://abcd1234.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGciOi...",
   ```
   The anon key is meant to be public. **Never** put the `service_role` key in this site.
4. **Authentication → URL Configuration**: set **Site URL** to your live URL (e.g. `https://peptide-cert.vercel.app`) and add it (plus `http://localhost:8080` for testing) to **Redirect URLs**. This is used by email-confirmation and password-reset links.
5. **Authentication → Providers → Email**: keep it enabled. "Confirm email" on is recommended (users confirm, then sign in). Supabase's built-in mailer is heavily rate-limited — for real use, configure custom SMTP under **Authentication → SMTP Settings**.
6. Optional hardening: once Supabase is connected you can delete `assets/answer-key.js` (it is never loaded in Supabase mode, but deleting it keeps answers off the public site).

### Admin tasks (SQL Editor)

```sql
-- recent certificates
select certificate_id, full_name, issued_at, revoked from public.certificates order by issued_at desc;
-- revoke one
update public.certificates set revoked = true, revoked_reason = 'Issued in error' where certificate_id = 'PC1-XXXX-XXXX-XXXX';
```

### Editing questions

`assets/questions.js` holds question text/options; the key is in two places that must match: `assets/answer-key.js` (demo) and the `insert into private.quiz_answer_key` block in `schema.sql` (0-based option index). Re-run that insert after changes. The pass mark (80%) is set in `config.js` (`PASS_PERCENT`, display + demo) and in `submit_attempt` (`c_pass_percent`, authoritative).

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
