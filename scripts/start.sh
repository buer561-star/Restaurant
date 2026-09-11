#!/bin/sh
set -e
# Datenbank-Migrationen anwenden, dann Server starten
node ./node_modules/prisma/build/index.js migrate deploy
exec node server.js
