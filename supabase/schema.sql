-- =====================================================================
-- Peptide Certification Level 1 — Supabase schema
-- Run this whole file once in the Supabase SQL Editor (safe to re-run).
--
-- Tables (public, RLS enabled):
--   profiles      one row per auth user (full name used on certificate)
--   attempts      every test attempt (written only by submit_attempt)
--   certificates  one certificate per user (written only by submit_attempt)
-- Private:
--   private.quiz_answer_key  answer key; never exposed to the API
-- Functions (RPC):
--   submit_attempt(p_answers jsonb)        authenticated users — grades server-side
--   verify_certificate(p_certificate_id)   anyone (anon) — public lookup
-- =====================================================================

-- ---------- Private schema for the answer key ----------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.quiz_answer_key (
  question_no   int primary key check (question_no between 1 and 100),
  correct_index int not null check (correct_index between 0 and 9)
);
revoke all on private.quiz_answer_key from public, anon, authenticated;

-- Answer key (0-based option index, matching assets/questions.js).
-- If you edit questions.js, update these rows to match.
insert into private.quiz_answer_key (question_no, correct_index) values
  (1, 0),
  (2, 1),
  (3, 2),
  (4, 3),
  (5, 1),
  (6, 0),
  (7, 1),
  (8, 2),
  (9, 0),
  (10, 1),
  (11, 3),
  (12, 0),
  (13, 1),
  (14, 2),
  (15, 1),
  (16, 0),
  (17, 1),
  (18, 2),
  (19, 3),
  (20, 1),
  (21, 2),
  (22, 0),
  (23, 3),
  (24, 1),
  (25, 0)
on conflict (question_no) do update set correct_index = excluded.correct_index;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null check (char_length(btrim(full_name)) between 1 and 120),
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- attempts ----------
create table if not exists public.attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  score      int  not null check (score >= 0),
  total      int  not null check (total > 0),
  percent    numeric(5,2) not null,
  passed     boolean not null,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_id_idx on public.attempts (user_id, created_at desc);

-- ---------- certificates ----------
create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  certificate_id text not null unique check (certificate_id ~ '^PC1-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$'),
  user_id        uuid not null unique references auth.users (id) on delete cascade,
  attempt_id     uuid references public.attempts (id) on delete set null,
  full_name      text not null,
  course         text not null default 'Peptide Certification Level 1',
  level          text not null default 'Level 1',
  score_percent  numeric(5,2) not null,
  issued_at      timestamptz not null default now(),
  revoked        boolean not null default false,
  revoked_reason text
);

-- ---------- Row Level Security ----------
alter table public.profiles     enable row level security;
alter table public.attempts     enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: read own"   on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: insert own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Attempts and certificates are read-only to their owner. There are no
-- insert/update/delete policies: rows are written only by the
-- SECURITY DEFINER function submit_attempt(), so scores cannot be forged.
drop policy if exists "attempts: read own" on public.attempts;
create policy "attempts: read own" on public.attempts for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "certificates: read own" on public.certificates;
create policy "certificates: read own" on public.certificates for select to authenticated using ((select auth.uid()) = user_id);

-- Column-level hardening: users may only change their display name.
revoke all on public.profiles, public.attempts, public.certificates from anon;
revoke insert, update, delete on public.attempts, public.certificates from authenticated;
revoke update on public.profiles from authenticated;
grant select, insert on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select on public.attempts, public.certificates to authenticated;

-- ---------- updated_at trigger ----------
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- ---------- Create a profile automatically on sign-up ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(btrim(left(new.raw_user_meta_data ->> 'full_name', 120)), ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Certificate ID generator: PC1-XXXX-XXXX-XXXX ----------
create or replace function private.new_certificate_id()
returns text language plpgsql set search_path = '' as $$
declare
  h text;
  candidate text;
begin
  loop
    h := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
    candidate := 'PC1-' || substr(h, 1, 4) || '-' || substr(h, 5, 4) || '-' || substr(h, 9, 4);
    exit when not exists (select 1 from public.certificates c where c.certificate_id = candidate);
  end loop;
  return candidate;
end;
$$;
revoke all on function private.new_certificate_id() from public, anon, authenticated;

-- ---------- submit_attempt: server-side grading ----------
create or replace function public.submit_attempt(p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid      uuid := auth.uid();
  v_total    int;
  v_score    int;
  v_percent  numeric(5,2);
  v_passed   boolean;
  v_attempt  uuid;
  v_name     text;
  v_cert     public.certificates;
  c_pass_percent constant int := 80;
  c_max_attempts_per_hour constant int := 10;
begin
  if v_uid is null then
    raise exception 'You must be signed in to submit the test.' using errcode = '28000';
  end if;

  select count(*) into v_total from private.quiz_answer_key;

  if p_answers is null or jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) <> v_total then
    raise exception 'Please answer all % questions.', v_total using errcode = '22023';
  end if;

  if (select count(*) from public.attempts a
       where a.user_id = v_uid and a.created_at > now() - interval '1 hour') >= c_max_attempts_per_hour then
    raise exception 'Too many attempts. Please wait a while and review the lessons before trying again.' using errcode = '54000';
  end if;

  select count(*) into v_score
  from private.quiz_answer_key k
  where p_answers -> (k.question_no - 1) = to_jsonb(k.correct_index);

  v_percent := round(v_score * 100.0 / v_total, 2);
  v_passed  := v_score * 100 >= c_pass_percent * v_total;

  insert into public.attempts (user_id, score, total, percent, passed, answers)
  values (v_uid, v_score, v_total, v_percent, v_passed, p_answers)
  returning id into v_attempt;

  if v_passed then
    select * into v_cert from public.certificates c where c.user_id = v_uid;
    if not found then
      select coalesce(p.full_name, 'Course Participant') into v_name from public.profiles p where p.id = v_uid;
      insert into public.certificates (certificate_id, user_id, attempt_id, full_name, score_percent)
      values (private.new_certificate_id(), v_uid, v_attempt, coalesce(v_name, 'Course Participant'), v_percent)
      returning * into v_cert;
    end if;
  end if;

  return jsonb_build_object(
    'attempt_id', v_attempt,
    'score', v_score,
    'total', v_total,
    'percent', v_percent,
    'passed', v_passed,
    'certificate', case when v_cert.id is null then null else jsonb_build_object(
      'certificate_id', v_cert.certificate_id,
      'full_name', v_cert.full_name,
      'course', v_cert.course,
      'level', v_cert.level,
      'score_percent', v_cert.score_percent,
      'issued_at', v_cert.issued_at,
      'revoked', v_cert.revoked) end
  );
end;
$$;
revoke all on function public.submit_attempt(jsonb) from public, anon;
grant execute on function public.submit_attempt(jsonb) to authenticated;

-- ---------- verify_certificate: public lookup by ID ----------
-- Returns only what is printed on the certificate (no email, no user id).
create or replace function public.verify_certificate(p_certificate_id text)
returns table (certificate_id text, full_name text, course text, level text, issued_at timestamptz, revoked boolean)
language sql stable security definer set search_path = '' as $$
  select c.certificate_id, c.full_name, c.course, c.level, c.issued_at, c.revoked
  from public.certificates c
  where c.certificate_id = upper(btrim(p_certificate_id))
  limit 1;
$$;
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ---------- Admin helpers (run manually in SQL Editor as needed) ----------
-- Revoke a certificate:
--   update public.certificates set revoked = true, revoked_reason = '...' where certificate_id = 'PC1-XXXX-XXXX-XXXX';
-- List recent certificates:
--   select certificate_id, full_name, issued_at, revoked from public.certificates order by issued_at desc;
