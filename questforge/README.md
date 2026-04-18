# Questforge — Medieval Productivity App

## Setup

1. Install dependencies:
```
npm install
```

2. The `.env` file already has your Supabase keys. If you need to update them:
```
VITE_SUPABASE_URL=https://pighkcbpdwkwiqbhnvam.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xoewyYiCTGEMmFFZx9_X9Q_S1DltD7G
```

3. Run locally:
```
npm run dev
```

4. Build for production:
```
npm run build
```

## Deploy to Vercel
1. Push this folder to a GitHub repo
2. Go to vercel.com → Import that repo
3. Add environment variables in Vercel dashboard:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Deploy!
