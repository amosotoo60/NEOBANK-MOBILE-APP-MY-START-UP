Backend mock README
===================

This folder contains a simple Express mock server (index.js) and a Prisma schema (prisma/schema.prisma).
To run the mock server locally:
1. cd backend
2. npm install
3. npm start

Prisma: the schema is provided for reference. To use Prisma with a real Postgres DB, configure DATABASE_URL and run migrations:
  npx prisma migrate dev --name init