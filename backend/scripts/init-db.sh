#!/bin/sh
# Script to initialize database with seed data

echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

echo "🌱 Running database seed..."
npm run seed

echo "✅ Database initialization completed!"

