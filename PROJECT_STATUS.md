# AROGYA project audit and delivery checklist

Last reviewed: 2026-11-04

This is a working status record based on the current repository. “Implemented” means the feature exists in the client code; it does not imply that it is backed by a configured production service or has passed deployment testing.

## Audit summary

| Area | Current state | Gap / follow-up |
|---|---|---|
| React + TypeScript application | Implemented | Main application still concentrates many screens and state transitions in `src/App.tsx`; continue modularizing as features are completed. |
| Navigation and responsive styling | Implemented | Verify every route/control at desktop and mobile sizes during UI acceptance. |
| Email/password authentication | Implemented in client | Requires Supabase URL/key and Auth provider configuration; live registration and recovery have not been verified against the owner's project. |
| Google sign-in | Implemented in client | Requires Google OAuth provider credentials and redirect URL configuration in Supabase. |
| Per-user cloud persistence | Partially implemented | Client stores the app state snapshot in one `user_app_state` row per authenticated user. Domain tables exist but the application does not yet write most module data to them. |
| Guest data / account switching | In progress | Guest records are separated from each account on this device; user may explicitly import guest data. Cloud state is isolated by auth user ID and row policies. Verify switching accounts and cloud errors against a configured Supabase project. |
| Database schema and row security | Partially implemented | `supabase/schema.sql` and migrations define profile, measurement, assessment, food, recipe, meal, nutrition, workout, pricing and report tables. Apply migrations in a Supabase project and verify policies with two real test accounts before production. |
| Automatic profile creation | Added in migration | Creates/backfills a profile row. Apply migration to activate it. |
| Health assessment / body metrics | Partially implemented | Existing calculations and measurement history are in the app. Review methodology, missing screening instruments, clinical copy, and persistence through normalized tables. |
| Indian nutrition catalogue and diary | Partially implemented | Indian food entries and serving calculations are present. Catalogue values are estimates and not represented as verified ICMR-NIN values; obtain licensed/validated data before making that claim. |
| Nutrition and workout planning | Partially implemented | Existing planners, logs and local history are present. Complete normalized persistence and verify calculations and historical snapshots. |
| Fitness analytics and reports | Partially implemented | Existing charts/export/print functionality exists; full date-range comparisons and downloadable PDF reporting need acceptance work. |
| Progress photos and private storage | Not implemented | Requires private Supabase Storage bucket, owner-only policies, signed URLs, upload/delete UI, and privacy testing. |
| Nearby gyms / Google Places | Not implemented | Needs Maps/Places project, billing status, key restrictions, and a secure implementation. No placeholder results should be shown as real locations. |
| Strava | Partially implemented | OAuth/backend scaffolding exists; configure secrets and callback URL, deploy the function, then verify activity import and token refresh against a real account. |
| Fitbit / Garmin / Apple Health / Android Health Connect | Not implemented | Each needs provider approval/credentials; Apple HealthKit and Android Health Connect also need native mobile app integration. |
| AI, notifications, barcode scanning | Not implemented | Requires product/provider decisions, secure server-side integration, consent and budget approval. |
| Production deployment | Not verified | No production Supabase project, OAuth credentials, deployment URL, or end-to-end environment supplied yet. |

## Phase checklist

- [x] Phase 1: inspect repository structure, current app flows, existing schema, auth and persistence approach.
- [ ] Phase 1: complete security, performance and feature-by-feature acceptance audit.
- [ ] Phase 2: apply database migrations, verify RLS with separate accounts, and move module records to normalized tables.
- [ ] Phase 3: source and validate appropriately licensed Indian food composition data.
- [ ] Phase 4: complete food diary calculations, snapshots, history and cloud persistence.
- [ ] Phase 5: validate assessment formulas and persist assessment/measurement records.
- [ ] Phase 6: complete personalized meal/workout planning and persistence.
- [ ] Phase 7: complete date-filtered analytics and private transformation tracking.
- [ ] Phase 8: configure and test approved external provider integrations.
- [ ] Phase 9: implement approved AI and reminder features.
- [ ] Phase 10: accessibility, responsive UI and settings acceptance.
- [ ] Phase 11: automated tests, security checks, performance review and production build.
- [ ] Phase 12: deploy and verify production configuration.

## Configuration still needed

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the local `.env.local` file. The key must be the browser-safe publishable/anon key, never the `service_role` key or database password. Google and Strava provider credentials are separate; add them only through their provider configuration and Supabase secrets. Do not commit `.env.local`.

## Current delivery slice

The current changes separate device guest state from per-user state, prevent account-switch state bleed, add an explicit guest-data import action, report cloud-save status, and add a migration to create/backfill profiles and tighten table grants/policies. These changes do not yet turn all module history into normalized database writes. That remains a required next phase before claiming production-scale persistence.
