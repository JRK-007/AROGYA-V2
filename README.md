# Arogya Health Studio

Arogya is a personal health, fitness, and Indian food app. Its food catalogue is centered on dishes, ingredients, drinks, snacks, and meal habits from Indian regions. It does not search or recommend a general international food catalogue.

## Run locally

Install Node.js and pnpm, then run `pnpm install` and `pnpm dev`. Open the local HTTPS-secure browser context address printed by Vite (usually `http://localhost:5173`). `pnpm build` creates a static production bundle. Browser location detection requires a secure context such as HTTPS or localhost and the user's permission.

## Indian food features

- Bundled catalogue of regional Indian breakfasts, meals, staples, curries, snacks, drinks, and sweets. Foods are tagged to Indian states and cuisine regions (North, South, East, West, Central, and North East), with pan-Indian staples.
- State-based menu ranking. A user may select any Indian state or tap **Detect current location** and grant browser permission. Coordinates are sent to BigDataCloud's free client-side reverse-geocoding endpoint to look up the city/state. Arogya saves only city, state, region, and detection time; it discards the coordinates. Users who decline or cannot use location can pick a state manually.
- Indian daily meal slots use familiar labels such as breakfast/nashta, lunch/dopahar, evening chai/snack, and dinner. They are optional, to fit varied household routines.
- Gram-weight food diary, portion updates, saved meal combinations, previous-day copy, CSV log export, custom Indian foods, a home-recipe calculator based on ingredient weights and cooked yield, local price tracking, and estimated monthly cost.
- CSV import requires `cuisine=Indian` and a recognized Indian region. Imported values remain marked unverified.

### Nutrition data limits

Bundled recipe nutrient values are broad Arogya estimates per 100 g cooked edible portion, not laboratory analyses or verified IFCT data. Oils, recipes, household measures, brands, water absorption, and serving size can change the result substantially. The app labels these values as **Estimated** and they are not suitable for clinical or therapeutic decisions.

