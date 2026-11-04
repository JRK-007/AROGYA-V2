-- Production baseline for per-account data ownership and new-user profiles.
-- Apply once to the existing Supabase project before deploying this app update.

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users_profile (user_id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- Backfill accounts that existed before the trigger was installed.
insert into public.users_profile (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Personal health records are available only to authenticated account owners.
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

revoke all on table public.users_profile, public.body_measurements, public.health_assessments,
  public.custom_foods, public.recipes, public.recipe_ingredients, public.meal_logs,
  public.meal_log_items, public.nutrition_targets, public.workout_plans,
  public.workout_logs, public.food_prices, public.health_reports, public.user_app_state
from anon;

grant select, insert, update, delete on table public.users_profile, public.body_measurements,
  public.health_assessments, public.custom_foods, public.recipes, public.recipe_ingredients,
  public.meal_logs, public.meal_log_items, public.nutrition_targets, public.workout_plans,
  public.workout_logs, public.food_prices, public.health_reports, public.user_app_state
to authenticated;

-- Keep the bundled catalogue readable, while denying client-side catalogue edits.
revoke insert, update, delete on table public.food_database from anon, authenticated;
grant select on table public.food_database to anon, authenticated;

-- OAuth refresh tokens are server-only and must never be readable by the browser.
alter table public.strava_connections enable row level security;
revoke all on table public.strava_connections from anon, authenticated;
grant all on table public.strava_connections to service_role;

-- Recreate the account-state rule explicitly for signed-in users only.
drop policy if exists "app state owner access" on public.user_app_state;
create policy "app state owner access"
  on public.user_app_state
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists workout_logs_user_date_idx on public.workout_logs(user_id, workout_date desc);
create index if not exists food_prices_user_date_idx on public.food_prices(user_id, price_date desc);
create index if not exists health_reports_user_date_idx on public.health_reports(user_id, report_date desc);

comment on table public.user_app_state is 'Private per-account application snapshot used for the current web client. Move growing event collections to the domain tables as usage grows.';
