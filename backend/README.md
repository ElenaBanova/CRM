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
├── seed.ts            One-off script: creates the administrator (admin@gmail.com / admin)
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

1. Leads (orders) are created from outside the system, e.g. by a lead-capture form calling the public `POST /orders`; managers then work them through the API.
2. An admin creates manager accounts (`POST /users`) and generates an activation / password-recovery link, which they pass to the manager through any channel (email, Telegram, etc.).
3. A manager logs in (`POST /auth/sign-in`) and receives a token pair: `accessToken` (short-lived, sent with every request) and `refreshToken` (long-lived, only used to get a new `accessToken` once the old one expires).
4. A manager sees the list of orders (`GET /orders`). A new order (status `New` or empty) is not assigned to anyone. It becomes "claimed" (status `In work`, assigned to that manager) only when the manager actually changes one of its fields or leaves a comment; after that no other manager can edit or comment on it.
5. An order moves through statuses: `New → In work → Agree / Disagree / Dubbing`.
6. Every interaction with an order can be logged as a comment.

## Installation and Running

### Option 1 — via Docker (recommended)

See the root [`README.md`](../README.md) — backend, frontend and nginx come up with a single `docker compose up --build` command. MongoDB is not part of the compose stack: set `MONGO_URI` in `.env` to your database (e.g. a free MongoDB Atlas cluster). On an empty database, create the administrator first: `docker compose exec backend npm run seed` (see the root README, section "First start").

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

# 4. Go back into backend and create the administrator (first run only):
#    creates admin@gmail.com / admin
cd backend
npm run seed
# optional: npm run seed:demo — the administrator plus 3 groups and 60 demo orders (added only if there are no orders yet).

# 5. Start the server in dev mode
npm start
```

`npm start` rebuilds TypeScript in the background and restarts the server whenever files change (`tsc-watch` + `tsx --watch`). There isn't a separate production build script (`build`) in the project yet.

> Always start the backend from the `backend/` folder: `backend/src/configs/config.ts` loads the environment with `dotenv.config({ path: "../.env" })`, and that path is resolved relative to the folder the process is started from.

Once started, the server listens on the port set in `.env` (`PORT`), e.g. `http://localhost:5000`.

## Environment Variables (.env)

The `.env` file must live at the **repo root** (one level above `backend/`), because `backend/src/configs/config.ts` loads it as `dotenv.config({ path: "../.env" })`.

The template is [`.env.example`](../.env.example) at the repo root.

| Variable                | What it is | Example                           |
|-------------------------| --- |-----------------------------------|
| `PORT`                  | port Express listens on | `5000`                            |
| `MONGO_URI`             | MongoDB connection string | `mongodb://localhost:27017/crm`, `mongodb+srv://<user>:<pass>@<cluster>/crm` |
| `JWT_ACCESS_SECRET`     | signing secret for access tokens | any long random string            |
| `JWT_REFRESH_SECRET`    | signing secret for refresh tokens | any long random string            |
| `JWT_ACCESS_LIFETIME`   | access token lifetime | `10m`                             |
| `JWT_REFRESH_LIFETIME`  | refresh token lifetime | `1d`                              |
| `JWT_ACTIVATE_SECRET`   | signing secret for account-activation links | any long random string            |
| `JWT_ACTIVATE_LIFETIME` | expiry for activation links | `30m`                             |
| `JWT_RECOVERY_SECRET`   | signing secret for password-recovery links | any long random string            |
| `JWT_RECOVERY_LIFETIME` | expiry for recovery links | `30m`                             |
| `FRONTEND_URL`          | base URL for the frontend, used to build activation/recovery links shared by an admin through any channel | `http://localhost:3000` (frontend run standalone) or `http://localhost:8080` (Docker / nginx) |

> Secrets (`JWT_*_SECRET`) are just arbitrary strings the server uses to sign tokens. Never commit real `.env` values to git — the file is already listed in `.gitignore`.

## Authentication and Roles

The project uses **JWT (JSON Web Token)** — instead of server-side sessions, the client holds a signed token and sends it with every request.

- **Access token** — sent in the `Authorization: Bearer <accessToken>` header, short-lived, required for all protected requests.
- **Refresh token** — sent in the body of a request to `/auth/refresh`, longer-lived, only used to get a new token pair without forcing the user to log in again.

Middleware chain (file `src/middlewares/auth.middleware.ts`):
1. `checkAccessToken` / `checkRefreshToken` — the token exists and is signed with the correct secret.
2. `isBlock` — the user doesn't have the `blockUser` flag set (accounts blocked by an admin can't do anything). A blocked account receives `403 "Account is blocked"`.
   Related 403 messages:
    - `"Account is blocked"` — a blocked user signs in (`POST /auth/sign-in`) or sends any request with an existing token;
    - `"Target user is blocked"` — an admin generates an activation/recovery link (`POST /auth/activate/:id`, `POST /auth/recovery/:id`) for a blocked user;
    - `"No permitted"` — an admin tries to ban/unban their own account (`PATCH /users/:id/:action`).
   Related 401 messages:
    - `"Invalid email or password"` — wrong credentials **or** an account that has not been activated yet (the same message on purpose, so the API does not reveal whether such an account exists);
    - `"Invalid or expired token"` — an activation/recovery link that has already been used, has expired, or is invalid. These links are one-time: they are signed with the user's current password hash, so setting a password invalidates the link (`"Invalid or expired link"` if the link cannot be parsed at all).
