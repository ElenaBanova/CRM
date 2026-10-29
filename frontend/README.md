# CRM Frontend (Next.js)

Client application for the CRM system: login, working with leads ("orders"), comments, and an admin panel for managing managers. It talks to the Express API from [`../backend`](../backend/README.md).

## Tech Stack

| Technology | What it's for |
| --- | --- |
| **Next.js 16 (App Router)** + **React 19** | pages, server components, server actions |
| **TypeScript** | typing |
| **axios** | HTTP client (separate instances for server and client code, with an error interceptor) |
| **Tailwind CSS 4** + plain CSS files | styling |
| **Joi** | form validation |
| **cookies-next** | storing access/refresh tokens in cookies |
| **exceljs** | exporting the filtered orders list to `.xlsx` |
| **sonner** | toast notifications |
| **use-debounce** | debounced search inputs |

## Pages

| Route | Description |
| --- | --- |
| `/login` | sign in with email and password |
| `/orders` | paginated, filterable and sortable list of orders; edit window, comments, Excel export |
| `/adminPanel` | admin only: create managers, generate activation/recovery links, ban/unban, view statistics |
| `/activate/[token]` | set the initial password from an activation link |
| `/recovery/[token]` | set a new password from a recovery link |

`src/proxy.ts` guards `/orders` and `/adminPanel`: if the access token has expired it silently refreshes it with the refresh token, otherwise redirects to `/login`.

## Project Structure

```
src/
├── app/                Routes (App Router), error.tsx / global-error.tsx
├── components/         UI components with their CSS (orders, pagination, search, admin panel, menu, toast)
├── api-services/       axios instances and API calls (auth, users, orders, comments, groups)
├── server-actions/     Server actions ("use server"): login, order edit, create manager, password activation/recovery
├── validators/         Joi schemas for forms
├── interfaces/         TypeScript types
├── constants/          API urls, search options
├── hooks/              Custom hooks
├── utils/              Helpers (dates, Excel export, blocked-account and redirect handling)
└── proxy.ts            Token check/refresh before protected pages
```

## Running

### With Docker (recommended)

Run the whole stack from the repo root — see the root [`README.md`](../README.md). The app is available at **http://localhost:8080**.

### Standalone

The backend must be running first.

```bash
cd frontend
npm install
npm run dev      # development, http://localhost:3000
```

Production-like run: `npm run build && npm start`.

## Environment Variables

The frontend reads the shared `.env` from the repo root (Docker Compose passes it via `env_file`). When running standalone, create a `.env` file in `frontend/` with:

| Variable | Description | Example |
| --- | --- | --- |
| `BASE_URL` | Base URL of the backend API | `http://localhost:5000` (standalone) or `http://backend:5000` (Docker) |
| `ACCESS_LIFETIME` | Lifetime of the access-token cookie, in seconds (should match `JWT_ACCESS_LIFETIME` on the backend) | `600` |

## Authentication

Tokens are stored in cookies. Requests from the server and from the client go through axios instances that attach `Authorization: Bearer <accessToken>`. Expired access tokens are refreshed in `proxy.ts`.

## Error Handling & Blocked Accounts

- `error.tsx` / `global-error.tsx` show a friendly "Something went wrong" page with a retry button.
- An axios interceptor detects `403 "Account is blocked"` and redirects the user to `/login`; signing in with a blocked account shows a message in the form.
- Server actions rethrow Next.js redirects and turn backend failures into readable messages.
- In the admin panel, an admin cannot ban themselves and sees no action buttons on their own card; the admin is always listed first.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm start` | run the production build |
| `npm run lint` | ESLint |