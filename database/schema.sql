-- nutrIA Supabase schema
-- Tables are prefixed with nutria_ so the same Supabase project can host multiple apps
-- Run this in your Supabase SQL editor

-- ─── Conversations ────────────────────────────────────────────────────────────

create table if not exists nutria_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  messages jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists nutria_conversations_user_idx on nutria_conversations(user_id);

alter table nutria_conversations enable row level security;

create policy "nutria: own conversation" on nutria_conversations
  for all using (auth.uid() = user_id);

-- ─── Patient Profiles ─────────────────────────────────────────────────────────
-- Populated automatically by profile extraction after intake conversation

create table if not exists nutria_patient_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  name text,
  age integer,
  sex text,
  weight_kg numeric,
  height_cm numeric,
  wrist_cm numeric,
  bmi numeric,
  goal text,
  conditions text[] default '{}',
  medications text[] default '{}',
  allergies text[] default '{}',
  activity_level text,
  intake_complete boolean default false,
  raw jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists nutria_patient_profiles_user_idx on nutria_patient_profiles(user_id);

alter table nutria_patient_profiles enable row level security;

create policy "nutria: own profile" on nutria_patient_profiles
  for all using (auth.uid() = user_id);
