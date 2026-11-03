-- Arogya initial schema. Run in Supabase SQL editor after enabling Auth.
create extension if not exists pgcrypto;

create table if not exists public.users_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  date_of_birth date,
  sex_for_equations text check (sex_for_equations in ('male','female','unspecified')),
  height_cm numeric(5,2) check (height_cm between 80 and 250),
  current_weight_kg numeric(6,2) check (current_weight_kg between 20 and 500),
  activity_level text check (activity_level in ('sedentary','light','moderate','high','athlete')),
  fitness_goal text,
  dietary_preference text,
  allergies text,
  training_level text check (training_level in ('beginner','intermediate','advanced')),
  training_location text,
  workout_days integer check (workout_days between 1 and 7),
  workout_minutes integer check (workout_minutes between 1 and 300),
  training_equipment jsonb not null default '[]',
  training_style text,
  exercise_limitations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(6,2) check(weight_kg between 20 and 500), height_cm numeric(5,2) check(height_cm between 80 and 250),
  waist_cm numeric(5,2) check(waist_cm between 30 and 250), hip_cm numeric(5,2) check(hip_cm between 30 and 250), neck_cm numeric(5,2) check(neck_cm between 15 and 100),
  measurement_date date not null default current_date, created_at timestamptz not null default now()
);
create index if not exists body_measurements_user_date on public.body_measurements(user_id,measurement_date desc);

create table if not exists public.health_assessments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  assessment_type text not null, answers jsonb not null default '{}', calculated_score numeric, interpretation text,
  assessment_date timestamptz not null default now(), reference_version text
);
create index if not exists health_assessments_user_date on public.health_assessments(user_id,assessment_date desc);

