# Unified Dockerfile for deploying to Render / Railway
# For local development, use docker-compose.yml instead

# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build

# Stage 2: Build backend
ARG RUBY_VERSION=3.4.9
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS backend-build

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

COPY backend/vendor/* ./vendor/
COPY backend/Gemfile backend/Gemfile.lock ./

RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile -j 1 --gemfile

COPY backend/ .

RUN bundle exec bootsnap precompile -j 1 app/ lib/

# Stage 3: Final production image
FROM docker.io/library/ruby:$RUBY_VERSION-slim

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 postgresql-client nginx gettext-base && \
    ln -s /usr/lib/$(uname -m)-linux-gnu/libjemalloc.so.2 /usr/local/lib/libjemalloc.so && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
    rm -f /etc/nginx/sites-enabled/default

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development" \
    LD_PRELOAD="/usr/local/lib/libjemalloc.so"

WORKDIR /rails

# Copy backend gems and app
COPY --from=backend-build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=backend-build /rails /rails

# Copy frontend build output
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx config and startup script
COPY nginx.deploy.conf /etc/nginx/conf.d/app.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
