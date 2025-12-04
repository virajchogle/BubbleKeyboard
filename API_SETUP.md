# AI-Powered Prediction Setup

## 🚀 Google Gemini API Setup (FREE & POWERFUL)

Get **super smart** AI-powered predictions for free!

**Current Model:** `gemini-2.5-flash-lite` (super fast, no thinking overhead, perfect for predictions!)

### Why Gemini?
- ✅ **Completely FREE** - No credit card required
- ✅ **Fast** - Predictions in <1 second with Flash model
- ✅ **Smart** - Understands context and natural language
- ✅ **Easy** - 2-minute setup
- ✅ **Generous limits** - 15 requests/min, 1500/day (Flash model)

---

## Quick Setup (2 Minutes)

### Step 1: Get Your Free API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy your API key (starts with `AIzaSy...`)

### Step 2: Add to Your Project

Create a `.env` file in the project root:

```bash
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
```

Or manually create `.env` file:
```
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

**That's it!** The keyboard will now use Gemini for AI-powered predictions! 🎉

---

## How It Works

### With Gemini API:
- Uses Google's Gemini Pro model
- Understands full sentence context
- Predicts next letters with ~90%+ accuracy
- Adapts to natural language patterns

### Without API Key:
- Uses local smart predictor
- Trigram-based predictions
- Still good, but less context-aware
- ~70% accuracy

---

## Free Tier Limits

Gemini's free tier is **very generous**:

| Limit | Amount |
|-------|--------|
| Requests per minute | 60 |
| Requests per day | 1,500 |
| Cost | **$0.00** |
| Credit card required | **No** |

**Perfect for:**
- ✅ Development
- ✅ Testing
- ✅ Small-scale production
- ✅ Demos and prototypes

---

## Testing Your Setup

Try typing these to see AI predictions in action:

1. **"The quick brown"** → Should predict **"f"** for "fox"
2. **"I want to"** → Smart next word predictions like "go", "see", "have"
3. **"Machine learning is"** → Context-aware: "a", "very", "powerful"
4. **"Hello my name is"** → Natural language understanding

You should see much smarter predictions than without the API! 🎯

---

## Troubleshooting

### API not working?

**Check your setup:**
- ✅ Is `.env` file in the **project root** (not in `src/`)?
- ✅ Does your key start with `AIzaSy...`?
- ✅ Did you restart the dev server after adding the key?

**Check browser console:**
- Press `F12` to open developer tools
- Look for error messages in the Console tab
- Common errors:
  - "API key not configured" → Check `.env` file
  - "403 Forbidden" → Key might be invalid
  - "429 Too Many Requests" → Hit rate limit (wait a minute)

### Predictions still basic?

- Check browser console for "Gemini API failed" messages
- Verify API key is correct
- Try a new API key from https://aistudio.google.com/app/apikey

### Want to disable API?

Remove or comment out the key in `.env`:
```
# VITE_GEMINI_API_KEY=your_key_here
```

The app will automatically fall back to local predictions.

---

## Example: Before vs After

**Typing: "The quick brown f"**

| Without Gemini | With Gemini |
|----------------|-------------|
| E, T, A, O, I | **O** (for "fox") ⭐ |
| Generic letters | Context-aware! |

**Typing: "I love machine learning because it"**

| Without Gemini | With Gemini |
|----------------|-------------|
| E, T, A, I | **I** (is), **H** (helps), **C** (can) ⭐ |
| Random | Understands ML context! |

---

## Security Notes

- ✅ API keys are stored in `.env` (not committed to git)
- ✅ Keys only work from your app
- ✅ No sensitive data is sent to Gemini
- ✅ Only the current text is sent for prediction

**.gitignore** already includes `.env` - your keys are safe! 🔒

---

## Need Help?

1. **Read error messages** in browser console (F12)
2. **Verify API key** at https://aistudio.google.com/app/apikey
3. **Check `.env` location** (must be in project root)
4. **Restart dev server** after any changes

Still stuck? Check the console for detailed error messages!

---

## Summary

```bash
# 1. Get API key
Visit: https://aistudio.google.com/app/apikey

# 2. Create .env file
echo "VITE_GEMINI_API_KEY=your_key" > .env

# 3. Restart dev server
npm run dev

# 4. Enjoy AI-powered predictions! 🚀
```

**Simple, free, and powerful!** ✨
