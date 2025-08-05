#!/bin/bash
# Script d'initialisation de la base de données pour Railway

echo "🔧 Initializing database schema..."

# Attendre que MySQL soit prêt
until mysql -h"$MYSQLHOST" -P"$MYSQLPORT" -u"$MYSQLUSER" -p"$MYSQLPASSWORD" -e "SELECT 1"; do
  echo "⏳ Waiting for MySQL to be ready..."
  sleep 2
done

echo "📊 Creating database schema..."
mysql -h"$MYSQLHOST" -P"$MYSQLPORT" -u"$MYSQLUSER" -p"$MYSQLPASSWORD" "$MYSQLDATABASE" < /app/server/database/schema.sql

echo "✅ Database initialized successfully!"