# GudWin BI

MVP платформы аналитики для малого/среднего бизнеса: веб-дашборд + AI-агент + каналы уведомлений (Telegram/SMS).

## Что реализовано в этом MVP

- Next.js 15 (App Router) + TypeScript + Tailwind, светлая premium UI-концепция.
- Рабочий кабинет с разделами: `Обзор`, `Дашборды`, `Источники данных`, `AI-аналитика`, `Настройки`.
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
- База данных (Supabase/Postgres): миграция с multi-tenant таблицами, индексами и RLS policy.
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
