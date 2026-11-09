# VCheque Next.js Guidelines

This repository contains a Next.js 15+ full-stack application (React 19, TypeScript, Tailwind CSS, Prisma ORM with SQLite).

## Development Commands
- `npm run dev`: Launch local development server on http://localhost:3000
- `npm run build`: Production build with TypeScript and route checking
- `npm run start`: Launch production server
- `npm run test`: Run the Vitest automated test suite (`__tests__/`)
- `npx prisma generate`: Regenerate Prisma Client when `prisma/schema.prisma` is modified
- `npx prisma db push`: Synchronize schema changes with the SQLite database in `data/vcheque.db`

## Architecture Conventions
- **App Router**: Public showcase pages are grouped in `app/(site)`, Admin portal pages are in `app/admin`, and API endpoints are in `app/api`.
- **Database**: Access database models strictly via `@/lib/prisma`.
- **Licensing Engine**: Ed25519 canonical signing and verification logic is located in `@/lib/licensing/ed25519` and managed via `@/lib/licensing/license-manager`.
- **Desktop API Backwards Compatibility**: The `/api/v1/license/*` REST contract must remain strictly backwards-compatible with existing distributed Windows desktop installations.
- **Admin Auth & 2FA**: Protected via `middleware.ts`, JWT HTTP-only sessions in `@/lib/auth/session`, and RFC 6238 TOTP in `@/lib/auth/totp`.
