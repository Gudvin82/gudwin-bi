# GudWin BI: деплой на Timeweb VPS (prod)

## 1) Подготовка сервера

```bash
apt update && apt upgrade -y
apt install -y nginx git curl ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
```

## 2) Код и переменные

```bash
mkdir -p /opt/gudwin-bi
cd /opt/gudwin-bi
git clone https://github.com/Gudvin82/gudwin-bi.git .
cp .env.example .env
nano .env
```

Обязательно заполнить:

- `PORTAL_PIN` (сменить с `0000`)
- `AITUNNEL_API_KEY` (или `OPENAI_API_KEY`)
- `OPENAI_BASE_URL=https://api.aitunnel.ru/v1`
- `AI_MODEL`
- Supabase/Telegram/SMS ключи

## 3) Сборка и запуск

```bash
cd /opt/gudwin-bi
npm ci
npm run build
pm2 start npm --name gudwin-bi -- start
pm2 save
pm2 startup
```

## 4) Nginx reverse proxy

`/etc/nginx/sites-available/gudwin-bi`:

```nginx
server {
  listen 80;
  server_name 6705783-gw828583.twc1.net;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
ln -s /etc/nginx/sites-available/gudwin-bi /etc/nginx/sites-enabled/gudwin-bi
nginx -t && systemctl reload nginx
```

## 5) Базовая защита

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

- Не хранить секреты в git.
- Для ключей использовать только `.env` на сервере.
- После публикации ключа — сразу ротация в кабинете провайдера.

## 6) Обновление релиза

```bash
cd /opt/gudwin-bi
git pull origin main
npm ci
npm run build
pm2 restart gudwin-bi
```
