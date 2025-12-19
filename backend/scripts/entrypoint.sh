#!/bin/sh
set -e

echo "⏳ Waiting for MongoDB..."
/app/scripts/wait-for-mongo.sh mongodb echo "✅ MongoDB is ready"

# Check if database is already seeded
echo "🔍 Checking if database needs seeding..."
CATEGORIES_COUNT=$(mongosh mongodb://mongodb:27017/sales-report --quiet --eval "db.categories.countDocuments()" 2>/dev/null || echo "0")

if [ "$CATEGORIES_COUNT" = "0" ] || [ -z "$CATEGORIES_COUNT" ]; then
  echo "🌱 Database is empty, running seed..."
  DOCKER_CONTAINER=true npm run seed
  echo "✅ Seed completed!"
else
  echo "✅ Database already has data, skipping seed..."
fi

echo "🚀 Starting development server..."
exec npm run dev

