import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type StravaTokens = { access_token: string; refresh_token: string; expires_at: number }
type StravaActivity = { id: number; name: string; sport_type: string; distance: number; moving_time: number; start_date: string; total_elevation_gain: number }

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const clientId = Deno.env.get('STRAVA_CLIENT_ID')
  const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')
  if (!url || !anonKey || !serviceKey || !clientId || !clientSecret) return json({ error: 'Strava server configuration is incomplete.' }, 503)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Sign in to Arogya before using Strava.' }, 401)
  const token = authorization.slice('Bearer '.length)
  const authClient = createClient(url, anonKey, { auth: { persistSession: false }, global: { headers: { Authorization: authorization } } })
  const { data: { user }, error: authError } = await authClient.auth.getUser(token)
  if (authError || !user) return json({ error: 'Your Arogya session has expired. Please sign in again.' }, 401)

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  let body: { action?: string; code?: string }
  try { body = await request.json() } catch { return json({ error: 'Invalid request body.' }, 400) }
  const action = body.action

  const loadToken = async (): Promise<StravaTokens> => {
    const { data, error } = await admin.from('strava_connections').select('tokens').eq('user_id', user.id).maybeSingle()
    if (error) throw new Error('Could not load your private Strava connection.')
    if (!data?.tokens) throw new Error('Connect Strava before syncing activities.')
    let tokens = data.tokens as StravaTokens
    if (tokens.expires_at <= Math.floor(Date.now() / 1000) + 60) {
      const refreshed = await fetch('https://www.strava.com/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId!, client_secret: clientSecret!, grant_type: 'refresh_token', refresh_token: tokens.refresh_token }) })
      if (!refreshed.ok) throw new Error('Strava authorization expired. Disconnect and connect Strava again.')
      tokens = await refreshed.json()
      const { error: saveError } = await admin.from('strava_connections').update({ tokens, updated_at: new Date().toISOString() }).eq('user_id', user.id)
      if (saveError) throw new Error('Could not update the private Strava authorization.')
    }
    return tokens
  }

  try {
    if (action === 'exchange') {
      if (!body.code || body.code.length > 200) return json({ error: 'Missing or invalid Strava authorization code.' }, 400)
      const response = await fetch('https://www.strava.com/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code: body.code, grant_type: 'authorization_code' }) })
      const tokens = await response.json()
      if (!response.ok || !tokens.access_token || !tokens.refresh_token || !tokens.athlete?.id) return json({ error: 'Strava could not complete authorization. Please try connecting again.' }, 400)
      const athleteName = [tokens.athlete.firstname, tokens.athlete.lastname].filter(Boolean).join(' ') || 'Strava athlete'
      const { error } = await admin.from('strava_connections').upsert({ user_id: user.id, athlete_id: tokens.athlete.id, athlete_name: athleteName, tokens: { access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_at: tokens.expires_at }, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      if (error) throw new Error('Could not save the private Strava connection. Apply the included SQL migration first.')
      const activities = await fetchActivities(tokens.access_token)
      return json({ connection: { athleteId: tokens.athlete.id, athleteName, connectedAt: new Date().toISOString() }, activities })
    }
    if (action === 'sync') return json({ activities: await fetchActivities((await loadToken()).access_token) })
    if (action === 'disconnect') {
      const tokens = await loadToken()
      const credentials = btoa(`${clientId}:${clientSecret}`)
      const revoked = await fetch('https://www.strava.com/oauth/revoke', { method: 'POST', headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: tokens.refresh_token, token_type_hint: 'refresh_token' }) })
      if (!revoked.ok) throw new Error('Strava could not revoke access. Please try disconnecting again.')
      const { error } = await admin.from('strava_connections').delete().eq('user_id', user.id)
      if (error) throw new Error('Could not remove the private Strava connection.')
      return json({ disconnected: true })
    }
    return json({ error: 'Unsupported action.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Strava request failed.' }, 400)
  }
})

async function fetchActivities(accessToken: string): Promise<StravaActivity[]> {
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20&page=1', { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!response.ok) throw new Error('Could not load activities from Strava. Try syncing again.')
  const values = await response.json()
  if (!Array.isArray(values)) throw new Error('Strava returned an unexpected activity list.')
  return values.map((item: Record<string, unknown>): StravaActivity => ({ id: Number(item.id), name: String(item.name || 'Activity'), sport_type: String(item.sport_type || item.type || 'Workout'), distance: Number(item.distance) || 0, moving_time: Number(item.moving_time) || 0, start_date: String(item.start_date || ''), total_elevation_gain: Number(item.total_elevation_gain) || 0 }))
}
