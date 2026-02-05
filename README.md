# Chat UI

React + TypeScript + Vite chat UI for the backend API.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the API base URL (optional if backend runs on localhost):
   ```bash
   copy .env.example .env
   ```
   Update `VITE_API_URL` in `.env` to match your backend.
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment

- `VITE_API_URL` (default: `http://localhost:8000`)

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - typecheck and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview production build
