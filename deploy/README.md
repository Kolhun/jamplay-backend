# JamPlay deploy

Компактная папка для VPS (например `/root/KolhunJamplay/`). Полный репозиторий на сервере не нужен — код клонируется при `docker build`.

## Структура на сервере

```
KolhunJamplay/
├── .env                 # единый конфиг (из .env.example)
├── ssh/
│   └── github_deploy_key
├── secrets/
│   └── htpasswd         # basic auth для админки
├── rebuild-web
├── rebuild-minecraft-admin
├── rebuild-nginx
├── web/                 # Dockerfile + docker-compose.yml
├── minecraft-admin/
├── nginx/
└── common/
    └── rebuild.lib.sh
```

## Первый запуск

```bash
docker network create jamplay-edge

cp .env.example .env
# отредактировать GIT_REPO, GIT_BRANCH

chmod 600 ssh/github_deploy_key
htpasswd -cb secrets/htpasswd admin <password>

chmod +x rebuild-web rebuild-minecraft-admin rebuild-nginx
./rebuild-web
./rebuild-minecraft-admin
./rebuild-nginx
```

## Обновление

```bash
./rebuild-web              # apps/web
./rebuild-minecraft-admin  # apps/minecraft-admin
./rebuild-nginx            # infra/nginx
```

Nginx reload без пересборки:

```bash
docker compose -f nginx/docker-compose.yml --env-file .env exec nginx nginx -s reload
```
