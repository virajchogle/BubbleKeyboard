# Quick Deployment Guide

## Deploy to Vercel (3 minutes)

### Step 1: Install Vercel CLI (if you haven't)
```bash
npm install -g vercel
```

### Step 2: Initialize Git (required for deployment)
```bash
git init
git add .
git commit -m "Initial commit - Bubble Keyboard"
```

### Step 3: Deploy
```bash
vercel
```

**Follow the prompts:**
- "Set up and deploy?" → **Yes**
- "Which scope?" → Choose your account
- "Link to existing project?" → **No**
- "What's your project's name?" → `bubble-keyboard` (or whatever you want)
- "In which directory is your code located?" → `./` (press Enter)
- Wait for build... Done! ✅

### Step 4: Add Environment Variable
After first deploy, add your API key:

**Option A: Via CLI**
```bash
vercel env add VITE_GEMINI_API_KEY
```
Then paste your API key when prompted.
Select: **Production, Preview, Development** (all three)

**Option B: Via Dashboard**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add: `VITE_GEMINI_API_KEY` = `your-api-key-here`
5. Select all environments

### Step 5: Redeploy with Environment Variable
```bash
vercel --prod
```

## Your app is now live! 🎉

Access it at: `https://bubble-keyboard.vercel.app` (or whatever Vercel assigned)

---

## Alternative: Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build locally
```bash
npm run build
```

### Step 3: Deploy
```bash
netlify deploy --prod
```

**Follow prompts:**
- Create & configure new site
- Publish directory: `dist`

### Step 4: Add Environment Variable
```bash
netlify env:set VITE_GEMINI_API_KEY your-api-key-here
```

---

## Test on Your Phone

Once deployed, just:
1. Open the Vercel URL on your phone's browser
2. Tap to type - works immediately!
3. Try "Small Screen Mode" toggle to simulate watch

### Bonus: Add to Home Screen (iOS/Android)
1. Open in Safari/Chrome
2. Tap Share → "Add to Home Screen"
3. Now it looks like a native app! 📱

---

## Important Notes

- ✅ Environment variables are secure (not exposed to client)
- ✅ `.env` file is in `.gitignore` (not committed)
- ✅ Auto-deploys on every `git push` (if you connect GitHub)
- ✅ Free tier: Unlimited bandwidth, 100GB/month

## Troubleshooting

**"VITE_GEMINI_API_KEY is undefined"**
- Make sure you added it to Vercel/Netlify dashboard
- Redeploy after adding env vars

**"Build failed"**
- Run `npm run build` locally first to check for errors
- Check build logs on Vercel dashboard

**"API not working"**
- Check browser console for errors
- Verify API key is set correctly
- Test with `testGemini("Hello")` in browser console