3. `isAdmin` — used wherever the `admin` role specifically is required.
4. `managerValid` (orders only; `PATCH /orders/:id` and `POST /orders/:id`) — if an order is already assigned to a manager, only that manager can edit it or comment on it; anyone else gets `403 "No has permission"`. An unassigned order (status `New` or empty) belongs to nobody: the first manager who actually changes one of its fields or leaves a comment claims it (status becomes `In work`). The same ownership rule is also enforced in the service layer (`OrderService.assertCanModify`, `403 "Order is assigned to another manager"`).

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

## Postman Collection

A ready-to-import Postman collection is in [`postman/`](postman/). Import `CRM.postman_collection.json` (and `CRM.postman_environment.json`) into Postman, set the base URL variable to `http://localhost:5000` (backend run standalone) or `http://localhost:8080/api` (Docker), and sign in with `POST /auth/sign-in` first; the other requests use the saved access token.

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

| Method | Path                     | Access | Request body |
| --- |--------------------------| --- | --- |
| GET | `/users` | admin only | query: `page`, `pageSize` (paginated) |
| POST | `/users`                 | admin only | `{ name, surname, email }` (all required) |
| GET | `/users/:id`             | any authenticated user | — |
| PATCH | `/users/:id`             | admin only | `{ name?, surname?, email? }` |
| PATCH | `/users/:id/role-update` | admin only | — (toggles role admin ⇄ manager) |
| PATCH | `/users/:id/:action` | admin only, can't block yourself | — (`:action` is `ban` or `unban`; sets the `blockUser` flag accordingly) |

> `GET /users/:id` is marked in the code as accessible to any authenticated user (the admin check is commented out) — this is the current behavior, not a documentation mistake.

> `GET /users` is paginated (`page`, `pageSize` query parameters). The response has the shape `{ totalItems, totalPages, prevPage, nextPage, data, totalStatistic }`, default `pageSize` is `10`. The current admin is always returned first on the first page; the remaining users follow in descending `_id` order. Each user also includes:
> - `rowNumber` — the user's sequential number (based on creation order, stays the same regardless of the page);
> - `lastLogin` — date of the user's most recent login (`null` if they have never logged in);
> - `statistic` — the user's order counts: `{ total, new, inWork, agree, disagree, dubbing }`.
>
> `totalStatistic` (top level) has the same shape and counts all orders. The admin panel gets everything in a single request. Passwords are never returned.

### Groups (`/groups`) — all require an access token

| Method | Path | Request body |
| --- | --- | --- |
| GET | `/groups` | — |
| POST | `/groups` | `{ name }` (required) |
| GET | `/groups/:id` | — |

> `POST /groups` returns `400 "Group already exists"` if a group with that name exists.

### Orders + Comments (`/orders`) — all require an access token, except `POST /orders`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/orders` | authenticated | paginated, filterable, sortable list |
| GET | `/orders/excel` | authenticated | same filters, no pagination (used for `.xlsx` export) |
| POST | `/orders` | **public** (no token) | creates a lead (used by the external lead-capture form); `name` and `phone` are required, other fields are optional | |
| GET | `/orders/:id` | authenticated | a single order |
| PATCH | `/orders/:id` | the assigned manager (or any manager, if the order is unassigned) | updates order fields. An unassigned order is claimed (`In work`, assigned to you) only when at least one field actually changes; setting the status back to `New` releases it |
| GET | `/orders/:id/comments` | authenticated | list of comments on the order |
| POST | `/orders/:id` | the assigned manager (or any manager, if the order is unassigned) | **creates a comment**, not an update. The first comment on an unassigned `New` order claims it (status `In work`) |

Query parameters for `GET /orders` and `GET /orders/excel`: `pageSize`, `page` (only for `/orders`), `name`, `surname`, `email`, `phone`, `age`, `course`, `course_format`, `course_type`, `status`, `group` (group name), `manager`, `dateFrom`, `dateTo`, `order` (sort field, see `OrderQueryOrderEnum` below; prefix with `-` for descending order, e.g. `-created_at`).

`dateFrom` / `dateTo` are ISO dates (a `created_at` range). Every order in the response also includes `managerInfo` (the assigned manager's full name, empty if unassigned) and `groupName` (empty if no group), so the client does not need extra requests to resolve them.

## Enum Reference (Allowed Values)

| Enum | Values |
| --- | --- |
| `RoleEnum` | `admin`, `manager` |
| `CoursesEnum` | `FS`, `QACX`, `JCX`, `JSCX`, `FE`, `PCX` |
| `FormatCoursesEnum` | `static`, `online` |
| `TypeCoursesEnum` | `pro`, `minimal`, `premium`, `incubator`, `vip` |
| `StatusOrdersEnum` | `New`, `In work`, `Agree`, `Disagree`, `Dubbing` |
| `OrderQueryOrderEnum` (sort fields) | `_id`, `name`, `surname`, `email`, `phone`, `age`, `course`, `course_format`, `course_type`, `status`, `sum`, `already_paid`, `created_at`, `group`, `manager` |

