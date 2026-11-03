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
- Nearby fitness discovery opens a Google Maps search using user-entered location or coordinates provided during browser permission. It needs an internet connection.

## Location privacy and service

Location detection is user initiated. The browser asks the user first. If they continue, the app sends current latitude/longitude directly from their device to the [BigDataCloud free client-side reverse-geocoding API](https://www.bigdatacloud.com/docs/article/why-is-reverse-geocoding-api-free), as required by its fair-use terms. The service states it may observe the request IP alongside coordinates and aggregate the pairing to improve location data. Arogya does not save GPS coordinates. The app includes a manual state-selection fallback.

## Supabase cloud backup

1. Create a Supabase project and enable email/password authentication.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a service-role key in this browser app.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Restart the dev server and open **Profile & Settings → Account & cloud backup**.

Local storage works without Supabase. For a hosted release, configure HTTPS, email confirmation and reset URLs, backups, server monitoring, and privacy notices.

## Indian CSV format

Required headers: `food_name, category, region, cuisine, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, data_source`. `cuisine` must be `Indian`; `region` must be `North`, `South`, `East`, `West`, `Central`, `North East`, or `Pan-Indian`. Optional headers: `regional_name, fibre_per_100g, saturated_fat_per_100g, sugar_per_100g, sodium_mg_per_100g, source_reference`.

## Ownership

This project is proprietary. Copyright © 2026 RAHUL KRISHNA J. All rights reserved. See [LICENSE](LICENSE). Keep the GitHub repository private and grant access only to people you trust. Third-party services and data remain subject to their own terms.
