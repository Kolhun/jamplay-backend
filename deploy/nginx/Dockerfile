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

FROM nginx:alpine AS runner

RUN apk add --no-cache wget \
  && rm -f /etc/nginx/conf.d/default.conf

COPY --from=git-clone /repo/infra/nginx/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=git-clone /repo/infra/nginx/nginx/conf.d/ /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
