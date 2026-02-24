create table if not exists decision_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  advisor_session_id uuid references advisor_sessions(id) on delete set null,
  recommendation text not null,
  status text not null check (status in ('accepted', 'rejected', 'in_progress')),
  effect_note text,
  created_at timestamptz not null default now()
);

create table if not exists counterparty_monitoring (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  inn text not null,
  monitor_enabled boolean not null default true,
  last_checked_at timestamptz,
  risk_status text,
  risk_summary text,
  created_at timestamptz not null default now()
);

create table if not exists candidate_checks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  full_name text not null,
  passport_masked text,
  inn text,
  consent_confirmed boolean not null default false,
  check_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists legal_risk_summaries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  counterparty_name text,
  risk_level text,
  summary text not null,
  flags jsonb not null default '[]'::jsonb,
  disclaimer text,
  created_at timestamptz not null default now()
);

create table if not exists desktop_agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  employee_ref text,
  device_id text,
  status text not null default 'planned',
  policy_ref text,
  created_at timestamptz not null default now()
);

create table if not exists desktop_monitoring_policies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  policy_text text not null,
  legal_basis text,
  created_at timestamptz not null default now()
);

create table if not exists desktop_employee_consents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  employee_ref text not null,
  consent_given boolean not null,
  consent_date timestamptz,
  document_ref text,
  created_at timestamptz not null default now()
);

create table if not exists desktop_activity_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  desktop_agent_id uuid references desktop_agents(id) on delete set null,
  activity_date date not null,
  app_category text,
  active_minutes integer,
  idle_minutes integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_decision_log_workspace on decision_log(workspace_id);
create index if not exists idx_candidate_checks_workspace on candidate_checks(workspace_id);
create index if not exists idx_desktop_activity_workspace on desktop_activity_logs(workspace_id);
