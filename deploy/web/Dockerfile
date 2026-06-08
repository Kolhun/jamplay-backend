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

ARG GIT_BRANCH=main

COPY --from=git-clone /repo/apps/web/package.json /repo/apps/web/package-lock.json* ./
RUN npm ci

COPY --from=git-clone /repo/apps/web/ .
RUN VITE_BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    VITE_GIT_BRANCH="${GIT_BRANCH}" \
    npm run build

FROM nginx:alpine AS runner
RUN apk add --no-cache wget
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
