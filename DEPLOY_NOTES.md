# Trading Platform - Vercel Deployment Notes

## Vercel Configuration

### Framework Preset
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables
None required - the app uses mock data by default for demo purposes.

### SPA Routing
The `vercel.json` file is configured with rewrites to handle React Router routes properly:
- All routes (`/(.*)`) are rewritten to `/index.html`
- This prevents 404 errors on page refresh for routes like `/trade`, `/markets`, etc.

### Build Process
- Vite handles TypeScript compilation automatically
- No separate TypeScript build step needed
- Output goes to `dist/` directory

### Local Development
```bash
npm install
npm run dev    # Starts Vite dev server
npm run build  # Builds for production
npm run preview # Previews production build
```

### API Handling
- No external API dependencies in production
- Uses mock data for all features
- `server.js` is for local API development only (not used on Vercel)

### Deployment Checklist
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Set build settings as above
- [ ] Deploy
- [ ] Test routes: `/`, `/trade`, `/markets`, `/premium`, `/social-trading`