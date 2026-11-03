import { useState } from 'react'
import { LocateFixed, MapPin } from 'lucide-react'
import { indianStates, regionForState, type IndiaLocation } from '../data/foods'

type Props={location?:IndiaLocation;onChange:(value:IndiaLocation)=>void}

function cleanState(value:string) {
  const normalized=value.toLowerCase().replace(/^state of\s+/,'').replace(/\s+(state|union territory)$/,'').trim()
  return indianStates.find(state=>state.toLowerCase()===normalized)
    || indianStates.find(state=>normalized.includes(state.toLowerCase()))
}

export default function IndiaLocationPicker({location,onChange}:Props) {
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const manualChange=(state:string)=>{
    if(!state)return
    onChange({city:'',state,region:regionForState(state),source:'manual',updatedAt:new Date().toISOString()})
    setMessage('Regional menu updated for your selected state.')
  }
  const detect=()=>{
    if(!navigator.geolocation){setMessage('This browser does not support location. Choose your state from the list.');return}
    setBusy(true);setMessage('Allow location access in your browser to identify your state…')
    navigator.geolocation.getCurrentPosition(async position=>{
      try {
        const {latitude,longitude}=position.coords
        const url=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`
        const response=await fetch(url,{headers:{Accept:'application/json'}})
        if(!response.ok)throw new Error(`Location lookup failed (${response.status}).`)
        const data=await response.json() as {countryCode?:string;principalSubdivision?:string;principalSubdivisionCode?:string;city?:string;locality?:string}
        if(data.countryCode?.toUpperCase()!=='IN')throw new Error('Your current location is outside India. Choose an Indian state to explore its dishes.')
        const state=cleanState(data.principalSubdivision||'')||cleanState(data.principalSubdivisionCode?.split('-').pop()||'')
        if(!state)throw new Error('We could not identify the Indian state. Choose it from the list instead.')
        onChange({city:data.city||data.locality||'',state,region:regionForState(state),source:'detected',updatedAt:new Date().toISOString()})
        setMessage(`Location found: ${data.city||data.locality?`${data.city||data.locality}, `:''}${state}. Only this city/state is saved in Arogya.`)
      } catch(error) {setMessage(error instanceof Error?error.message:'Could not look up the current location. Choose your state manually.')}
      finally {setBusy(false)}
    },error=>{setBusy(false);setMessage(error.code===1?'Location permission was not granted. Choose your state manually.':'Could not detect location. Choose your state manually.')},{enableHighAccuracy:false,timeout:12000,maximumAge:300000})
  }
  return <section className="india-location-card" aria-label="Regional Indian food preferences">
    <div className="india-location-heading"><div className="india-location-icon"><MapPin size={17}/></div><div><b>Your Indian food region</b><span>{location?`${location.city?`${location.city}, `:''}${location.state} · ${location.region} Indian cuisine`:'Choose your state for regional dishes and menus'}</span></div></div>
    <div className="india-location-actions"><button className="outline-button" type="button" onClick={detect} disabled={busy}><LocateFixed size={15}/>{busy?'Detecting…':'Detect current location'}</button><label className="field"><span>Or select an Indian state</span><select value={location?.state||''} onChange={event=>manualChange(event.target.value)}><option value="">Select state / union territory</option>{indianStates.map(state=><option key={state}>{state}</option>)}</select></label></div>
    {message&&<p className="india-location-message" role="status">{message}</p>}
    <p className="india-location-privacy">Location is requested only when you tap Detect. Coordinates go to BigDataCloud for state lookup; Arogya stores only city/state/region, never the coordinates. Detection uses BigDataCloud’s <a href="https://www.bigdatacloud.com/docs/article/why-is-reverse-geocoding-api-free" target="_blank" rel="noreferrer">free client-side reverse-geocoding service</a>.</p>
  </section>
}
