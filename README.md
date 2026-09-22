# Everything Fitness

A blank Vite + React + TypeScript website, following the frontend structure of `../personal-website`. Includes React Router and a shared layout ready for future pages.

## Getting started

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal. The home page is intentionally blank.

## Structure

```text
src/
  Components/
    Layouts/
      MainLayout.tsx   Shared page layout
  Pages/
    Home.tsx           Blank home page
  assets/              Images and other imported files
  styles/              Page/component CSS modules
  index.css            Global styles
  main.tsx             React entry point and routes
  vite-env.d.ts        Vite TypeScript definitions
index.html             HTML entry point
vite.config.ts         Vite configuration
```

## Build and preview

```sh
npm run build    # Type-check and build into dist/
npm run preview  # Preview the production build locally
```

For domain hosting, configure your static host with `npm run build` as the build command and `dist` as the publish directory. If you add more routes, configure the host to fall back to `index.html` for client-side routing. Then connect your domain through the host. See the [Vite deployment guide](https://vite.dev/guide/static-deploy).

## Workout API

Start the Go backend in `../fitnessBackend` with `go run .`, then start this website with `npm run dev`.
Vite forwards `/workouts` requests to `http://localhost:8080` during development.

Import the helper wherever you need workouts (for example, from `src/Pages/Home.tsx`):

```ts
import { getWorkouts, type Workout } from '../backend';

const workouts: Workout[] = await getWorkouts('chest', 'gym');
```

Call it from an event handler or a data-loading effect and catch errors to display them in the UI.
The helper rejects failed requests and trusts the backend JSON to match the `Workout[]` type.
Each workout contains `bodyParts`, `gifUrl`, `targetMuscles`, and `instructions`.
The backend accepts target muscle names such as `triceps`, `biceps`, and `quads`, plus the `chest` alias.

For production, configure your host/reverse proxy to forward `/workouts` to the deployed backend before the frontend fallback. The Vite development proxy is not included in the static build.
