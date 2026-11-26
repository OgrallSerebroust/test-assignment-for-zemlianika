ARG GROUP_NAME="zemlianika"
ARG USER_NAME="zemlianika"
ARG GID="2611"
ARG UID="2611"

# STAGE 1 --> Dependencies installation
FROM node:24-bookworm-slim AS dependencies
ARG GROUP_NAME
ARG USER_NAME
ARG GID
ARG UID
RUN groupadd --gid "${GID}" "${GROUP_NAME}" \
    && useradd --uid "${UID}" --gid "${GID}" --create-home --no-log-init "${USER_NAME}" \
    && install -d -o "${USER_NAME}" -g "${GROUP_NAME}" /app
ENV HOME=/home/${USER_NAME}
WORKDIR /app
COPY package.json package-lock.json ./
USER ${USER_NAME}:${GROUP_NAME}
RUN --mount=type=cache,target=${HOME}/.npm,uid=${UID},gid=${GID},sharing=locked \
    npm ci

# STAGE 2 --> Builder
FROM dependencies AS development
ARG GROUP_NAME
ARG USER_NAME
COPY --chown=${USER_NAME}:${GROUP_NAME} . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--strictPort"]

FROM development AS builder
RUN npm run build

# STAGE 3 --> Application
FROM nginxinc/nginx-unprivileged:stable-alpine AS application
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /var/www/frontend/
EXPOSE 8080
