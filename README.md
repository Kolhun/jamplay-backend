# jamplay-backend

Monorepo для JamPlay: статическая страница, админка поддомена и nginx reverse proxy. Один Git-репозиторий, три независимых Docker-контейнера на VPS.

## Сервисы

| Сервис | Путь | Домен | Контейнер | Назначение |
|--------|------|-------|-----------|------------|
| **Web** | `apps/web` | [jamplay.ru](https://jamplay.ru) | `jamplay-web` | Landing / debug-страница |
| **Admin** | `apps/minecraft-admin` | [minecraft.jamplay.ru](https://minecraft.jamplay.ru) | `jamplay-admin` | Заглушка админки (будущая загрузка архивов) |
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
cd apps/minecraft-admin && npm install && npm run dev
# http://localhost:5174
```

Production-сборка локально:

```bash
cd apps/web   && npm run build   # → apps/web/dist
cd apps/minecraft-admin && npm run build   # → apps/minecraft-admin/dist
```

## Первый деплой на VPS

На сервер копируется **только папка `deploy/`** (например в `/root/KolhunJamplay/`). Полный репозиторий клонировать не нужно.

```bash
# 1. Docker-сеть (один раз)
docker network create jamplay-edge

# 2. В папке deploy на сервере
cd /root/KolhunJamplay   # или ваш путь

cp .env.example .env
# отредактировать GIT_REPO, GIT_BRANCH

chmod 600 ssh/github_deploy_key
htpasswd -cb secrets/htpasswd admin <password>

chmod +x rebuild-web rebuild-minecraft-admin rebuild-nginx
./rebuild-web
./rebuild-minecraft-admin
./rebuild-nginx
```

Подробнее: [deploy/README.md](deploy/README.md)

## Обновление на сервере

Скрипты в **корне deploy-папки**. Единый `.env` и SSH-ключ `ssh/github_deploy_key`.

| Команда | Когда |
|---------|-------|
| `./rebuild-web` | Изменился `apps/web` |
| `./rebuild-minecraft-admin` | Изменился `apps/minecraft-admin` |
| `./rebuild-nginx` | Изменились конфиги в `infra/nginx` |

Быстрый reload nginx без пересборки:

```bash
docker compose -f nginx/docker-compose.yml --env-file .env exec nginx nginx -s reload
```

## Проверка

- http://jamplay.ru — статика, debug-блок
- http://minecraft.jamplay.ru — админка (логин/пароль из htpasswd)

## Структура репозитория

```
jamplay-backend/
├── apps/web/           # React → jamplay.ru
├── apps/minecraft-admin/  # React → minecraft.jamplay.ru
├── infra/nginx/        # конфиги nginx (в Git)
├── deploy/             # копируется на VPS целиком
│   ├── .env            # единый конфиг (на сервере)
│   ├── ssh/            # github_deploy_key
│   ├── secrets/        # htpasswd
│   ├── rebuild-web     # скрипты в корне deploy
│   ├── rebuild-minecraft-admin
│   ├── rebuild-nginx
│   ├── web/            # Dockerfile + compose
│   ├── minecraft-admin/
│   └── nginx/
└── scripts/
    └── create-network.sh
```

## Переменные окружения (deploy)

| Переменная | Описание |
|------------|----------|
| `GIT_REPO` | `git@github.com:<user>/jamplay-backend.git` |
| `GIT_BRANCH` | Ветка для clone при build (например `main`) |
| `GIT_ALPINE_VERSION` | Версия образа `alpine/git` (по умолчанию `2.52.0`) |

**Не в Git:** `deploy/.env`, `deploy/ssh/github_deploy_key`, `deploy/secrets/htpasswd`

## SSH-ключ

Инструкция: [deploy/ssh/README.md](deploy/ssh/README.md)

Ротация: замените `deploy/ssh/github_deploy_key` — все `./rebuild` подхватят новый ключ автоматически.
