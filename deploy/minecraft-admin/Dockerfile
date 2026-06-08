ARG GIT_ALPINE_VERSION=2.52.0
ARG GIT_REPO
ARG GIT_BRANCH=main

FROM alpine/git:${GIT_ALPINE_VERSION} AS git-clone
WORKDIR /repo

ARG GIT_REPO
ARG GIT_BRANCH

RUN --mount=type=ssh,id=default \
  git -c core.sshCommand="ssh -o StrictHostKeyChecking=no" \
  clone --branch "${GIT_BRANCH}" --depth 1 ${GIT_REPO} .

FROM node:20-alpine AS build
WORKDIR /app

COPY --from=git-clone /repo/apps/minecraft-admin/package.json /repo/apps/minecraft-admin/package-lock.json* ./
RUN npm ci

COPY --from=git-clone /repo/apps/minecraft-admin/ .
RUN npm run build

FROM nginx:alpine AS runner
RUN apk add --no-cache wget
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
