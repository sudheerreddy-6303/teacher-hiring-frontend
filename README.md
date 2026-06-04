# AcadHr Frontend

React app for AcadHr Teacher Hiring Platform.

## Deploy on Vercel (Recommended)

### 1. Push to GitHub
```bash
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/YOUR/acadhr-frontend.git
git push -u origin main
```

### 2. Deploy on Vercel
- Go to vercel.com → New Project → Import from GitHub
- Select this repo
- Framework: Create React App (auto-detected)

### 3. Set Environment Variable in Vercel
| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | `https://your-backend.up.railway.app/api` |

### 4. Redeploy after setting the env var

## Deploy on Netlify
- Import from GitHub
- Build command: `npm run build`
- Publish directory: `build`
- Add env var: `REACT_APP_API_URL`
