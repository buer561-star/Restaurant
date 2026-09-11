#!/bin/sh
# Startet den Standalone-Build lokal so, wie Railway ihn ausführt.
set -e
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cd .next/standalone && PORT=${PORT:-3100} HOSTNAME=localhost exec node server.js