-- Public catalogue rows are curated/imported by trusted administrators. An empty
-- RLS write policy intentionally prevents regular users from changing the source catalogue.
create table if not exists public.food_database (
  id uuid primary key default gen_random_uuid(), food_name text not null, regional_name text, category text not null,
  preparation_method text, food_state text not null default 'as served', calories_per_100g numeric(8,2) check(calories_per_100g >= 0),
  protein_per_100g numeric(8,2) check(protein_per_100g >= 0), carbs_per_100g numeric(8,2) check(carbs_per_100g >= 0),
  fat_per_100g numeric(8,2) check(fat_per_100g >= 0), fibre_per_100g numeric(8,2) check(fibre_per_100g >= 0), sodium_per_100g numeric(8,2) check(sodium_per_100g >= 0),
  saturated_fat_per_100g numeric(8,2) check(saturated_fat_per_100g >= 0), sugar_per_100g numeric(8,2) check(sugar_per_100g >= 0),
  data_source text not null, source_reference text, verification_status text not null default 'unverified' check(verification_status in ('unverified','reviewed','verified')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists food_database_name_search on public.food_database using gin(to_tsvector('simple',food_name));

create table if not exists public.custom_foods (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null, regional_name text, category text not null default 'Custom', serving_weight numeric(8,2) not null check(serving_weight > 0), calories numeric(8,2) not null check(calories >= 0),
  protein numeric(8,2) not null default 0 check(protein >= 0), carbohydrates numeric(8,2) not null default 0 check(carbohydrates >= 0), fat numeric(8,2) not null default 0 check(fat >= 0),
  fibre numeric(8,2) check(fibre >= 0), saturated_fat numeric(8,2) check(saturated_fat >= 0), sugar numeric(8,2) check(sugar >= 0), sodium_mg numeric(8,2) check(sodium_mg >= 0), data_source text,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  recipe_name text not null, final_cooked_weight numeric(8,2) check(final_cooked_weight > 0), total_calories numeric(10,2) not null default 0,
  total_protein numeric(10,2) not null default 0, total_carbohydrates numeric(10,2) not null default 0, total_fat numeric(10,2) not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(), recipe_id uuid not null references public.recipes(id) on delete cascade,
  food_id uuid references public.food_database(id), custom_food_id uuid references public.custom_foods(id), quantity_grams numeric(8,2) not null check(quantity_grams > 0),
  check (num_nonnulls(food_id, custom_food_id) = 1)
);

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  meal_type text not null check(meal_type in ('early morning','breakfast','brunch','lunch','pre-workout','post-workout','evening snacks','snack','dinner','bedtime snack','custom meal')),
  meal_date date not null default current_date, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists meal_logs_user_date on public.meal_logs(user_id,meal_date desc);
create table if not exists public.meal_log_items (
  id uuid primary key default gen_random_uuid(), meal_log_id uuid not null references public.meal_logs(id) on delete cascade,
  food_id uuid references public.food_database(id), custom_food_id uuid references public.custom_foods(id), quantity_grams numeric(8,2) not null check(quantity_grams > 0),
  calories numeric(10,2) not null check(calories >= 0), protein numeric(10,2) not null default 0 check(protein >= 0), carbohydrates numeric(10,2) not null default 0 check(carbohydrates >= 0), fat numeric(10,2) not null default 0 check(fat >= 0), fibre numeric(10,2) check(fibre >= 0),
  check (num_nonnulls(food_id, custom_food_id) = 1)
);

create table if not exists public.nutrition_targets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  daily_calories numeric(8,2) not null check(daily_calories > 0), protein_target numeric(8,2), carbohydrate_target numeric(8,2), fat_target numeric(8,2), water_target numeric(6,2),
  effective_date date not null default current_date, created_at timestamptz not null default now(), unique(user_id,effective_date)
);
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  fitness_goal text, training_level text check(training_level in ('beginner','intermediate','advanced')), training_location text,
  weekly_schedule jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_plan_id uuid references public.workout_plans(id) on delete set null, exercise_name text not null, sets integer check(sets >= 0), repetitions integer check(repetitions >= 0), weight_used numeric(8,2) check(weight_used >= 0),
  workout_date date not null default current_date, completion_status boolean not null default false, duration_minutes integer check(duration_minutes >= 0), created_at timestamptz not null default now()
);
create table if not exists public.food_prices (
  id uuid primary key default gen_random_uuid(), food_id uuid references public.food_database(id) on delete cascade, custom_food_id uuid references public.custom_foods(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  price_per_kg numeric(10,2) not null check(price_per_kg >= 0), currency text not null default 'INR', price_date date not null default current_date, source_type text not null default 'user-entered', created_at timestamptz not null default now()
  ,check (num_nonnulls(food_id,custom_food_id) = 1)
);
create table if not exists public.health_reports (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, report_url text not null, report_date timestamptz not null default now(), created_at timestamptz not null default now()
);

-- Local-first app snapshot for private cloud backup/sync from the signed-in client.
create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Additive upgrades for projects that created an earlier version of this schema.
alter table public.users_profile add column if not exists allergies text;
alter table public.users_profile add column if not exists training_level text;
alter table public.users_profile add column if not exists training_location text;
alter table public.users_profile add column if not exists workout_days integer;
alter table public.users_profile add column if not exists workout_minutes integer;
alter table public.users_profile add column if not exists training_equipment jsonb not null default '[]';
alter table public.users_profile add column if not exists training_style text;
alter table public.users_profile add column if not exists exercise_limitations text;
alter table public.food_database add column if not exists saturated_fat_per_100g numeric(8,2) check(saturated_fat_per_100g >= 0);
alter table public.food_database add column if not exists sugar_per_100g numeric(8,2) check(sugar_per_100g >= 0);
alter table public.custom_foods add column if not exists regional_name text;
alter table public.custom_foods add column if not exists category text not null default 'Custom';
alter table public.custom_foods add column if not exists fibre numeric(8,2) check(fibre >= 0);
alter table public.custom_foods add column if not exists saturated_fat numeric(8,2) check(saturated_fat >= 0);
alter table public.custom_foods add column if not exists sugar numeric(8,2) check(sugar >= 0);
alter table public.custom_foods add column if not exists sodium_mg numeric(8,2) check(sodium_mg >= 0);
alter table public.custom_foods add column if not exists data_source text;

-- Strava credentials are stored separately from browser-readable app state.
-- Only the Edge Function service role may access this table; never add client policies.
create table if not exists public.strava_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  athlete_id bigint not null,
  athlete_name text not null,
  tokens jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.strava_connections enable row level security;
revoke all on table public.strava_connections from anon, authenticated;
grant all on table public.strava_connections to service_role;
alter table public.meal_log_items add column if not exists fibre numeric(10,2) check(fibre >= 0);
alter table public.food_prices add column if not exists custom_food_id uuid references public.custom_foods(id) on delete cascade;
alter table public.food_prices alter column food_id drop not null;
alter table public.meal_logs drop constraint if exists meal_logs_meal_type_check;
alter table public.meal_logs add constraint meal_logs_meal_type_check check(meal_type in ('early morning','breakfast','brunch','lunch','pre-workout','post-workout','evening snacks','snack','dinner','bedtime snack','custom meal'));
alter table public.food_prices drop constraint if exists food_prices_one_food_source;
alter table public.food_prices add constraint food_prices_one_food_source check(num_nonnulls(food_id,custom_food_id)=1);

alter table public.users_profile enable row level security;
alter table public.body_measurements enable row level security;
alter table public.health_assessments enable row level security;
alter table public.food_database enable row level security;
alter table public.custom_foods enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.meal_logs enable row level security;
alter table public.meal_log_items enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_logs enable row level security;
alter table public.food_prices enable row level security;
alter table public.health_reports enable row level security;
alter table public.user_app_state enable row level security;

create policy "read public foods" on public.food_database for select using (true);
create policy "profile owner access" on public.users_profile for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "measurement owner access" on public.body_measurements for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "assessment owner access" on public.health_assessments for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "custom food owner access" on public.custom_foods for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "recipe owner access" on public.recipes for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "recipe ingredient owner access" on public.recipe_ingredients for all using (exists(select 1 from public.recipes r where r.id=recipe_id and r.user_id=auth.uid())) with check (exists(select 1 from public.recipes r where r.id=recipe_id and r.user_id=auth.uid()));
create policy "meal owner access" on public.meal_logs for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "meal item owner access" on public.meal_log_items for all using (exists(select 1 from public.meal_logs m where m.id=meal_log_id and m.user_id=auth.uid())) with check (exists(select 1 from public.meal_logs m where m.id=meal_log_id and m.user_id=auth.uid()));
create policy "target owner access" on public.nutrition_targets for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "plan owner access" on public.workout_plans for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "workout owner access" on public.workout_logs for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "food price owner access" on public.food_prices for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "report owner access" on public.health_reports for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "app state owner access" on public.user_app_state for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Do not grant anonymous food-catalogue mutations. Provision administrator imports
-- through a trusted server using the service role key, never from the browser.
