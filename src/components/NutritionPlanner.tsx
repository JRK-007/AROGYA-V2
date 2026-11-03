import { useMemo, useState } from 'react'
import { Apple, Plus, RefreshCw, ShieldCheck } from 'lucide-react'
import type { Food } from '../data/foods'

type Props = {
  foods: Food[]
  preference: string
  allergies: string
  goal: string
  target: { kcal:number; protein:number; carbs:number; fat:number }
  consumed: { kcal:number; protein:number; carbs:number; fat:number }
  monthlyCost:number
  onAdd: (food:Food, grams:number, mealType:string) => void
  onBrowse: () => void
}

const slots = [
  { label:'Breakfast', type:'breakfast', hint:'Start with a food that fits your preferences.' },
  { label:'Pre-workout', type:'pre-workout', hint:'Choose a familiar food you tolerate well.' },
  { label:'Lunch', type:'lunch', hint:'Use your saved food records to build a meal.' },
  { label:'Evening snack', type:'evening snacks', hint:'Choose a portion that fits your remaining targets.' },
  { label:'Dinner', type:'dinner', hint:'Pick another compatible food record.' },
]

function fitsDiet(food:Food, preference:string, allergyList:string) {
  const text=`${food.name} ${food.local} ${food.category}`.toLowerCase()
  const meat=/chicken|beef|pork|mutton|lamb|turkey|meat|fish|prawn|shrimp|seafood|anchov|salmon|tuna/.test(text)
  const dairy=/milk|cheese|paneer|curd|yogurt|ghee|butter|cream|whey/.test(text)
  const egg=/egg/.test(text)
  const gluten=/wheat|barley|rye|gluten|semolina|suji|maida/.test(text)
  if((preference==='Vegetarian'||preference==='Vegan'||preference==='Eggetarian')&&meat)return false
  if(preference==='Vegan'&&(dairy||egg))return false
  if(preference==='Lactose-free'&&dairy)return false
  if(preference==='Gluten-free'&&gluten)return false
  const allergens=allergyList.toLowerCase().split(/[,;\n]+/).map(value=>value.trim()).filter(Boolean)
  if(allergens.some(allergen=>text.includes(allergen)))return false
  return true
}

function rankedFoods(foods:Food[],slot:string,goal:string) {
  return [...foods].sort((a,b)=>{
    const score=(food:Food)=>{
      const name=`${food.name} ${food.category}`.toLowerCase()
      let value=food.status==='Verified'?8:0
      if(/protein|pulse|legume|lentil|bean|chickpea|egg|dairy|meat|fish|soy/.test(name))value+=food.protein*1.5
      if(slot==='Breakfast'&&/breakfast|cereal|grain|fruit|dairy/.test(name))value+=9
      if(slot==='Lunch'&&/rice|grain|pulse|legume|vegetable|meal/.test(name))value+=8
      if(slot==='Dinner'&&/pulse|legume|vegetable|dairy|fish|meat/.test(name))value+=8
      if(slot.toLowerCase().includes('snack')&&/fruit|nut|seed|snack|yogurt/.test(name))value+=8
      if(goal==='Weight loss')value-=food.kcal*.08
      return value
    }
    return score(b)-score(a)
  })
}

