-- Supabase schema for COTIT Control 360° (NextAuth + domain tables)

-- NextAuth tables (from next-auth-supabase-adapter)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  email_verified timestamp with time zone,
  image text,
  created_at timestamp with time zone default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade on update cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  created_at timestamp with time zone default now(),
  unique (provider, provider_account_id)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text unique,
  user_id uuid references public.users(id) on delete cascade on update cascade,
  expires timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  primary key (identifier, token)
);

-- Domain tables
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  website text,
  country text,
  business_type text,
  size text,
  monthly_orders integer,
  description text,
  additional_details text,
  show_assessment_scores boolean default true,
  messaging_url text,
  instagram_url text,
  tiktok_url text,
  x_url text,
  phone text,
  email text,
  whatsapp text,
  linkedin_url text,
  banner_url text,
  logo_url text,
  role text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.card_tokens (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  claimed boolean default false,
  company_id uuid references public.companies(id) on delete set null on update cascade,
  claimed_at timestamp with time zone,
  public_profile_enabled boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade on update cascade,
  total_score integer,
  profile_label text,
  strengths jsonb,
  opportunities jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists public.roi_calculations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade on update cascade,
  monthly_orders integer,
  employees integer,
  manual_hours_per_week integer,
  error_rate numeric,
  warehouse_movements integer,
  monthly_savings numeric,
  annual_savings numeric,
  payback_months numeric,
  efficiency_gain_percent numeric,
  created_at timestamp with time zone default now()
);

-- Helpful indexes
create index if not exists idx_companies_slug on public.companies(slug);
create index if not exists idx_card_tokens_token on public.card_tokens(token);
create index if not exists idx_assessment_company on public.assessment_results(company_id);
create index if not exists idx_roi_company on public.roi_calculations(company_id);

