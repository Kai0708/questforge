# Questforge — Medieval Productivity App

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in this folder with your own Supabase project keys (find these in your Supabase project settings → API):
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run locally:
```
npm run dev
```

4. Build for production:
```
npm run build
```

## Publish to Google Play (Android via Capacitor)

This project is pre-configured with `capacitor.config.ts` (app id `com.kiawen.questforge`). To generate the Android project:

```
npm install
npm install @capacitor/android
npx cap add android
npm run cap:android
```

This opens the `android/` folder in Android Studio. From there: Build → Generate Signed Bundle/APK → Android App Bundle, create a keystore (back it up somewhere safe — losing it means you can't update the app later), and build in release mode. Upload the resulting `.aab` to Google Play Console.

**Before publishing**, also do these two things:
1. In Supabase → Authentication → URL Configuration, add `com.kiawen.questforge://login-callback` as an additional Redirect URL (alongside your existing Vercel URL) — needed for Google sign-in to return to the native app correctly.
2. In Google Cloud Console, create a separate OAuth client for Android under the same project used for your web OAuth client.


## Deploy to Vercel
1. Push this folder to a GitHub repo
2. Go to vercel.com → Import that repo
3. Add environment variables in Vercel dashboard:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Deploy!
