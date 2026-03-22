#!/bin/bash
set -e

PORT="${PORT:-80}"
export PORT

# Substitute $PORT in nginx config
envsubst '${PORT}' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

# Prepare database (create/migrate)
cd /rails
./bin/rails db:prepare

# Start Rails in the background
./bin/rails server -p 3000 &

# Start nginx in the foreground
nginx -g "daemon off;"
