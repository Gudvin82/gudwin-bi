# GudWin BI

MVP платформы аналитики для малого/среднего бизнеса: веб-дашборд + AI-агент + каналы уведомлений (Telegram/SMS).

## Что реализовано в этом MVP

- Next.js 15 (App Router) + TypeScript + Tailwind, светлая premium UI-концепция.
- Рабочий кабинет с разделами: `Обзор`, `Дашборды`, `Источники данных`, `AI-аналитика`, `Настройки`.
- Новые модули: `Smart Advisor`, `Smart Agents`, `Smart Hire`.
- Полный Smart OS контур: `Owner Mode`, `Smart Finance`, `Smart Docs & Law`, `Smart Connect`, `Smart Watch`, `Smart Learn`, `Competitor Watch`, `Contacts`.
- Пошаговый `onboarding` сценарий первого запуска.
- Явный demo-режим c CTA и безопасным fallback для AI.
- API-слой в Next.js:
  - `POST /api/ai/query` - AI-интерпретация запроса и SQL plan.
  - `POST /api/data-sources` - подключение источника через единый интерфейс адаптеров.
  - `POST /api/telegram/webhook/[workspaceId]` - webhook для Telegram-бота.
  - `POST /api/sms/send` - отправка SMS через абстракцию провайдера.
  - `GET /api/cron/scheduled-reports` - endpoint для cron jobs Vercel.
  - `GET /api/export/csv` - экспорт отчета в CSV.
  - `GET /api/integration-logs` - логи интеграций.
  - `POST /api/report-templates` - сохранение шаблонов AI-отчетов.
  - `POST /api/advisor/query` + `GET/POST /api/advisor/sessions` - Smart Advisor.
  - `GET/POST /api/agents`, `POST /api/agents/{id}/run-task`, `GET /api/agents/{id}/logs` - Smart Agents.
  - `POST /api/hire/request`, `GET /api/hire/requests` - Smart Hire.
  - Finance APIs: `GET /api/finance/unit-metrics`, `GET /api/finance/cash-guard`, `POST /api/finance/scenario`, `GET /api/finance/money-leaks`, `GET /api/finance/payment-calendar`.
  - `GET /api/predict/revenue` - Smart Predict.
  - `GET /api/watch/alerts` - Smart Watch.
  - `GET /api/connect/integrations`, `GET /api/connect/rules` - Smart Connect.
  - `POST /api/docs/generate`, `POST /api/docs/scan`, `POST /api/law/check-counterparty` - Smart Docs & Law.
  - `GET /api/learn/faq` - Smart Learn.
  - `GET /api/owner/health` - Owner Mode + Health Score.
  - `GET /api/competitor/watch` - Competitor Watch.
  - `POST /api/contacts/request` - заявки на доработку.
- База данных (Supabase/Postgres): миграция с multi-tenant таблицами, индексами и RLS policy.
- Расширенная схема БД для Smart модулей: `workspace_kpi_cache`, `advisor_*`, `agents_*`, `hire_*`.
- Дополнительная схема Smart OS: `unit_metrics`, `payment_calendar`, `scenario_runs`, `money_leaks`, `smart_predict_cache`, `watch_alerts`, `integrations`, `integration_rules`, `generated_documents`, `scanned_documents`, `counterparty_checks`, `kpi_assignments`, `department_performance_index`, `competitor_signals`, `dev_requests`.
- Trust/Law/Desktop Agent schema: `decision_log`, `counterparty_monitoring`, `candidate_checks`, `legal_risk_summaries`, `desktop_agents`, `desktop_monitoring_policies`, `desktop_employee_consents`, `desktop_activity_logs`.

## Приоритеты без дублей

- v1 Must-Have:
  - Русский UI по умолчанию (ru-RU), demo-workspace, ясные empty states и CTA.
  - Ядро: Owner Mode + Health Score, Smart Finance (Cash Guard, Unit Economics, Money Leak), Smart Watch.
  - Trust-layer: Explain-режим и Decision Log в Smart Advisor.
  - AI Query Safety: schema-aware guardrails, whitelist таблиц, LIMIT, централизованная обработка ошибок.
  - Smart Law v1: проверка контрагента и кандидата + AI risk summary с дисклеймером.
- v2+:
  - Углубленный AI-юрист и прод-интеграции с внешними правовыми сервисами.
  - Desktop AI Agent runtime (клиент), после отдельной юридической экспертизы.
  - Расширенный Smart Hire/HR, marketplace-автоматизации и прод-OpenClaw bridge.
- Роли `owner/member` с ограничением owner-only операций (пример: test SMS).
- Подготовка i18n структуры (`ru`/`en`) без усложнения UI на старте.
- Rate limiting для AI endpoint.

## Архитектура

- `src/lib/connectors/*` - адаптеры источников данных (Google Sheets, webhook/CRM).
- `src/lib/ai/provider.ts` - слой LLM (OpenAI, с mock fallback).
- `src/lib/dashboard/auto-dashboard.ts` - авто-предложение виджетов по схеме данных.
- `src/lib/notifications/*` - Telegram/SMS каналы с интерфейсом для замены провайдера.
- `supabase/migrations/0001_init.sql` - модель данных + tenant security.

## Что добавлено сверх ТЗ (важные практические вещи)

- Шифрование секретов (`src/lib/security/encryption.ts`) для bot tokens/API keys.
- Integration logs и события синхронизаций как отдельная сущность.
- Шаблоны отчетов (`report_templates`) для повторного запуска AI-запросов.
- Vercel Cron для ежедневной/еженедельной рассылки.
- Экспорт таблицы в CSV как базовый формат выгрузки.
- Техническая основа для data governance:
  - строгая tenant-изоляция,
  - опора на RLS,
  - централизованный контекст workspace/user.

## Запуск локально

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env.local` на основе `.env.example`.

3. Запуск dev-сервера:

```bash
npm run dev
```

## Деплой на Vercel

```bash
vercel
vercel --prod --yes
```

Важно добавить env-переменные проекта в Vercel Dashboard.

## Следующие шаги для production

- Подключить реальную auth-схему Supabase Auth/NextAuth.
- Доделать загрузку файлов в Supabase Storage + парсеры (`xlsx/csv/docx/pdf`).
- Добавить drag-n-drop редактор виджетов (например, react-grid-layout).
- Реализовать реальный SQL-execution слой с sandbox/allowlist.
- Вынести тяжелые sync jobs в очередь (QStash/Upstash/Trigger.dev).
