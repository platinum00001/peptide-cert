/*
 * Peptide Certification Level 1 — site configuration
 * ---------------------------------------------------
 * Supabase project: james-sites (shared). This app's data lives in the
 * separate `peptide` Postgres schema, reached via public.peptide_* RPCs.
 *
 * While these are left as placeholders the site runs in LOCAL DEMO MODE:
 * accounts, attempts and certificates are stored only in this browser's
 * localStorage and nothing is sent to a server.
 *
 * The anon key is designed to be public. Never put the service_role key here.
 */
window.PC1_CONFIG = {
  SUPABASE_URL: "https://oiousqgzqcjanikglkxl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pb3VzcWd6cWNqYW5pa2dsa3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMTI3NjEsImV4cCI6MjEwNzg4ODc2MX0.1xcTKCcgQPs5Xw-P_Rxq3rj9k3BdewGTElYZTMVsqIE",

  COURSE_NAME: "Peptide Certification Level 1",
  ISSUER_NAME: "Peptide Certification Program",
  PASS_PERCENT: 80
};
