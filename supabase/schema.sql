-- =====================================================================
-- Peptide Certification Level 1 — Supabase schema (isolated `peptide` schema)
--
-- Designed to live inside a SHARED Supabase project (james-sites) next to
-- other apps. Everything this app owns is either:
--   * inside the dedicated Postgres schema  `peptide`, or
--   * a thin public RPC wrapper whose name starts with  `peptide_`.
-- It does NOT touch public tables, does NOT add any trigger on auth.users,
-- and never modifies other apps' objects. Safe to re-run.
--
-- Schema `peptide` (NOT exposed to the Data API; no grants to anon/authenticated):
--   peptide.profiles         one row per auth user, created lazily on first RPC call
--   peptide.attempts         every test attempt (written only by submit_attempt)
--   peptide.certificates     one certificate per user
--   peptide.quiz_answer_key  answer key — readable only by postgres/service_role
--
-- Public RPCs (SECURITY DEFINER, search_path = '', only touch schema peptide):
--   peptide_get_profile()                       authenticated
--   peptide_update_name(p_full_name text)       authenticated
--   peptide_submit_attempt(p_answers jsonb)     authenticated — grades server-side
--   peptide_list_attempts()                     authenticated
--   peptide_my_certificate()                    authenticated
--   peptide_verify_certificate(p_certificate_id text)   anon + authenticated
-- =====================================================================

create schema if not exists peptide;
revoke all on schema peptide from public, anon, authenticated;
grant usage on schema peptide to service_role;

-- ---------- answer key ----------
create table if not exists peptide.quiz_answer_key (
  question_no   int primary key check (question_no between 1 and 100),
  correct_index int not null check (correct_index between 0 and 9)
);

-- Answer key (0-based option index, matching assets/questions.js).
-- If you edit questions.js, update these rows to match and re-run this block.
insert into peptide.quiz_answer_key (question_no, correct_index) values
  (1, 0), (2, 2), (3, 1), (4, 3), (5, 0),
  (6, 3), (7, 1), (8, 2), (9, 0), (10, 1),
  (11, 2), (12, 3), (13, 0), (14, 1), (15, 2),
  (16, 3), (17, 0), (18, 1), (19, 2), (20, 0),
  (21, 3), (22, 1), (23, 2), (24, 3), (25, 0)
on conflict (question_no) do update set correct_index = excluded.correct_index;
delete from peptide.quiz_answer_key where question_no > 25;

-- ---------- profiles ----------
create table if not exists peptide.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null check (char_length(btrim(full_name)) between 1 and 120),
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- attempts ----------
create table if not exists peptide.attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  score      int  not null check (score >= 0),
  total      int  not null check (total > 0),
  percent    numeric(5,2) not null,
  passed     boolean not null,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_id_idx on peptide.attempts (user_id, created_at desc);

-- ---------- certificates ----------
create table if not exists peptide.certificates (
  id             uuid primary key default gen_random_uuid(),
  certificate_id text not null unique check (certificate_id ~ '^PC1-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$'),
  user_id        uuid not null unique references auth.users (id) on delete cascade,
  attempt_id     uuid references peptide.attempts (id) on delete set null,
  full_name      text not null,
  course         text not null default 'Peptide Certification Level 1',
  level          text not null default 'Level 1',
  score_percent  numeric(5,2) not null,
  issued_at      timestamptz not null default now(),
  revoked        boolean not null default false,
  revoked_reason text
);
create index if not exists certificates_attempt_id_idx on peptide.certificates (attempt_id);

-- ---------- Lock down: RLS on, no policies, no grants for API roles ----------
-- All access goes through the SECURITY DEFINER RPCs below.
alter table peptide.quiz_answer_key enable row level security;
alter table peptide.profiles        enable row level security;
alter table peptide.attempts        enable row level security;
alter table peptide.certificates    enable row level security;
revoke all on all tables in schema peptide from public, anon, authenticated;
revoke all on all sequences in schema peptide from public, anon, authenticated;
revoke all on all functions in schema peptide from public, anon, authenticated;
grant all on all tables in schema peptide to service_role;

-- ---------- internal helpers (schema peptide, not callable by API roles) ----------
create or replace function peptide.ensure_profile()
returns peptide.profiles language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_row peptide.profiles;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '28000';
  end if;
  select * into v_row from peptide.profiles p where p.id = v_uid;
  if not found then
    insert into peptide.profiles (id, full_name, email)
    select u.id,
           coalesce(nullif(btrim(left(u.raw_user_meta_data ->> 'full_name', 120)), ''), split_part(u.email, '@', 1), 'Course Participant'),
           u.email
    from auth.users u where u.id = v_uid
    on conflict (id) do nothing;
    select * into v_row from peptide.profiles p where p.id = v_uid;
  end if;
  return v_row;
end;
$$;

create or replace function peptide.new_certificate_id()
returns text language plpgsql set search_path = '' as $$
declare
  h text;
  candidate text;
begin
  loop
    h := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
    candidate := 'PC1-' || substr(h, 1, 4) || '-' || substr(h, 5, 4) || '-' || substr(h, 9, 4);
    exit when not exists (select 1 from peptide.certificates c where c.certificate_id = candidate);
  end loop;
  return candidate;
end;
$$;

revoke all on function peptide.ensure_profile() from public, anon, authenticated;
revoke all on function peptide.new_certificate_id() from public, anon, authenticated;