export default function NutritionPlanner({foods,preference,allergies,goal,target,consumed,monthlyCost,onAdd,onBrowse}:Props) {
  const compatible=useMemo(()=>foods.filter(food=>fitsDiet(food,preference,allergies)),[foods,preference,allergies])
  const [chosen,setChosen]=useState<Record<string,string>>({})
  const [portion,setPortion]=useState<Record<string,number>>({})
  const left=Math.max(0,target.kcal-consumed.kcal)
  const proteinLeft=Math.max(0,target.protein-consumed.protein)
  const pick=(slot:string)=>rankedFoods(compatible,slot,goal)[0]
  const choose=(slot:string,foodId:string)=>setChosen(current=>({...current,[slot]:foodId}))
  const gramsFor=(slot:string,food:Food)=>portion[slot]||Math.max(25,Math.min(350,Math.round((left/Math.max(1,slots.length))/(Math.max(1,food.kcal)/100))))
  return <div className="content-page">
    <div className="page-intro"><span className="eyebrow">NUTRITION</span><h1>Your nutrition plan</h1><p>Portion suggestions use your saved food records and current goals. They are planning estimates, not medical instructions.</p></div>
    <div className="metric-grid"><div className="metric-card"><div className="metric-top"><span>Daily energy target</span><span className="metric-icon orange">◉</span></div><div className="metric-value">{target.kcal?Math.round(target.kcal):'—'}<small> kcal</small></div><div className="metric-detail">{goal} · estimated from your profile</div></div><div className="metric-card"><div className="metric-top"><span>Energy remaining</span><span className="metric-icon green">↗</span></div><div className="metric-value">{Math.round(left)}<small> kcal</small></div><div className="metric-detail">{Math.round(consumed.kcal)} kcal logged today</div></div><div className="metric-card"><div className="metric-top"><span>Protein remaining</span><span className="metric-icon purple">◈</span></div><div className="metric-value">{Math.round(proteinLeft)}<small> g</small></div><div className="metric-detail">{Math.round(consumed.protein)} g of {target.protein||'—'} g</div></div><div className="metric-card"><div className="metric-top"><span>Monthly logged food cost</span><span className="metric-icon green">₹</span></div><div className="metric-value">{monthlyCost>0?`₹${monthlyCost.toLocaleString('en-IN')}`:'—'}<small> INR</small></div><div className="metric-detail">{monthlyCost>0?'Today’s logged spend × 30':'Enter local prices for foods in the database'}</div></div></div>
    <div className="card planner-meal-card"><div className="card-title"><div><h3>Build a day from your food records</h3><p>Change the food or portion for any slot, then add it to your diary.</p></div><button className="outline-button" onClick={onBrowse}><Apple size={15}/> Browse foods</button></div>
      {!foods.length?<div className="empty-state"><ShieldCheck size={24}/><b>No nutrition records available yet</b><span>Search USDA records online, import a licensed dataset, or add your own cited food values to enable food-based suggestions.</span><button className="primary-button" onClick={onBrowse}><RefreshCw size={15}/> Open food database</button></div>:compatible.length===0?<p className="subtle-note">No available records match your selected dietary preference and allergy exclusions. Review your settings or add suitable foods with source information.</p>:slots.map(slot=>{
        const ranked=rankedFoods(compatible,slot.label,goal)
        const recommended=pick(slot.label)
        const current=compatible.find(food=>food.id===(chosen[slot.type]||recommended?.id))||recommended
        if(!current)return null
        const grams=gramsFor(slot.type,current)
        const kcal=current.kcal*grams/100
        return <div className="suggested-meal" key={slot.type}><div className="suggested-meal-copy"><span>{slot.label.toUpperCase()}</span><b>{current.name}</b><small>{slot.hint}</small><small>Source: {current.source} · {current.status}</small></div><label className="field"><span>Replace food</span><select value={current.id} onChange={event=>choose(slot.type,event.target.value)}>{ranked.map(food=><option key={food.id} value={food.id}>{food.name} · {food.kcal} kcal / 100 g</option>)}</select></label><label className="field"><span>Portion</span><div className="input-unit"><input type="number" min="1" max="1000" value={grams} onChange={event=>setPortion(current=>({...current,[slot.type]:Math.max(1,Math.min(1000,Number(event.target.value)||1))}))}/><em>g</em></div></label><div className="suggestion-nutrition"><b>{Math.round(kcal)} kcal</b><span>P {((current.protein*grams)/100).toFixed(1)} g · C {((current.carbs*grams)/100).toFixed(1)} g · F {((current.fat*grams)/100).toFixed(1)} g</span></div><button className="small-add" onClick={()=>onAdd(current,grams,slot.type)}><Plus size={14}/> Add</button></div>
      })}
      <p className="subtle-note">{preference!=='Not set'?`Dietary filter: ${preference}. `:''}{allergies?`Allergy exclusions: ${allergies}. `:''}Food names and ingredient lists can be incomplete; check labels and cross-contamination information. Search results are individual foods, not a medically prescribed meal plan.</p>
    </div>
    <div className="card"><h3>Targets</h3><p>Protein {target.protein} g · carbohydrate {target.carbs} g · fat {target.fat} g per day. These estimates can differ from your needs. Discuss major dietary changes with a qualified professional.</p></div>
  </div>
}
