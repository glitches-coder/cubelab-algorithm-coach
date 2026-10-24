# Deploy CubeLab from your phone (no npm required)

## Recommended: GitHub + Netlify

Netlify can install dependencies, run the Vite production build, and publish the `dist` folder on its own. The included `netlify.toml` sets the build command and publish directory, and `public/_redirects` adds the SPA fallback.

### Connect Netlify

1. Open <https://app.netlify.com/start> and sign in.
2. Choose **Import an existing project** / **Deploy from Git**.
3. Select GitHub and authorize Netlify to access this repository.
4. Select `glitches-coder/cubelab-algorithm-coach` and the `main` branch.
5. Confirm these build settings if needed:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy** and monitor the deploy log until it reports success.

You do not need npm or Node.js on your phone; Netlify runs the build on its own infrastructure. Once connected, new commits pushed to `main` automatically trigger new deployments.

## Files expected in the repository

- `index.html`
- `package.json`
- `netlify.toml`
- `README.md`
- `DEPLOY_FROM_PHONE.md`
- `public/_redirects`
- `src/main.jsx`
- `src/styles.css`
- `src/components/MoveDiagram.jsx`
- `src/data/algorithms.js`

## Important notes

- This is a frontend-only React/Vite app and currently needs no backend or environment secrets to build.
- A successful deployment confirms that the app builds and is hosted; it does not mean the starter algorithms are a complete, independently verified OLL/PLL/F2L database.
- If deployment fails, open the deploy's build log and share the error text so the configuration or code can be corrected.
