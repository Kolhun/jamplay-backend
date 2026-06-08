FROM node:20-alpine AS build
WORKDIR /app

ARG GIT_BRANCH=local
ENV VITE_BUILD_TIME=""
ENV VITE_GIT_BRANCH=${GIT_BRANCH}

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN VITE_BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)" npm run build

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
