# FreelanceMKT

FreelanceMKT is a full-stack freelance service marketplace for clients, freelancers, and administrators. It combines a React marketplace with Django REST APIs, JWT authentication, persisted Channels chat, real-time notifications, Stripe Checkout, Cloudinary uploads, and MySQL.

## Features

- Client and freelancer registration with JWT login/refresh
- Searchable and filterable service marketplace
- Freelancer service creation and deletion
- Stripe-backed ordering and status tracking
- Real-time direct chat with attachments, online presence, typing, read receipts, history, unread counts, and clear-chat
- Order, review, dispute, message, and new-chat notifications
- Client spending and order dashboard
- Freelancer earnings, services, and order dashboard
- Reviews, disputes, profile settings, password changes, and payment settings
- Admin user bans, dispute resolution, platform settings, categories, and user chat
- Responsive dark/light interface

## Repository layout

```text
src/                 React JavaScript frontend
  app/               Router and application composition
  components/        Reusable marketplace UI
  context/           Auth, theme, and notification state
  hooks/             API and WebSocket hooks
  pages/             Public, dashboard, chat, and admin routes
  utils/             Axios client and Cloudinary uploader
backend/             Django project
  config/            Settings, URLs, WSGI, and ASGI
  marketplace/       Models, serializers, APIs, permissions, and consumers
```

## Local development

### 1. Prerequisites

- Node.js 24 and pnpm 10
- Python 3.12
- MySQL 8+
- Redis 7+
- Stripe account and Stripe CLI
- Cloudinary account with an unsigned upload preset

### 2. Frontend

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Set `VITE_API_URL`, `VITE_WS_URL`, `VITE_CLOUDINARY_CLOUD_NAME`, and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`. In Figma Make, the frontend development server is already managed and should not be started manually.

### 3. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

Create the MySQL database and credentials before migration:

```sql
CREATE DATABASE freelancemkt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'freelancemkt'@'%' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON freelancemkt.* TO 'freelancemkt'@'%';
```

For local-only migration tooling, the backend falls back to SQLite when `MYSQL_DATABASE` is absent. Production should always set the MySQL variables.

### 4. Stripe webhook

```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook/
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`. Enable the `checkout.session.completed` event in production.

## API overview

- `POST /api/auth/register/`, `/api/auth/token/`, `/api/auth/token/refresh/`
- `GET/PATCH /api/auth/me/`
- `/api/categories/`, `/api/services/`, `/api/orders/`
- `/api/reviews/`, `/api/disputes/`
- `/api/conversations/`, `/api/conversations/:id/messages/`
- `/api/notifications/`
- `/api/dashboard/client/`, `/api/dashboard/freelancer/`
- `/api/admin/dashboard/`, `/api/admin/users/:id/`, `/api/admin/settings/`
- WebSockets: `/ws/chat/:conversationId/` and `/ws/notifications/`

## Deploy frontend to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Keep the repository root as the Root Directory.
4. Build command: `pnpm build`.
5. Output directory: `dist`.
6. Add all frontend variables from `.env.example`.
7. Deploy. `vercel.json` preserves client-side routes.
8. Add the final Vercel origin to backend `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

Vercel hosts the static React frontend only. Deploy the stateful Django/Channels backend to a service with long-running processes and WebSocket support.

## Deploy backend to Render

1. Provision managed MySQL (or an external MySQL provider) and Redis.
2. Create a Render Web Service from this repository with Root Directory `backend`.
3. Use:
   - Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start: `daphne -b 0.0.0.0 -p $PORT config.asgi:application`
4. Add every backend variable from `backend/.env.example`.
5. Set `DEBUG=False`, secure `SECRET_KEY`, public `ALLOWED_HOSTS`, frontend `CORS_ALLOWED_ORIGINS`, MySQL credentials, Redis URL, and Stripe secrets.
6. Point the Stripe production webhook to `https://YOUR-API/api/stripe/webhook/`.
7. Set Vercel `VITE_API_URL=https://YOUR-API/api` and `VITE_WS_URL=wss://YOUR-API/ws`, then redeploy.
8. Run `python manage.py createsuperuser` in the Render shell and set that account's role to `admin`.

`backend/render.yaml` contains a starter Render service definition. Railway, Fly.io, DigitalOcean App Platform, and conventional VPS deployments work as well if they provide MySQL, Redis, HTTPS, and WebSockets.

## Production checklist

- Rotate all secrets and disable debug mode.
- Restrict CORS and allowed hosts to deployed domains.
- Use managed MySQL backups and Redis persistence appropriate to your recovery plan.
- Configure Stripe webhook retries and inspect failed events.
- Keep Cloudinary upload presets constrained by size, MIME type, and folder.
- Run migrations before each backend release.
- Put the API behind TLS and use `wss://` for Channels.
- Add email delivery, rate limiting, audit logs, and background jobs before high-volume launch.

## Validation

```bash
pnpm build
cd backend && python manage.py check
```
# freelance_project