-- =====================================================================
-- Public RPC wrappers (prefix peptide_) — the only API surface of this app
-- =====================================================================

-- Profile (created lazily on first call; no auth.users trigger needed)
create or replace function public.peptide_get_profile()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v peptide.profiles;
begin
  v := peptide.ensure_profile();
  return jsonb_build_object('id', v.id, 'email', v.email, 'full_name', v.full_name);
end;
$$;

create or replace function public.peptide_update_name(p_full_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v peptide.profiles;
  v_name text := btrim(left(coalesce(p_full_name, ''), 120));
begin
  if char_length(v_name) < 1 then
    raise exception 'Please enter your full name.' using errcode = '22023';
  end if;
  v := peptide.ensure_profile();
  update peptide.profiles set full_name = v_name, updated_at = now() where id = v.id
  returning * into v;
  return jsonb_build_object('id', v.id, 'email', v.email, 'full_name', v.full_name);
end;
$$;

-- Server-side grading
create or replace function public.peptide_submit_attempt(p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_prof     peptide.profiles;
  v_uid      uuid;
  v_total    int;
  v_score    int;
  v_percent  numeric(5,2);
  v_passed   boolean;
  v_attempt  uuid;
  v_cert     peptide.certificates;
  c_pass_percent constant int := 80;
  c_max_attempts_per_hour constant int := 10;
begin
  v_prof := peptide.ensure_profile();   -- raises if not signed in
  v_uid  := v_prof.id;

  select count(*) into v_total from peptide.quiz_answer_key;

  if p_answers is null or jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) <> v_total then
    raise exception 'Please answer all % questions.', v_total using errcode = '22023';
  end if;

  if (select count(*) from peptide.attempts a
       where a.user_id = v_uid and a.created_at > now() - interval '1 hour') >= c_max_attempts_per_hour then
    raise exception 'Too many attempts. Please wait a while and review the lessons before trying again.' using errcode = '54000';
  end if;

  select count(*) into v_score
  from peptide.quiz_answer_key k
  where p_answers -> (k.question_no - 1) = to_jsonb(k.correct_index);

  v_percent := round(v_score * 100.0 / v_total, 2);
  v_passed  := v_score * 100 >= c_pass_percent * v_total;

  insert into peptide.attempts (user_id, score, total, percent, passed, answers)
  values (v_uid, v_score, v_total, v_percent, v_passed, p_answers)
  returning id into v_attempt;

  if v_passed then
    select * into v_cert from peptide.certificates c where c.user_id = v_uid;
    if not found then
      insert into peptide.certificates (certificate_id, user_id, attempt_id, full_name, score_percent)
      values (peptide.new_certificate_id(), v_uid, v_attempt, coalesce(v_prof.full_name, 'Course Participant'), v_percent)
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

create or replace function public.peptide_list_attempts()
returns table (id uuid, score int, total int, percent numeric, passed boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.' using errcode = '28000';
  end if;
  return query
    select a.id, a.score, a.total, a.percent, a.passed, a.created_at
    from peptide.attempts a where a.user_id = auth.uid()
    order by a.created_at desc;
end;
$$;

create or replace function public.peptide_my_certificate()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v peptide.certificates;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.' using errcode = '28000';
  end if;
  select * into v from peptide.certificates c where c.user_id = auth.uid();
  if not found then return null; end if;
  return jsonb_build_object(
    'certificate_id', v.certificate_id, 'full_name', v.full_name, 'level', v.level,
    'course', v.course, 'score_percent', v.score_percent, 'issued_at', v.issued_at, 'revoked', v.revoked);
end;
$$;

-- Public lookup by certificate ID: only what is printed on the certificate.
create or replace function public.peptide_verify_certificate(p_certificate_id text)
returns table (certificate_id text, full_name text, course text, level text, issued_at timestamptz, revoked boolean)
language sql stable security definer set search_path = '' as $$
  select c.certificate_id, c.full_name, c.course, c.level, c.issued_at, c.revoked
  from peptide.certificates c
  where c.certificate_id = upper(btrim(p_certificate_id))
  limit 1;
$$;

-- ---------- Grants (public schema default-grants EXECUTE to anon; undo that) ----------
revoke all on function public.peptide_get_profile()             from public, anon;
revoke all on function public.peptide_update_name(text)         from public, anon;
revoke all on function public.peptide_submit_attempt(jsonb)     from public, anon;
revoke all on function public.peptide_list_attempts()           from public, anon;
revoke all on function public.peptide_my_certificate()          from public, anon;
revoke all on function public.peptide_verify_certificate(text)  from public;
grant execute on function public.peptide_get_profile()            to authenticated, service_role;
grant execute on function public.peptide_update_name(text)        to authenticated, service_role;
grant execute on function public.peptide_submit_attempt(jsonb)    to authenticated, service_role;
grant execute on function public.peptide_list_attempts()          to authenticated, service_role;
grant execute on function public.peptide_my_certificate()         to authenticated, service_role;
grant execute on function public.peptide_verify_certificate(text) to anon, authenticated, service_role;

-- ---------- Admin helpers (run manually in SQL Editor as needed) ----------
-- Recent certificates:
--   select certificate_id, full_name, issued_at, revoked from peptide.certificates order by issued_at desc;
-- Revoke a certificate:
--   update peptide.certificates set revoked = true, revoked_reason = '...' where certificate_id = 'PC1-XXXX-XXXX-XXXX';
