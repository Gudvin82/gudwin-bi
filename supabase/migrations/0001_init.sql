create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id),
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  primary key (workspace_id, user_id)
);

create table if not exists data_sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  type text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists uploaded_files (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  data_source_id uuid references data_sources(id) on delete set null,
  file_name text not null,
  file_type text not null,
  storage_url text not null,
  parsed_status text not null default 'pending',
  parsed_schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists datasets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  description text,
  schema jsonb not null default '[]'::jsonb,
  source_ref jsonb not null default '{}'::jsonb,
  row_count bigint not null default 0,
  last_refreshed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists dashboards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  description text,
  layout jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists widgets (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid not null references dashboards(id) on delete cascade,
  type text not null,
  config jsonb not null default '{}'::jsonb,
  position jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ai_queries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references users(id),
  raw_question_text text not null,
  interpreted_intent jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  executed_at timestamptz
);

create table if not exists ai_query_results (
  id uuid primary key default gen_random_uuid(),
  ai_query_id uuid not null references ai_queries(id) on delete cascade,
  dataset_refs jsonb not null default '[]'::jsonb,
  result_data_ref jsonb not null default '{}'::jsonb,
  result_summary_text text,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists telegram_bots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  bot_token text not null,
  default_chat_id text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists sms_providers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  provider_name text not null,
  api_key text not null,
  endpoint_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists sms_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  target_phone text not null,
  message_text text not null,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table if not exists unstructured_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  file_name text not null,
  text_content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists report_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  prompt text not null,
  dataset_ids jsonb not null default '[]'::jsonb,
  schedule jsonb,
  channels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists integration_logs (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  integration_type text not null,
  event text not null,
  status text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_tenant_data_sources on data_sources(workspace_id);
create index if not exists idx_tenant_datasets on datasets(workspace_id);
create index if not exists idx_tenant_dashboards on dashboards(workspace_id);
create index if not exists idx_tenant_ai_queries on ai_queries(workspace_id);
create index if not exists idx_tenant_logs on integration_logs(workspace_id);

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table data_sources enable row level security;
alter table datasets enable row level security;
alter table dashboards enable row level security;
alter table ai_queries enable row level security;
alter table integration_logs enable row level security;

create policy if not exists tenant_workspace_membership on workspaces
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspaces.id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_data_sources on data_sources
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = data_sources.workspace_id
      and wm.user_id = auth.uid()
    )
  );
