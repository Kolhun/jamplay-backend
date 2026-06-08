# jamplay-backend

Monorepo для JamPlay: статическая страница, админка поддомена и nginx reverse proxy. Один Git-репозиторий, три независимых Docker-контейнера на VPS.

## Сервисы

| Сервис | Путь | Домен | Контейнер | Назначение |
|--------|------|-------|-----------|------------|
| **Web** | `apps/web` | [jamplay.ru](https://jamplay.ru) | `jamplay-web` | Landing / debug-страница |
| **Admin** | `apps/admin` | [minecraft.jamplay.ru](https://minecraft.jamplay.ru) | `jamplay-admin` | Заглушка админки (будущая загрузка архивов) |
| **Nginx** | `infra/nginx` | — | `jamplay-nginx` | Reverse proxy, basic auth для админки |

```
Браузер → jamplay-nginx:80
            ├─ jamplay.ru           → jamplay-web:80
            └─ minecraft.jamplay.ru → jamplay-admin:80 (+ htpasswd)
```

## Требования

- **Docker** + Docker Compose (BuildKit для `docker build --ssh`)
- **Node.js 20+** — только для локальной разработки
- **VPS:** deploy key (read-only) в GitHub → файл `deploy/ssh/github_deploy_key`

## Локальная разработка

```bash
# Web — jamplay.ru
cd apps/web && npm install && npm run dev
# http://localhost:5173

# Admin — minecraft.jamplay.ru
cd apps/admin && npm install && npm run dev
# http://localhost:5174
```

Production-сборка локально:

```bash
cd apps/web   && npm run build   # → apps/web/dist
cd apps/admin && npm run build   # → apps/admin/dist
```

## Первый деплой на VPS

```bash
# 1. Docker-сеть (один раз)
./scripts/create-network.sh
# или: docker network create jamplay-edge

# 2. SSH-ключ (один раз, единое место)
mkdir -p deploy/ssh
cp ~/.ssh/github_deploy_key deploy/ssh/
chmod 600 deploy/ssh/github_deploy_key

# 3. .env в каждой deploy-папке
cp deploy/web/.env.example   deploy/web/.env
cp deploy/admin/.env.example deploy/admin/.env
cp deploy/nginx/.env.example deploy/nginx/.env
# Отредактируйте GIT_REPO и GIT_BRANCH

# 4. htpasswd для админки (один раз)
mkdir -p deploy/nginx/secrets
htpasswd -cb deploy/nginx/secrets/htpasswd admin <password>

# 5. Поднять сервисы (web и admin → затем nginx)
cd deploy/web   && chmod +x rebuild && ./rebuild
cd deploy/admin && chmod +x rebuild && ./rebuild
cd deploy/nginx && chmod +x rebuild && ./rebuild
```

## Обновление на сервере (`./rebuild`)

Каждый скрипт клонирует свежий код с Git и пересобирает **только свой** контейнер. Все используют **единый SSH-ключ** из `deploy/ssh/github_deploy_key`.

| Команда | Когда |
|---------|-------|
| `cd deploy/web && ./rebuild` | Изменился `apps/web` |
| `cd deploy/admin && ./rebuild` | Изменился `apps/admin` |
| `cd deploy/nginx && ./rebuild` | Изменились конфиги в `infra/nginx` |

Быстрый reload nginx без пересборки:

```bash
cd deploy/nginx && docker compose exec nginx nginx -s reload
```

## Проверка

- http://jamplay.ru — статика, debug-блок
- http://minecraft.jamplay.ru — админка (логин/пароль из htpasswd)

## Структура репозитория

```
jamplay-backend/
├── apps/web/           # React → jamplay.ru
├── apps/admin/         # React → minecraft.jamplay.ru
├── infra/nginx/        # конфиги nginx (в Git)
├── deploy/
│   ├── ssh/            # github_deploy_key (только на сервере)
│   ├── common/         # rebuild.lib.sh
│   ├── web/            # ./rebuild
│   ├── admin/          # ./rebuild
│   └── nginx/          # ./rebuild, secrets/htpasswd
└── scripts/
    └── create-network.sh
```

## Переменные окружения (deploy)

| Переменная | Описание |
|------------|----------|
| `GIT_REPO` | `git@github.com:<user>/jamplay-backend.git` |
| `GIT_BRANCH` | Ветка для clone при build (например `main`) |
| `GIT_ALPINE_VERSION` | Версия образа `alpine/git` (по умолчанию `2.52.0`) |

**Не в Git:** `deploy/ssh/github_deploy_key`, `deploy/nginx/secrets/htpasswd`

## SSH-ключ

Инструкция: [deploy/ssh/README.md](deploy/ssh/README.md)

Ротация: замените `deploy/ssh/github_deploy_key` — все `./rebuild` подхватят новый ключ автоматически.
