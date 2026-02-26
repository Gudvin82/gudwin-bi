-- Enable RLS for tables missing tenant protection

alter table uploaded_files enable row level security;
alter table widgets enable row level security;
alter table ai_query_results enable row level security;
alter table telegram_bots enable row level security;
alter table sms_providers enable row level security;
alter table sms_jobs enable row level security;
alter table unstructured_documents enable row level security;
alter table report_templates enable row level security;

alter table agent_skills enable row level security;
alter table agent_tasks enable row level security;
alter table agent_logs enable row level security;
alter table hire_integrations enable row level security;

alter table unit_metrics enable row level security;
alter table payment_calendar enable row level security;
alter table scenario_runs enable row level security;
alter table money_leaks enable row level security;
alter table smart_predict_cache enable row level security;
alter table watch_alerts enable row level security;
alter table integrations enable row level security;
alter table integration_rules enable row level security;
alter table generated_documents enable row level security;
alter table scanned_documents enable row level security;
alter table counterparty_checks enable row level security;
alter table kpi_assignments enable row level security;
alter table department_performance_index enable row level security;
alter table competitor_signals enable row level security;
alter table dev_requests enable row level security;

alter table decision_log enable row level security;
alter table counterparty_monitoring enable row level security;
alter table candidate_checks enable row level security;
alter table legal_risk_summaries enable row level security;
alter table desktop_agents enable row level security;
alter table desktop_monitoring_policies enable row level security;
alter table desktop_employee_consents enable row level security;
alter table desktop_activity_logs enable row level security;

-- Policies for workspace-scoped tables
create policy if not exists tenant_uploaded_files on uploaded_files
  using (exists (select 1 from workspace_members wm where wm.workspace_id = uploaded_files.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_telegram_bots on telegram_bots
  using (exists (select 1 from workspace_members wm where wm.workspace_id = telegram_bots.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_sms_providers on sms_providers
  using (exists (select 1 from workspace_members wm where wm.workspace_id = sms_providers.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_sms_jobs on sms_jobs
  using (exists (select 1 from workspace_members wm where wm.workspace_id = sms_jobs.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_unstructured_documents on unstructured_documents
  using (exists (select 1 from workspace_members wm where wm.workspace_id = unstructured_documents.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_report_templates on report_templates
  using (exists (select 1 from workspace_members wm where wm.workspace_id = report_templates.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_unit_metrics on unit_metrics
  using (exists (select 1 from workspace_members wm where wm.workspace_id = unit_metrics.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_payment_calendar on payment_calendar
  using (exists (select 1 from workspace_members wm where wm.workspace_id = payment_calendar.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_scenario_runs on scenario_runs
  using (exists (select 1 from workspace_members wm where wm.workspace_id = scenario_runs.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_money_leaks on money_leaks
  using (exists (select 1 from workspace_members wm where wm.workspace_id = money_leaks.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_smart_predict_cache on smart_predict_cache
  using (exists (select 1 from workspace_members wm where wm.workspace_id = smart_predict_cache.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_watch_alerts on watch_alerts
  using (exists (select 1 from workspace_members wm where wm.workspace_id = watch_alerts.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_integrations on integrations
  using (exists (select 1 from workspace_members wm where wm.workspace_id = integrations.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_integration_rules on integration_rules
  using (exists (select 1 from workspace_members wm where wm.workspace_id = integration_rules.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_generated_documents on generated_documents
  using (exists (select 1 from workspace_members wm where wm.workspace_id = generated_documents.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_scanned_documents on scanned_documents
  using (exists (select 1 from workspace_members wm where wm.workspace_id = scanned_documents.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_counterparty_checks on counterparty_checks
  using (exists (select 1 from workspace_members wm where wm.workspace_id = counterparty_checks.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_kpi_assignments on kpi_assignments
  using (exists (select 1 from workspace_members wm where wm.workspace_id = kpi_assignments.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_department_performance_index on department_performance_index
  using (exists (select 1 from workspace_members wm where wm.workspace_id = department_performance_index.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_competitor_signals on competitor_signals
  using (exists (select 1 from workspace_members wm where wm.workspace_id = competitor_signals.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_dev_requests on dev_requests
  using (exists (select 1 from workspace_members wm where wm.workspace_id = dev_requests.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_decision_log on decision_log
  using (exists (select 1 from workspace_members wm where wm.workspace_id = decision_log.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_counterparty_monitoring on counterparty_monitoring
  using (exists (select 1 from workspace_members wm where wm.workspace_id = counterparty_monitoring.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_candidate_checks on candidate_checks
  using (exists (select 1 from workspace_members wm where wm.workspace_id = candidate_checks.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_legal_risk_summaries on legal_risk_summaries
  using (exists (select 1 from workspace_members wm where wm.workspace_id = legal_risk_summaries.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_desktop_agents on desktop_agents
  using (exists (select 1 from workspace_members wm where wm.workspace_id = desktop_agents.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_desktop_monitoring_policies on desktop_monitoring_policies
  using (exists (select 1 from workspace_members wm where wm.workspace_id = desktop_monitoring_policies.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_desktop_employee_consents on desktop_employee_consents
  using (exists (select 1 from workspace_members wm where wm.workspace_id = desktop_employee_consents.workspace_id and wm.user_id = auth.uid()));

create policy if not exists tenant_desktop_activity_logs on desktop_activity_logs
  using (exists (select 1 from workspace_members wm where wm.workspace_id = desktop_activity_logs.workspace_id and wm.user_id = auth.uid()));

-- Policies for tables without direct workspace_id
create policy if not exists tenant_widgets on widgets
  using (
    exists (
      select 1
      from dashboards d
      join workspace_members wm on wm.workspace_id = d.workspace_id
      where d.id = widgets.dashboard_id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_ai_query_results on ai_query_results
  using (
    exists (
      select 1
      from ai_queries q
      join workspace_members wm on wm.workspace_id = q.workspace_id
      where q.id = ai_query_results.ai_query_id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_agent_skills on agent_skills
  using (
    exists (
      select 1
      from agents a
      join workspace_members wm on wm.workspace_id = a.workspace_id
      where a.id = agent_skills.agent_id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_agent_tasks on agent_tasks
  using (
    exists (
      select 1
      from agents a
      join workspace_members wm on wm.workspace_id = a.workspace_id
      where a.id = agent_tasks.agent_id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_agent_logs on agent_logs
  using (
    exists (
      select 1
      from agents a
      join workspace_members wm on wm.workspace_id = a.workspace_id
      where a.id = agent_logs.agent_id
      and wm.user_id = auth.uid()
    )
  );

create policy if not exists tenant_hire_integrations on hire_integrations
  using (exists (select 1 from workspace_members wm where wm.workspace_id = hire_integrations.workspace_id and wm.user_id = auth.uid()));
