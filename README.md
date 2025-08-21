# React + Hono Template

A modern full-stack TypeScript template combining React frontend with Hono backend, designed for rapid development and production deployment.

## How to Run

### Prerequisites

- Node.js >=22.14.0
- pnpm >=10.11.0

### Development

```bash
# Install dependencies
pnpm install

# Start development server (both frontend and backend)
pnpm dev
```

This will start:

- Backend server on http://localhost:4001
- Frontend dev server on http://localhost:4000 (proxies API calls to backend)

### Individual Components

```bash
# Start only the backend server
pnpm dev:server

# Start only the frontend (requires backend to be running)
pnpm dev:vite
```

### Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Server state management and caching
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety across the entire stack

### Backend

- **Hono** - Fast, lightweight web framework for TypeScript
- **@hono/node-server** - Node.js adapter for Hono
- **Zod** - Schema validation and type inference
- **@t3-oss/env-core** - Type-safe environment variable validation

### Development Tools

- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **tsx** - TypeScript execution for development
- **esbuild** - Fast bundling for production builds

## Runtime Environment Variables (`/api/runtime.js`)

The template includes a special endpoint at `/api/runtime.js` that dynamically injects environment variables into the client at runtime. This script is loaded in `index.html`:

```html
<script type="text/javascript" src="/api/runtime.js"></script>
```

### Why This Exists

This pattern solves a critical problem with client-side environment variables in containerized/production deployments:

1. **Build-time vs Runtime**: Vite normally bakes environment variables into the bundle at build time via `import.meta.env`
2. **Container Flexibility**: With Docker/K8s, you want to build once and deploy anywhere with different env vars
3. **Dynamic Configuration**: The `/api/runtime.js` endpoint serves a JavaScript snippet that sets `window.__env` with current server environment variables

### How It Works

1. **Server endpoint** (`server/index.ts` lines 13-21):

   ```typescript
   .get("/api/runtime.js", (c) => {
     return c.text(
       `window.__env = ${JSON.stringify(
         Object.fromEntries(
           Object.entries(env).filter(([key]) => key.startsWith("VITE_"))
         ), null, 2
       )}`,
       200,
       { "Content-Type": "application/javascript" }
     );
   })
   ```

2. **Client consumption** (`src/env.ts`):

   ```typescript
   export const env: Env = {
     VITE_APP_URL: window.__env?.VITE_APP_URL ?? import.meta.env.VITE_APP_URL,
     // Falls back to build-time values if runtime values unavailable
   };
   ```

3. **Type safety**: Both server and client env configs use Zod schemas for validation

This approach provides:

- ✅ **Container-friendly**: Same build works across environments
- ✅ **Type-safe**: Full TypeScript support for env vars
- ✅ **Fallback support**: Works in development with build-time values
- ✅ **Secure**: Only `VITE_` prefixed variables are exposed to client

## Project Structure

```
react-hono-template/
├── server/                 # Backend Hono server
│   ├── index.ts           # Main server entry point
│   └── env.ts             # Server environment validation
├── src/                   # Frontend React application
│   ├── routes/            # File-based routing
│   ├── env.ts             # Client environment variables
│   ├── main.tsx           # React app entry point
│   └── globals.css        # Global styles
├── dist/                  # Production build output
│   ├── static/            # Frontend static assets
│   └── index.cjs          # Bundled server
└── tests/                 # Test files
```

## Scripts

- `pnpm dev` - Start development environment
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts and dependencies

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required for client
VITE_APP_URL=http://localhost:4000

# Server configuration
NODE_ENV=development
```

All `VITE_` prefixed variables are automatically exposed to the client through the runtime.js mechanism.
