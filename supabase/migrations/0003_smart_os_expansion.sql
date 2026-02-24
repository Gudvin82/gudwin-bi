create table if not exists unit_metrics (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  period text not null,
  dimension_type text not null,
  dimension_id text,
  cac numeric(14,2),
  ltv numeric(14,2),
  romi numeric(10,2),
  margin numeric(10,2),
  payback_days integer,
  created_at timestamptz not null default now()
);

create table if not exists payment_calendar (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  date date not null,
  type text not null check (type in ('incoming', 'outgoing')),
  counterparty text,
  amount numeric(14,2) not null,
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists scenario_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  scenario_name text,
  input_json jsonb not null,
  output_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists money_leaks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  category text,
  severity text,
  description text not null,
  recommendation text,
  impact_estimate numeric(14,2),
  created_at timestamptz not null default now()
);

create table if not exists smart_predict_cache (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  metric text not null,
  period text not null,
  model text not null,
  forecast_json jsonb not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists watch_alerts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  alert_type text not null,
  level text not null,
  message text not null,
  channels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  type text not null,
  credentials text,
  status text not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists integration_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  rule_json jsonb not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists generated_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  doc_type text not null,
  source_ref jsonb,
  status text not null default 'generated',
  content_ref text,
  created_at timestamptz not null default now()
);

create table if not exists scanned_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  file_ref text not null,
  extracted_json jsonb not null,
  match_status text,
  created_at timestamptz not null default now()
);

create table if not exists counterparty_checks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  inn text not null,
  risk_status text not null,
  comment text,
  checked_at timestamptz not null default now()
);

create table if not exists kpi_assignments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  department text not null,
  employee_name text,
  kpi_name text not null,
  target_value numeric(14,2),
  actual_value numeric(14,2),
  period text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists department_performance_index (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  department text not null,
  score integer not null,
  factors jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists competitor_signals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  competitor_name text not null,
  signal text not null,
  recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists dev_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete set null,
  name text not null,
  contact text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_unit_metrics_workspace on unit_metrics(workspace_id);
create index if not exists idx_payment_calendar_workspace on payment_calendar(workspace_id);
create index if not exists idx_watch_alerts_workspace on watch_alerts(workspace_id);
create index if not exists idx_integrations_workspace on integrations(workspace_id);
create index if not exists idx_dev_requests_created on dev_requests(created_at desc);
