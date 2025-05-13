# 📝 Nuxt Todo App with Offline Sync

A full-stack Todo application built with **Nuxt 3**, **RxDB** for offline-first local storage, and **Drizzle ORM** with **PostgreSQL** for backend persistence. It features full offline support with sync capabilities.

---

## ✨ Features

- ✅ Add, toggle, and delete todos
- 📶 Offline support using RxDB
- 🔄 Sync changes with PostgreSQL backend
- 🔐 Auth with session-based access
- 🧠 Subscriptions for reactive updates
- 🗃️ Type-safe DB access via Drizzle ORM

---

## 🧱 Tech Stack

- **Frontend**: Nuxt 3, TypeScript, Tailwind CSS
- **Local DB**: RxDB (IndexedDB via PouchDB)
- **Backend**: Nitro server, Drizzle ORM, PostgreSQL
- **Authentication**: Session-based using Nuxt Auth Utils

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/thecodingmontana/todos.git
cd todos
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Setup environment variables

Create a `.env` file in the root:

```.env
NITRO_PORT=3000
NUXT_PUBLIC_SITE_URL="http://localhost:3000"
NUXT_PUBLIC_SITE_NAME="todos"

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/todosdb

# Nuxt auth utils
NUXT_SESSION_PASSWORD= **********
ENCRYPTION_KEY= **********
NUXT_OAUTH_GITHUB_CLIENT_ID= **********
NUXT_OAUTH_GITHUB_CLIENT_SECRET= **********
NUXT_OAUTH_GITHUB_REDIRECT_URL="http://localhost:3000/api/auth/signin/github"
```

## Setup database schema

```bash
pnpm run db:generate
pnpm run db:migrate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 🧪 Notes

- 🗃️ **RxDB** handles todos locally and syncs them with the server when the device is online.
- 🔁 All changes are propagated to the backend using API routes (e.g., `/api/todos/...`).
- 🧠 **Drizzle ORM** ensures type-safe database access and simple query construction.
- 🔔 The UI updates automatically using RxDB’s **subscription mechanism**.
