#!/bin/sh
# Wait for MongoDB to be ready

set -e

host="$1"
shift
cmd="$@"

echo "⏳ Waiting for MongoDB at $host:27017..."

until nc -z "$host" 27017; do
  echo "⏳ MongoDB is unavailable - sleeping"
  sleep 2
done

echo "✅ MongoDB is up - executing command"
exec $cmd

