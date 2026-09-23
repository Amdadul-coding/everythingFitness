# Deploy on Render

The Go backend is hosted at https://fitnessbackend-je96.onrender.com.
Its public workout endpoint needs to allow cross-origin POST and OPTIONS
requests before the separately hosted frontend can call it from a browser.

## Frontend

Commit and push the deployment changes, then create a **Static Site** in Render
from the `Amdadul-coding/everythingFitness` repository:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root directory | Leave blank |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_URL=https://fitnessbackend-je96.onrender.com` |

Vite includes this public URL in the frontend at build time. After changing it,
redeploy the static site. Do not put secrets in `VITE_` variables.

For local development, leave `VITE_API_URL` unset. `npm run dev` will continue
forwarding `/workouts` to the local backend on port 8080.

## Verify and update

Open the static site's public URL, choose a location and muscle group, and check
that workout previews and exercise instructions load. A sleeping free backend
can make the first request take longer.

With Auto-Deploy set to On Commit, push frontend changes to this repository's
`main` branch and backend/JSON changes to `fitnessBackend`'s `main` branch.
Each service rebuilds from its own repository.

References: [Render static sites](https://render.com/docs/static-sites),
[Vite environment variables](https://vite.dev/guide/env-and-mode).