ICMR-NIN publishes the [Dietary Guidelines for Indians 2024](https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf) and the [Indian Food Composition Tables](https://www.nin.res.in/ebooks/IFCT2017.pdf). Do not copy or redistribute IFCT nutrient rows in the app without the permissions required by ICMR-NIN. Replace the bundled estimates with an authorized Indian dataset before using Arogya for precise nutrition analysis.

## Other features

- Profile calculations: BMI with Asian Indian labels, BMR/TDEE, waist ratios, circumference-based body-fat estimate, ABSI, hydration starting estimate, age-based heart-rate zones, and Cooper 12-minute run estimate.
- STOP-Bang, U.S.-derived prediabetes screening, and an incomplete-data-aware metabolic checklist. They are informational only and do not diagnose.
- Equipment-aware workout schedule generator, workout logging, fitness history, browser print/save-as-PDF summary, JSON export, and local persistence.
- English with partial Hindi and Tamil navigation/page-heading translations.
- Optional Supabase email sign-in and owner-only app-state cloud sync.
- Google sign-in through Supabase Auth (requires enabling the Google provider in your Supabase project).
- Strava OAuth connection and recent activity sync through a Supabase Edge Function. Strava tokens remain server-side and are never saved in browser storage.
- Responsive, collapsible sidebar help card and dismissible, non-blocking status notifications.
- Debounced local/cloud persistence to keep typing and option changes responsive.
- Nearby fitness discovery opens a Google Maps search using user-entered location or coordinates provided during browser permission. It needs an internet connection.

## Login and fitness integrations

### Google sign-in

1. Set up Supabase using the steps below.
2. In Supabase, enable **Authentication → Providers → Google** and enter your Google OAuth client ID and secret. Follow Supabase's Google provider instructions for the required Google Cloud OAuth consent screen and redirect URI.
3. Add your local and hosted Arogya URLs to **Authentication → URL Configuration → Redirect URLs**. Google login appears in **Profile & Settings → Account & cloud backup**.

Google login is an authentication method for Arogya; it does not by itself connect Google Fit or read watch data.

### Strava

1. Create a Strava API application and set its authorization callback domain/URL to the exact Arogya site origin and path you use (for local development, use your local origin; add the production origin before publishing).
2. Put the public Strava client ID in `.env.local` as `VITE_STRAVA_CLIENT_ID=...`, then restart the web app.
3. Apply `supabase/schema.sql` (the `strava_connections` table has no browser access policies), deploy `supabase/functions/strava-oauth`, and set the Edge Function secrets `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET`. The function also uses the Supabase project URL, anon key, and service-role key available in the Edge Function environment. Never add the Strava client secret or Supabase service-role key to a `VITE_` variable or browser bundle.
4. Sign in to Arogya and choose **Profile & Settings → Fitness & wearable connections → Connect Strava**. Users can sync their latest 20 activities or disconnect and revoke the Strava authorization.

Strava setup is required before this connection is live. Use the official [Strava authentication documentation](https://developers.strava.com/docs/authentication/) when registering the application and configuring redirect URLs.

### Watch and health-platform coverage

A web page cannot read every watch's on-device data directly. Apple HealthKit access is provided to iOS apps with user permission, and Android Health Connect is an Android on-device API; adding those connections requires native mobile app builds and permission flows. Fitbit has a Web API but requires a registered app and its own OAuth implementation. Garmin's cloud health integration requires access to the Garmin Connect Developer Program. The settings page identifies these provider requirements instead of reporting inactive connections as live. See the official [Apple HealthKit](https://developer.apple.com/documentation/healthkit), [Android Health Connect](https://developer.android.com/health-and-fitness/health-connect), [Fitbit Web API](https://dev.fitbit.com/build/reference/web-api/explore/), and [Garmin Health API](https://developer.garmin.com/gc-developer-program/enterprise/health-api/) documentation before planning those integrations.

## Location privacy and service

Location detection is user initiated. The browser asks the user first. If they continue, the app sends current latitude/longitude directly from their device to the [BigDataCloud free client-side reverse-geocoding API](https://www.bigdatacloud.com/docs/article/why-is-reverse-geocoding-api-free), as required by its fair-use terms. The service states it may observe the request IP alongside coordinates and aggregate the pairing to improve location data. Arogya does not save GPS coordinates. The app includes a manual state-selection fallback.

## Supabase cloud backup

1. Create a Supabase project and enable email/password authentication.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a service-role key in this browser app.
3. Run `supabase/schema.sql` for a new project. For an existing project, apply the ordered SQL files in `supabase/migrations/` instead of rerunning the initial schema.
4. Restart the dev server and open **Profile & Settings → Account & cloud backup**.

Every Supabase Auth user gets a separate private account row. Database row-level security binds private records to the signed-in user ID. A browser on a shared device also keeps separate local copies for each account and a guest profile. When a new account has no cloud records, existing guest data stays separate until the user explicitly imports it. Signing out returns to guest mode. This avoids transferring one person's local health history into another account by accident.

The current web client syncs its app snapshot to one row per account in `user_app_state`; the schema also provides domain tables for profile, measurements, meals, foods, workouts, and reports. This is a practical launch baseline for an early user base. Before high-volume production, move growing event history to those relational tables, add a retention/export/deletion workflow, monitor database limits, and test isolation with separate accounts. Do not describe the app as a regulated clinical record system without the required legal, security, and operational controls.

For a hosted release, configure HTTPS, email confirmation and reset URLs, scheduled backups, restore drills, server monitoring, and clear privacy/retention notices. Supabase's RLS guidance recommends explicit per-user access policies and permission grants; the included migration applies those safeguards to account data.

## Indian CSV format

Required headers: `food_name, category, region, cuisine, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, data_source`. `cuisine` must be `Indian`; `region` must be `North`, `South`, `East`, `West`, `Central`, `North East`, or `Pan-Indian`. Optional headers: `regional_name, fibre_per_100g, saturated_fat_per_100g, sugar_per_100g, sodium_mg_per_100g, source_reference`.

## Ownership

This project is proprietary. Copyright © 2026 RAHUL KRISHNA J. All rights reserved. See [LICENSE](LICENSE). Keep the GitHub repository private and grant access only to people you trust. Third-party services and data remain subject to their own terms.
