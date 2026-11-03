# Arogya Health Studio

A responsive React and TypeScript health, fitness, and nutrition app. It is designed for metric units and Indian meal planning. The app works in local mode without credentials; Supabase adds email accounts and private cloud backup when configured.

## Run locally

Install Node.js and pnpm, then run `pnpm install` and `pnpm dev`. Open the local address printed by Vite. `pnpm build` creates a static production bundle.

## Available features

- Profile-based BMI with WHO and Asian Indian labels, Mifflin–St Jeor BMR/TDEE, US Navy circumference body-fat estimate, waist ratios, ABSI, reference weight, hydration starting point, age-based heart-rate zones, and a Cooper 12-minute run VO₂ estimate.
- STOP-Bang, the CDC/ADA prediabetes risk questionnaire (explicitly labelled U.S.-derived and not India-calibrated), and an incomplete-data-aware metabolic risk checklist; these do not diagnose conditions.
- Searchable live USDA FoodData Central results, source references, category and nutrient filters, per-100 g gram arithmetic, CSV import, custom foods, and a recipe builder that divides ingredient nutrients by the final cooked batch weight. User-entered food prices estimate daily and monthly costs from logged portions.
- Date-based meal logging, portion editing/removal, previous-day meal copying, saved meal combinations, CSV history export, energy/macro/fibre totals, recent daily summaries, and browser-local persistence.
- Equipment/location/experience-aware weekly workout plan generation, daily exercise logging with sets/reps/load/session duration, workout history, and historical profile measurement snapshots.
- Profile management for birth date, dietary preference, allergies, training preferences, and exercise limitations; English with Tamil/Hindi navigation and page-heading translations.
- Print/save-as-PDF health summary and JSON data export.
- Optional Supabase email sign-up, sign-in, password reset, sign-out, and row-level-secured cloud synchronization of the app state.

## Supabase accounts and cloud backup

1. Create a Supabase project and enable email/password authentication.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project settings. The anon key is intended for browser use with RLS; never use a service-role key in this app. `VITE_USDA_API_KEY` is optional; the app falls back to USDA's rate-limited `DEMO_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL editor. It creates the private app-state row and owner-only RLS policy used by sync, along with the other application tables.
4. Restart the dev server and use **Profile & Settings → Account & cloud backup**.

The app stores data locally as well as in the signed-in user's private `user_app_state` row. For a hosted production deployment, enable email confirmation, configure password-reset redirect URLs, review your Supabase Auth policies, and add server-side validation, backups, and monitoring.

## Food data and provenance

The food catalogue searches the USDA FoodData Central API as you type (starting with rice). USDA's API requires a key; this app uses its public `DEMO_KEY` by default and supports a personal key for development. USDA says its nutrient data are public domain/CC0 and asks products to cite FoodData Central: [API guide and terms](https://fdc.nal.usda.gov/api-guide/). The demo key has low rate limits, so wait and retry if search is throttled. A `VITE_` key is visible to browser users; a production release should call USDA through a server-side proxy with a privately stored key.

USDA records are measured foods and may not match Indian varieties, brands, or recipes. The app displays the source, food record, and FDC ID so users can judge fit. Search local Indian staples or use the recipe builder to calculate a specific home recipe from its ingredient records and actual cooked yield. Recipe results are estimates and remain marked as user recipes. Custom foods are user-entered estimates. Imported CSV rows remain unverified and require review.

IFCT 2017 electronic reproduction in a product requires written permission from ICMR-NIN, according to the [official IFCT terms](https://www.nin.res.in/ebooks/IFCT2017.pdf). Do not load or distribute IFCT values without that permission. CSV import columns: `food_name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, data_source`; optional: `regional_name, fibre_per_100g, saturated_fat_per_100g, sugar_per_100g, sodium_mg_per_100g, source_reference`.

## Current integration limits

The profile, local diary, saved meal combinations, workout plan/logging, import, custom food and recipe builder, Supabase auth/snapshot sync, and print report paths are implemented. Nearby gym discovery opens an external Google Maps search using a typed area or browser-provided coordinates; Google Places results and an embedded map need a configured Maps project and are not implemented. Tamil/Hindi currently translate navigation and page headings; full-screen translation is not implemented. MASLD is risk-factor information rather than a validated score. Full clinical screening suites, ingredient-level recipe editing, administrator role workflows, server-generated/storage-backed PDFs, and a real licensed Indian food catalogue require more work or authorized data/services. The app does not claim to diagnose or treat disease. Health calculations and screenings are informational and should be discussed with a qualified clinician.

## Ownership and license

This project is proprietary. Copyright © 2026 RAHUL KRISHNA J. All rights are reserved. No permission is granted to copy, modify, publish, distribute, sublicense, or create derivative works from this project without the copyright holder's prior written permission. See [LICENSE](LICENSE). Third-party components and public data remain subject to their own licenses and terms.

The GitHub repository should remain private and access should only be granted to people you trust. Private visibility limits who can view the repository, but it cannot prevent an authorized viewer from copying material they can access. The license notice records your rights; it is not a technical access control or a guarantee against infringement.
