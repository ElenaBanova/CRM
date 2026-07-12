# CRM Backend (Express + TypeScript + MongoDB)

This is the backend of the CRM system for managing course-sales leads ("orders"): capturing leads, letting managers work them, comments, groups, users, and roles.

If you're new to Node.js/Express, this README is written so you can get the project running and understand it without reading through all the source code first.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [How It All Works (High-Level Flow)](#how-it-all-works-high-level-flow)
- [Installation and Running](#installation-and-running)
- [Environment Variables (.env)](#environment-variables-env)
- [Authentication and Roles](#authentication-and-roles)
- [Swagger — Interactive API Documentation](#swagger--interactive-api-documentation)
- [Full Endpoint Reference](#full-endpoint-reference)
- [Enum Reference (Allowed Values)](#enum-reference-allowed-values)

## Tech Stack

| Technology | What it's for |
| --- | --- |
| **Node.js + TypeScript** | server language and runtime |
| **Express** | HTTP framework — routing, middleware, request handling |
| **MongoDB + Mongoose** | database (document-based, NoSQL) and ODM for defining schemas/models |
| **JWT (jsonwebtoken)** | issuing and verifying authorization tokens |
| **Joi** | validation of request bodies and query parameters |
| **bcrypt** | hashing passwords before they're saved to the database |
| **swagger-ui-express + openapi-types** | interactive API documentation |

The project is set up as an ESM module (`"type": "module"` in `package.json`), so the code uses `import`/`export` rather than `require`.

## Folder Structure

```
backend/src/
├── main.ts            Entry point: Express setup, MongoDB connection, server startup
├── configs/            Configuration (environment variables, the Swagger document)
├── routers/            Map a URL + HTTP method to a controller (plus the middleware chain)
├── controllers/        Parse the request (req) and shape the response (res); no business logic
├── services/           Business logic: what actually needs to happen to the data
├── repositories/        Direct MongoDB access through Mongoose models
├── models/             Mongoose schemas (the shape of documents in the database)
├── validators/         Joi schemas for validating incoming data
├── middlewares/         Cross-cutting functions: token checks, validation, permission checks
├── interfaces/          TypeScript types (data shapes)
├── enums/               Sets of allowed values (roles, statuses, courses, etc.)
└── errors/               ApiError class for consistent error responses
```

**Request path in this project:** `router → middleware (token check / permission check / validation) → controller → service → repository → MongoDB`.

Example: a `PATCH /orders/:id` request first goes through the `router` (`order.router.ts`), then through several `middleware` functions (token check, verifying the manager is allowed to edit this specific order, body validation), and only then reaches `order.controller.ts` → `order.service.ts` → `order.repository.ts`.

## How It All Works (High-Level Flow)

1. Anyone (without registering) should be able to submit a lead for a course.
2. An admin creates manager accounts (`POST /users`) and sends them an activation / password-recovery link by email.
3. A manager logs in (`POST /auth/sign-in`) and receives a token pair: `accessToken` (short-lived, sent with every request) and `refreshToken` (long-lived, only used to get a new `accessToken` once the old one expires).
4. A manager sees the list of orders (`GET /orders`) and can pick one up — as soon as they update the order or leave a comment on it once, that order becomes "claimed" by them, and no other manager can edit it afterwards.
5. An order moves through statuses: `New → In work → Agree / Disagree / Dubbing`.
6. Every interaction with an order can be logged as a comment.

## Installation and Running

### Option 1 — via Docker (recommended if you don't want to install MongoDB locally)

See the root [`README.md`](../README.md) — the whole stack (backend + frontend + MongoDB + nginx) comes up with a single `docker compose up --build` command.

### Option 2 — running the backend standalone, without Docker

You'll need:
- Node.js (tested on version 24 — see the `Dockerfile`, image `node:24-alpine`)
- A running MongoDB instance (local or cloud, e.g. MongoDB Atlas)

Steps:

```bash
# 1. Go into the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file at the repo root (one level above the backend/ folder)
#    and fill it in based on .env.example — see the next section
cd ..
cp .env.example .env

# 4. Go back into backend and start the server in dev mode
cd backend
npm start
```

`npm start` rebuilds TypeScript in the background and restarts the server whenever files change (`tsc-watch` + `tsx --watch`). There isn't a separate production build script (`build`) in the project yet.

Once started, the server listens on the port set in `.env` (`PORT`), e.g. `http://localhost:5000`.

## Environment Variables (.env)

The `.env` file must live at the **repo root** (one level above `backend/`), because `backend/src/configs/config.ts` loads it as `dotenv.config({ path: "../.env" })`.

The template is [`.env.example`](../.env.example) at the repo root.

| Variable | What it is | Example |
| --- | --- | --- |
| `PORT` | port Express listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/crm` |
| `JWT_ACCESS_SECRET` | signing secret for access tokens | any long random string |
| `JWT_REFRESH_SECRET` | signing secret for refresh tokens | any long random string |
| `JWT_ACCESS_LIFETIME` | access token lifetime | `15m` |
| `JWT_REFRESH_LIFETIME` | refresh token lifetime | `30d` |
| `JWT_ACTIVATE_SECRET` | signing secret for account-activation links | any long random string |
| `JWT_ACTIVATE_LIFETIME` | expiry for activation links | `1d` |
| `JWT_RECOVERY_SECRET` | signing secret for password-recovery links | any long random string |
| `JWT_RECOVERY_LIFETIME` | expiry for recovery links | `1h` |
| `FRONTEND_URL` | base URL for the frontend, used when building activation/recovery links sent by email | `http://localhost:3000` |

> Secrets (`JWT_*_SECRET`) are just arbitrary strings the server uses to sign tokens. Never commit real `.env` values to git — the file is already listed in `.gitignore`.

## Authentication and Roles

The project uses **JWT (JSON Web Token)** — instead of server-side sessions, the client holds a signed token and sends it with every request.

- **Access token** — sent in the `Authorization: Bearer <accessToken>` header, short-lived, required for all protected requests.
- **Refresh token** — sent in the body of a request to `/auth/refresh`, longer-lived, only used to get a new token pair without forcing the user to log in again.

Middleware chain (file `src/middlewares/auth.middleware.ts`):
1. `checkAccessToken` / `checkRefreshToken` — the token exists and is signed with the correct secret.
2. `isBlock` — the user doesn't have the `blockUser` flag set (accounts blocked by an admin can't do anything).
3. `isAdmin` — used wherever the `admin` role specifically is required.
4. `managerValid` (orders only) — if an order is already claimed by a manager, only that manager can edit it; if the order is unclaimed, the first manager to touch it claims it.

Two roles (`src/enums/role.enum.ts`):

| Role | Can do |
| --- | --- |
| `admin` | create/update users, change roles, block/unblock accounts, generate activation and password-recovery links, work with any order or group without restriction |
| `manager` | work with orders (view, claim, comment, update status) within the restrictions described above |

## Swagger — Interactive API Documentation

The project has Swagger UI (`swagger-ui-express`) wired up; the API description lives in `src/configs/swagger.config.ts` and is mounted in `src/main.ts`.

Once the backend is running, open in your browser:

```
http://localhost:<PORT>/docs
```

for example, with `PORT=5000` that's `http://localhost:5000/docs`. Through nginx (if the whole stack is running via Docker Compose) — `http://localhost:8080/api/docs`.

There you can browse every endpoint, request/response schemas, and send test requests straight from the browser (for protected routes, click "Authorize" and paste in an access token).

## Full Endpoint Reference

Base URL without Docker: `http://localhost:<PORT>` (routes are mounted with no `/api` prefix — only nginx adds the `/api` prefix externally).

### Auth (`/auth`)

| Method | Path | Access | Request body |
| --- | --- | --- | --- |
| POST | `/auth/sign-in` | public | `{ email, password }` |
| POST | `/auth/refresh` | requires refresh token | `{ refreshToken }` |
| GET | `/auth/me` | requires access token | — |
| POST | `/auth/activate/:id` | admin only | — (returns an activation link) |
| POST | `/auth/recovery/:id` | admin only | — (returns a password-recovery link) |
| POST | `/auth/password/create/:token` | via token from the activation link | `{ password }` |
| POST | `/auth/password/recovery/:token` | via token from the recovery link | `{ password }` |

### Users (`/users`) — all require an access token

| Method | Path | Access | Request body |
| --- | --- | --- | --- |
| GET | `/users` | admin only | — |
| POST | `/users` | admin only | `{ name, surname, email }` (all required) |
| GET | `/users/:id` | any authenticated user | — |
| PATCH | `/users/:id` | admin only | `{ name?, surname?, email? }` |
| PATCH | `/users/:id/role-update` | admin only | — (toggles role admin ⇄ manager) |
| PATCH | `/users/:id/block-unblock` | admin only, can't block yourself | — (toggles the `blockUser` flag) |

> `GET /users/:id` is marked in the code as accessible to any authenticated user (the admin check is commented out) — this is the current behavior, not a documentation mistake.

### Groups (`/groups`) — all require an access token

| Method | Path | Request body |
| --- | --- | --- |
| GET | `/groups` | — |
| POST | `/groups` | `{ name }` (required) |
| GET | `/groups/:id` | — |

### Orders + Comments (`/orders`) — all require an access token

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/orders` | authenticated | paginated, filterable, sortable list |
| GET | `/orders/excel` | authenticated | same filters, no pagination (used for `.xlsx` export) |
| GET | `/orders/:id` | authenticated | a single order |
| PATCH | `/orders/:id` | the claiming manager (or anyone, if unclaimed) | updates order fields |
| GET | `/orders/:id/comments` | authenticated | list of comments on the order |
| POST | `/orders/:id` | the claiming manager (or anyone, if unclaimed) | **creates a comment**, not an update — yes, the path looks like an "update" but the POST method means "add a comment" |

Query parameters for `GET /orders` and `GET /orders/excel`: `pageSize`, `page` (only for `/orders`), `name`, `surname`, `email`, `phone`, `age`, `course`, `course_format`, `course_type`, `status`, `group`, `manager`, `order` (sort field, see `OrderQueryOrderEnum` below; prefix with `-` for descending order, e.g. `-created_at`).

## Enum Reference (Allowed Values)

| Enum | Values |
| --- | --- |
| `RoleEnum` | `admin`, `manager` |
| `CoursesEnum` | `FS`, `QACX`, `JCX`, `JSCX`, `FE`, `PCX` |
| `FormatCoursesEnum` | `static`, `online` |
| `TypeCoursesEnum` | `pro`, `minimal`, `premium`, `incubator`, `vip` |
| `StatusOrdersEnum` | `New`, `In work`, `Agree`, `Disagree`, `Dubbing` |
| `OrderQueryOrderEnum` (sort fields) | `_id`, `name`, `surname`, `email`, `phone`, `age`, `course`, `course_format`, `course_type`, `status`, `sum`, `already_paid`, `created_at`, `group`, `manager` |

