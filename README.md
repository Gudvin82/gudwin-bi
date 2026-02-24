# GudWin BI

GudWin BI — AI-операционная система для малого и среднего бизнеса.

Прод: [https://gudwin-bi.vercel.app](https://gudwin-bi.vercel.app)  
Репозиторий: [https://github.com/Gudvin82/gudwin-bi](https://github.com/Gudvin82/gudwin-bi)

## Что это сейчас

Текущий статус — расширенный MVP с русскоязычным интерфейсом, демо-режимом и фокусом на ядре:

- Режим владельца (главный экран)
- Финансы (юнит-экономика, прогноз денег, утечки)
- Мониторинг (алерты и утренние брифинги)
- AI-советник (структурированные рекомендации + decision log)
- Юридический блок (базовые проверки контрагентов/кандидатов + risk summary)
- Интеграции, агенты, найм, обучение, контакты

## Навигация (актуальная)

В приложении используется иерархическое меню из 9 разделов:

1. Главная
2. Финансы
3. Аналитика
4. AI-Советник
5. Команда
6. Юридический
7. Мониторинг
8. Интеграции
9. Настройки

Для каждого раздела добавлены вложенные подпункты и отдельные экраны-модули.

## Реализованные модули

- Smart Dashboard (MVP)
- Конструктор дашбордов (новый экран `/dashboards/builder`)
- Конструктор отчетов (новый экран `/analytics/report-builder`)
- Smart Advisor (чат, роли, explain-формат, decision log)
- Smart Finance (Unit Economics, прогноз денег, Scenario, Money Leak, платежный календарь)
- Smart Watch (алерты, режимы уведомлений)
- Smart Docs & Law (базовые проверки и риск-сводки)
- Smart Connect (интеграции + правила «если → то»)
- Smart Hire (генерация заявок + базовый скрининг)
- Smart Agents (каталог и базовые задачи)
- Smart Learn (FAQ)
- Competitor Watch (демо-сигналы)
- Contacts / Dev Requests

Дополнительно заложены страницы-контейнеры для следующих направлений (v2+):

- Смарт Банк
- Смарт Бухгалтерия
- AI-совет директоров
- Идеи роста
- Дневник бизнеса
- Эффективность команды
- Глубокий аудит договоров
- Авто-реакции
- Режим «Объяснить просто»

## API (MVP слой)

- `POST /api/ai/query`
- `POST /api/advisor/query`
- `GET|POST /api/advisor/sessions`
- `GET|POST /api/agents`
- `POST /api/agents/{id}/run-task`
- `GET /api/agents/{id}/logs`
- `POST /api/hire/request`
- `GET /api/hire/requests`
- `GET /api/finance/unit-metrics`
- `GET /api/finance/cash-guard`
- `POST /api/finance/scenario`
- `GET /api/finance/money-leaks`
- `GET /api/finance/payment-calendar`
- `GET /api/watch/alerts`
- `GET /api/connect/integrations`
- `GET /api/connect/rules`
- `POST /api/docs/generate`
- `POST /api/docs/scan`
- `POST /api/law/check-counterparty`
- `POST /api/law/check-candidate`
- `POST /api/law/risk-summary`
- `POST /api/contacts/request`
- `POST /api/sms/send`
- `POST /api/telegram/webhook/[workspaceId]`

## Технологии

- Next.js 15 (App Router)
- React + TypeScript
- TailwindCSS
- Supabase/Postgres (схема + миграции)
- Vercel (hosting + cron endpoint)

## Безопасность и ограничения

- Multi-tenant модель в БД (`workspace_id` в сущностях)
- AI Query Safety (guardrails/ограничения генерации)
- Ограничения owner-only для чувствительных действий
- Desktop Agent отмечен как v2+ (с юридическими ограничениями)

## Локализация

- Основной язык интерфейса: русский (ru-RU)
- В репозитории добавлен чек-лист ручной валидации UX-текста:  
  [`docs/ru-ux-checklist.md`](docs/ru-ux-checklist.md)

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

## Деплой

```bash
vercel --prod --yes
```

## Roadmap (кратко)

### v1 (фокус)
- Режим владельца + Health Score
- Финансы (прогноз денег, юнит-экономика, утечки)
- Мониторинг (алерты, брифинги)
- Русификация UX и понятные empty states

### v2+
- Реальные интеграции банков/1С/правовых сервисов
- Production OpenClaw bridge
- Расширенный юридический и HR-контур
- Desktop Agent runtime
