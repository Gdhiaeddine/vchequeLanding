# VCheque — Next.js 15 Edition

Logiciel professionnel et portail web de gestion et d'impression de chèques bancaires en Algérie.

## Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Langage** : TypeScript
- **Styles & Design** : Tailwind CSS v4 + Design System Luxury Banking (`virtanis.css`)
- **Base de données & ORM** : [Prisma ORM](https://www.prisma.io/) avec SQLite (`data/vcheque.db`)
- **Cryptographie** : Ed25519 avec `libsodium-wrappers` (compatible 100% avec les applications clientes Windows)
- **Authentification & Sécurité** : Sessions stateless JWT (jose) + Authentification à deux facteurs TOTP (RFC 6238)
- **Passerelle de paiement** : Passerelle SlickPay (Cartes CIB & Edahabia)
- **Tests automatisés** : Vitest

---

## Démarrage Rapide

### Prérequis
- Node.js >= 20 (Testé et validé sur Node v24)
- npm ou pnpm

### 1. Installation des dépendances
```bash
npm install
```

### 2. Initialisation de la base de données
```bash
npx prisma generate
```

### 3. Lancement en mode développement
```bash
npm run dev
```
L'application est accessible sur : [http://localhost:3000](http://localhost:3000)

### 4. Lancement des tests
```bash
npm run test
```

### 5. Build de production
```bash
npm run build
npm start
```

---

## Architecture des Dossiers

```
VchequeNext/
├── app/
│   ├── (site)/                  # Pages publiques (Vitrine, Démo, Télécharger, Blog, Contact, CGV)
│   ├── admin/                   # Portail d'administration & Sécurité 2FA (Tableau de bord, Licences, Releases, etc.)
│   ├── api/
│   │   ├── v1/license/          # Endpoints API compatibles client lourd (activate, verify, history, transfer)
│   │   ├── admin/               # Endpoints sécurisés pour la gestion admin
│   │   └── checkout/            # Endpoint de soumission et traitement des paiements SlickPay
│   ├── layout.tsx               # Layout racine Next.js
│   └── globals.css              # Styles globaux Tailwind & Virtanis
├── components/                  # Composants UI React modulaires (Navbar, Footer, Hero, Faq, CopyButton, etc.)
├── data/                        # Données persistantes (vcheque.db, exécutables d'installation)
├── lib/
│   ├── auth/                    # Gestion des sessions JWT et TOTP 2FA
│   ├── licensing/               # Moteur cryptographique Ed25519 & LicenseManager
│   ├── payments/                # Client SlickPay API & Simulation
│   └── prisma.ts                # Client Prisma ORM
├── prisma/                      # Schéma Prisma SQLite (schema.prisma)
├── public/                      # Ressources statiques publiques (polices Space Grotesk, icônes, virtanis.css)
└── __tests__/                   # Suite complète de tests Vitest (Ed25519, TOTP, Licences, API, Checkout)
```

---

## Endpoints API pour le Logiciel Desktop Windows

- `POST /api/v1/license/activate` : Activation d'une licence permanente liée à l'empreinte machine (Hardware ID).
- `POST /api/v1/license/verify` : Contrôle en ligne de la validité de la licence.
- `GET /api/v1/license/history/[key]` : Consultation des postes activés et de l'historique d'audit.
- `POST /api/v1/license/transfer` : Demande de transfert vers une nouvelle machine.

---

## Administration

Accès au portail d'administration : [http://localhost:3000/admin](http://localhost:3000/admin)
- Compte par défaut : `admin@virtanis.net`
- Sécurité renforcée avec vérification 2FA TOTP obligatoire.
