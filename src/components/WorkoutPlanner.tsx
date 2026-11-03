import { useMemo, useState } from 'react'
import { Check, Dumbbell, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { equipmentOptions, generateWorkoutPlan, localDateKey, type TrainingGoal, type TrainingLevel, type TrainingLocation, type TrainingStyle, type WorkoutLog, type WorkoutPlan } from '../lib/training'

type Props = {
  plan: WorkoutPlan | null
  logs: WorkoutLog[]
  defaultGoal: string
  defaultLevel:string
  defaultLocation:string
  defaultStyle:string
  defaultDays:number
  defaultMinutes:number
  defaultEquipment:string[]
  limitations:string
  onSave: (plan: WorkoutPlan) => void
  onLog: (log: WorkoutLog) => void
  onDeleteLog: (id: string) => void
}

const goals: TrainingGoal[] = ['General fitness', 'Weight loss', 'Muscle gain', 'Strength development', 'Cardiovascular endurance']

export default function WorkoutPlanner({ plan, logs, defaultGoal, defaultLevel, defaultLocation, defaultStyle, defaultDays, defaultMinutes, defaultEquipment, limitations, onSave, onLog, onDeleteLog }: Props) {
  const [goal, setGoal] = useState<TrainingGoal>(goals.includes(defaultGoal as TrainingGoal) ? defaultGoal as TrainingGoal : 'General fitness')
  const [level, setLevel] = useState<TrainingLevel>(['Beginner','Intermediate','Advanced'].includes(defaultLevel)?defaultLevel as TrainingLevel:'Beginner')
  const [location, setLocation] = useState<TrainingLocation>(['Home','Gym','Outdoor','Bodyweight only'].includes(defaultLocation)?defaultLocation as TrainingLocation:'Home')
  const [style, setStyle] = useState<TrainingStyle>(['Full body','Upper / Lower','Push / Pull / Legs','Strength','Hypertrophy','Cardio / endurance','Home workout'].includes(defaultStyle)?defaultStyle as TrainingStyle:'Full body')
  const [days, setDays] = useState(defaultDays||3)
  const [duration, setDuration] = useState(defaultMinutes||35)
  const [equipment, setEquipment] = useState<string[]>(defaultEquipment?.length?defaultEquipment:['None'])
  const [sessionId, setSessionId] = useState('session-1')
  const [sessionMinutes, setSessionMinutes] = useState(35)
  const [performance, setPerformance] = useState<Record<string, { sets:string; reps:string; weight:string }>>({})
  const activePlan = plan
  const session = useMemo(() => activePlan?.sessions.find(item => item.id === sessionId) || activePlan?.sessions[0], [activePlan, sessionId])
  const completedToday = logs.filter(log => log.date === localDateKey() && log.completed).length
  const generate = () => onSave(generateWorkoutPlan({ goal, level, location, style, daysPerWeek: days, durationMinutes: duration, equipment: equipment.includes('None') ? ['None', ...equipment.filter(item => item !== 'None')] : equipment }))
  const toggleEquipment = (item: string) => setEquipment(current => item === 'None' ? ['None'] : current.includes(item) ? current.filter(value => value !== item) : [...current.filter(value => value !== 'None'), item])
  const logExercise = (exercise: NonNullable<typeof session>['exercises'][number]) => { const value=performance[exercise.id];onLog({ id: crypto.randomUUID(), date: localDateKey(), sessionId: session?.id || '', sessionName: session?.name || 'Workout', exerciseId: exercise.id, exerciseName: exercise.name, setsDone: Math.max(0,Number(value?.sets)||exercise.sets), repsDone: Math.max(0,Number(value?.reps)||Number(exercise.reps.match(/\d+/)?.[0] || 0)), weightKg: Math.max(0,Number(value?.weight)||0), completed: true, durationMinutes: sessionMinutes }) }

  return <div className="content-page">
    <div className="page-intro"><span className="eyebrow">MOVEMENT</span><h1>Workout planner</h1><p>Generate a session from your goal, experience, available days, location, equipment, and time. Stop if you feel pain, dizziness, or unusual shortness of breath.</p></div>
    <div className="card form-card">
      <div className="card-title"><div><h3>Build your weekly plan</h3><p>General exercise ideas only. Adjust for your ability and any clinician advice.</p></div></div>
      <div className="form-grid">
        <label className="field"><span>Fitness goal</span><select value={goal} onChange={event => setGoal(event.target.value as TrainingGoal)}>{goals.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field"><span>Experience</span><select value={level} onChange={event => setLevel(event.target.value as TrainingLevel)}>{['Beginner', 'Intermediate', 'Advanced'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field"><span>Location</span><select value={location} onChange={event => setLocation(event.target.value as TrainingLocation)}>{['Home', 'Gym', 'Outdoor', 'Bodyweight only'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field"><span>Training style</span><select value={style} onChange={event=>setStyle(event.target.value as TrainingStyle)}>{['Full body','Upper / Lower','Push / Pull / Legs','Strength','Hypertrophy','Cardio / endurance','Home workout'].map(value=><option key={value}>{value}</option>)}</select></label>
        <label className="field"><span>Days per week</span><select value={days} onChange={event => setDays(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map(value => <option key={value} value={value}>{value} days</option>)}</select></label>
        <label className="field"><span>Minutes per session</span><input type="number" min="15" max="120" step="5" value={duration} onChange={event => setDuration(Math.max(15, Math.min(120, Number(event.target.value) || 15)))}/></label>
      </div>
      <div className="equipment-picker"><b>Equipment you have</b><div>{equipmentOptions.map(item => <label key={item}><input type="checkbox" checked={equipment.includes(item)} onChange={() => toggleEquipment(item)}/>{item}</label>)}</div></div>
      {limitations&&<p className="subtle-note">Your profile lists exercise limitations: {limitations}. A generic plan is paused; seek an individualized plan from a qualified clinician or exercise professional.</p>}
      <button className="primary-button" disabled={Boolean(limitations)} onClick={generate}><RefreshCw size={15}/> Generate my plan</button>
    </div>
    {activePlan && <>
      <div className="workout-banner"><div className="workout-badge"><Dumbbell size={22}/></div><div><span>YOUR SAVED WEEKLY PLAN · {activePlan.level.toUpperCase()}</span><h2>{activePlan.goal}</h2><p>{activePlan.daysPerWeek} sessions · {activePlan.durationMinutes} min · {activePlan.location}</p></div><div className="workout-total"><b>{completedToday}</b><span>logged today</span></div></div>
      <div className="card exercise-card"><div className="card-title"><div><h3>Planned sessions</h3><p>Record the exercises you complete. Your history is saved on this device.</p></div><select aria-label="Choose workout session" value={session?.id || ''} onChange={event => setSessionId(event.target.value)}>{activePlan.sessions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
        <label className="session-duration">Workout duration (minutes) <input type="number" min="1" max="300" value={sessionMinutes} onChange={event=>setSessionMinutes(Math.max(1,Math.min(300,Number(event.target.value)||1)))}/></label>
        {session?.exercises.map(exercise => {
          const doneToday = logs.some(log => log.date === localDateKey() && log.exerciseId === exercise.id && log.completed)
          const value=performance[exercise.id]||{sets:String(exercise.sets),reps:String(Number(exercise.reps.match(/\d+/)?.[0]||0)),weight:''}
          const setValue=(key:'sets'|'reps'|'weight',next:string)=>setPerformance(current=>({...current,[exercise.id]:{...value,[key]:next}}))
          return <div className={`exercise-row workout-log-row ${doneToday ? 'done' : ''}`} key={exercise.id}><div className="exercise-icon"><Dumbbell size={17}/></div><div className="exercise-name"><b>{exercise.name}</b><span>{exercise.muscle}</span><small>{exercise.instructions}</small><small>Progression: {exercise.progression}</small></div><span>{exercise.sets} × {exercise.reps}</span><span>{exercise.restSeconds ? `${exercise.restSeconds}s rest` : 'Easy pace'}</span><div className="exercise-performance"><label>Sets<input type="number" min="0" value={value.sets} onChange={event=>setValue('sets',event.target.value)}/></label><label>Reps<input type="number" min="0" value={value.reps} onChange={event=>setValue('reps',event.target.value)}/></label><label>kg<input type="number" min="0" step="0.5" value={value.weight} onChange={event=>setValue('weight',event.target.value)}/></label></div><button className={`check-button ${doneToday ? 'checked' : ''}`} aria-label={`Log ${exercise.name}`} disabled={Boolean(limitations)} onClick={() => logExercise(exercise)}>{doneToday ? <Check size={16}/> : <Plus size={16}/>}</button></div>
        })}
        <p className="subtle-note">Do not train through pain or acute illness. If you have a medical condition, injury, pregnancy, or exercise restrictions, get individualized guidance before using a generic plan.</p>
      </div>
    </>}
    <div className="card exercise-card"><div className="card-title"><div><h3>Workout history</h3><p>Completed sessions and exercise records</p></div></div>{logs.length ? [...logs].sort((a,b) => b.date.localeCompare(a.date)).slice(0,30).map(log => <div className="history-row" key={log.id}><div><b>{log.exerciseName}</b><span>{log.sessionName} · {log.date}</span></div><span>{log.setsDone} sets · {log.repsDone} reps {log.weightKg ? `· ${log.weightKg} kg` : ''} · {log.durationMinutes} min</span><button className="icon-button" aria-label={`Delete ${log.exerciseName} log`} onClick={() => onDeleteLog(log.id)}><Trash2 size={15}/></button></div>) : <p className="empty-state">No workouts logged yet. Generate a plan and check off a completed exercise.</p>}</div>
  </div>
}
