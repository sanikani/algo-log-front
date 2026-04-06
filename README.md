# AlgoLog Frontend

AlgoLog frontend client built with Vue 3, TypeScript, and Vite.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Vue Query
- Vitest
- ESLint

## Environment

Create a local env file from `.env.example`.

```bash
cp .env.example .env.local
```

Environment variables:

- `VITE_API_BASE_URL`: Spring Boot backend base URL
- `VITE_APP_URL`: frontend app URL used by the backend OAuth redirect bridge

Default local values:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8080`

## Local Run

1. Start the backend in `/mnt/c/project/algolog/algolog`.
2. Ensure GitHub OAuth credentials and frontend redirect settings are configured on the backend.
3. Install frontend dependencies and start Vite.

```bash
npm install
npm run dev
```

The frontend assumes the backend already includes:

- GitHub OAuth login at `/oauth2/authorization/github`
- credential-based session auth for `/api/**`
- frontend redirect/CORS bridge merged from backend issue `#36`

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:watch
npm run check
```

## Git Workflow

- Base branches: `main`, `develop`
- Feature branches: `feature/#issue-number-description`
- Pull requests target `develop`
- Issue and PR templates are synced from the backend repository conventions
