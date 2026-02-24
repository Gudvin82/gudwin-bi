create table if not exists workspace_kpi_cache (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  period text not null default '30d',
  kpi_json jsonb not null default '{}'::jsonb,
  refreshed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists advisor_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid references users(id),
  advisor_role text not null check (advisor_role in ('business', 'accountant', 'financier')),
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists advisor_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  session_id uuid not null references advisor_sessions(id) on delete cascade,
  message_role text not null check (message_role in ('user', 'assistant')),
  content text not null,
  structured_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  type text not null check (type in ('support', 'hr', 'sales', 'marketing', 'custom')),
  name text not null,
  description text,
  status text not null default 'active',
  config_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_skills (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  name text not null,
  config_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_tasks (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  type text not null check (type in ('one_off', 'scheduled', 'trigger')),
  payload_json jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  last_run_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  timestamp timestamptz not null default now(),
  event_type text not null,
  message text not null,
  metadata_json jsonb not null default '{}'::jsonb
);

create table if not exists hire_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  role_type text not null,
  raw_description text,
  ai_generated_brief text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists hire_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  marketplace_name text not null,
  credentials text,
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_workspace_kpi_cache_workspace_id on workspace_kpi_cache(workspace_id);
create index if not exists idx_advisor_sessions_workspace_id on advisor_sessions(workspace_id);
create index if not exists idx_advisor_messages_workspace_id on advisor_messages(workspace_id);
create index if not exists idx_agents_workspace_id on agents(workspace_id);
create index if not exists idx_hire_requests_workspace_id on hire_requests(workspace_id);

alter table workspace_kpi_cache enable row level security;
alter table advisor_sessions enable row level security;
alter table advisor_messages enable row level security;
alter table agents enable row level security;
alter table hire_requests enable row level security;

create policy tenant_workspace_kpi_cache on workspace_kpi_cache
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_kpi_cache.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy tenant_advisor_sessions on advisor_sessions
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = advisor_sessions.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy tenant_advisor_messages on advisor_messages
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = advisor_messages.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy tenant_agents on agents
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = agents.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy tenant_hire_requests on hire_requests
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = hire_requests.workspace_id
      and wm.user_id = auth.uid()
    )
  );
