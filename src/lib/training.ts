export type TrainingGoal = 'General fitness' | 'Weight loss' | 'Muscle gain' | 'Strength development' | 'Cardiovascular endurance'
export type TrainingLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type TrainingLocation = 'Home' | 'Gym' | 'Outdoor' | 'Bodyweight only'
export type TrainingStyle = 'Full body' | 'Upper / Lower' | 'Push / Pull / Legs' | 'Strength' | 'Hypertrophy' | 'Cardio / endurance' | 'Home workout'
export type Exercise = {
  id: string
  name: string
  muscle: string
  equipment: string[]
  locations: TrainingLocation[]
  instructions: string
  progression: string
  kind: 'strength' | 'cardio' | 'mobility'
}
export type PlannedExercise = Exercise & { sets: number; reps: string; restSeconds: number }
export type TrainingSession = { id: string; name: string; exercises: PlannedExercise[] }
export type WorkoutPlan = {
  goal: TrainingGoal
  level: TrainingLevel
  location: TrainingLocation
  style: TrainingStyle
  daysPerWeek: number
  durationMinutes: number
  equipment: string[]
  createdAt: string
  sessions: TrainingSession[]
}
export type WorkoutLog = {
  id: string
  date: string
  sessionId: string
  sessionName: string
  exerciseId: string
  exerciseName: string
  setsDone: number
  repsDone: number
  weightKg: number
  completed: boolean
  durationMinutes: number
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const equipmentOptions = ['Dumbbells', 'Resistance bands', 'Barbell', 'Bench', 'Pull-up bar', 'None'] as const

export const exerciseLibrary: Exercise[] = [
  { id: 'squat-bodyweight', name: 'Chair squat', muscle: 'Quads · glutes', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Stand in front of a stable chair, sit back with control, then stand.', progression: 'Lower the chair height or add a pause when every rep feels controlled.', kind: 'strength' },
  { id: 'squat-goblet', name: 'Goblet squat', muscle: 'Quads · glutes', equipment: ['Dumbbells'], locations: ['Home', 'Gym'], instructions: 'Hold one weight at your chest and squat within a comfortable range.', progression: 'Add a small amount of weight after all sets reach the top of the rep range.', kind: 'strength' },
  { id: 'hinge-band', name: 'Band hip hinge', muscle: 'Hamstrings · glutes', equipment: ['Resistance bands'], locations: ['Home', 'Gym'], instructions: 'Keep a soft knee bend, push hips back, and stand by squeezing your glutes.', progression: 'Use a stronger band or slow the lowering phase.', kind: 'strength' },
  { id: 'bridge', name: 'Glute bridge', muscle: 'Glutes · hamstrings', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Lie on your back, feet flat, and raise your hips without arching your lower back.', progression: 'Add a pause at the top, then progress to a single-leg variation if comfortable.', kind: 'strength' },
  { id: 'pushup', name: 'Incline push-up', muscle: 'Chest · shoulders · triceps', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Use a stable raised surface; keep your body in a straight line and lower with control.', progression: 'Lower the hand support gradually as strength improves.', kind: 'strength' },
  { id: 'press-db', name: 'Dumbbell floor press', muscle: 'Chest · triceps', equipment: ['Dumbbells'], locations: ['Home', 'Gym'], instructions: 'Lie on the floor and press weights up while keeping wrists stacked over elbows.', progression: 'Increase load in small steps once every rep is controlled.', kind: 'strength' },
  { id: 'row-band', name: 'Resistance-band row', muscle: 'Back · biceps', equipment: ['Resistance bands'], locations: ['Home', 'Gym'], instructions: 'Anchor the band securely, sit or stand tall, and draw elbows toward your sides.', progression: 'Step farther from the anchor or choose a stronger band.', kind: 'strength' },
  { id: 'row-db', name: 'One-arm dumbbell row', muscle: 'Back · biceps', equipment: ['Dumbbells'], locations: ['Home', 'Gym'], instructions: 'Support one hand on a stable surface and row without twisting your torso.', progression: 'Add load gradually after all reps are smooth.', kind: 'strength' },
  { id: 'pullup', name: 'Assisted pull-up', muscle: 'Back · biceps', equipment: ['Pull-up bar', 'Resistance bands'], locations: ['Home', 'Gym'], instructions: 'Use secure assistance and move through a pain-free range.', progression: 'Reduce assistance slowly as strength improves.', kind: 'strength' },
  { id: 'press-band', name: 'Band overhead press', muscle: 'Shoulders · triceps', equipment: ['Resistance bands'], locations: ['Home', 'Gym'], instructions: 'Stand on the band and press overhead only through a comfortable range.', progression: 'Use a stronger band only when posture stays steady.', kind: 'strength' },
  { id: 'press-db-overhead', name: 'Seated dumbbell press', muscle: 'Shoulders · triceps', equipment: ['Dumbbells', 'Bench'], locations: ['Home', 'Gym'], instructions: 'Sit supported and press without forcing your shoulders into pain.', progression: 'Add weight gradually after reaching the top of the rep range.', kind: 'strength' },
  { id: 'calf', name: 'Standing calf raise', muscle: 'Calves', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Hold support, rise onto the balls of your feet, and lower slowly.', progression: 'Increase range of motion before adding external load.', kind: 'strength' },
  { id: 'deadbug', name: 'Dead bug', muscle: 'Core', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Brace gently and extend opposite arm and leg while keeping your back comfortable.', progression: 'Extend farther only while maintaining control.', kind: 'strength' },
  { id: 'walk', name: 'Brisk walk', muscle: 'Cardiovascular', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Walk at a pace where you can speak in short sentences.', progression: 'Add a few minutes before increasing pace.', kind: 'cardio' },
  { id: 'march', name: 'Low-impact march', muscle: 'Cardiovascular', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'March in place at a comfortable pace near a stable support.', progression: 'Increase time before adding speed.', kind: 'cardio' },
  { id: 'mobility', name: 'Gentle mobility flow', muscle: 'Mobility · recovery', equipment: ['None'], locations: ['Home', 'Gym', 'Outdoor', 'Bodyweight only'], instructions: 'Move slowly through comfortable hip, shoulder, and ankle ranges.', progression: 'Build consistency; do not force end ranges.', kind: 'mobility' },
]

function eligible(exercise: Exercise, location: TrainingLocation, equipment: string[]) {
  return exercise.locations.includes(location) && (exercise.equipment.includes('None') || exercise.equipment.some(item => equipment.includes(item)))
}

export function generateWorkoutPlan(input: Omit<WorkoutPlan, 'createdAt' | 'sessions'>): WorkoutPlan {
  const days = Math.min(6, Math.max(1, Math.round(input.daysPerWeek)))
  const levelMultiplier = input.level === 'Beginner' ? 1 : input.level === 'Intermediate' ? 1.15 : 1.3
  const strengthCount = Math.max(3, Math.min(6, Math.floor((input.durationMinutes - 5) / 6)))
  const eligibleExercises = exerciseLibrary.filter(exercise => eligible(exercise, input.location, input.equipment))
  const cardioGoal = input.goal === 'Cardiovascular endurance' || input.goal === 'Weight loss' || input.style === 'Cardio / endurance'
  const strength = eligibleExercises.filter(exercise => exercise.kind === 'strength')
  const cardio = eligibleExercises.filter(exercise => exercise.kind === 'cardio')
  const mobility = eligibleExercises.filter(exercise => exercise.kind === 'mobility')
  const picked: Exercise[] = []
  if (cardioGoal && cardio.length) picked.push(cardio[0])
  for (let i = 0; i < strengthCount; i++) if (strength.length) picked.push(strength[(i + (input.goal === 'Strength development' ? 1 : 0)) % strength.length])
  if (mobility.length) picked.push(mobility[0])
  const sessionCount = Math.min(days, 6)
  const splitNames = input.style === 'Upper / Lower' ? ['Upper body', 'Lower body'] : input.style === 'Push / Pull / Legs' ? ['Push', 'Pull', 'Legs'] : []
  const sessions = Array.from({ length: sessionCount }, (_, day) => {
    const sessionExercises = picked.map((exercise, index) => {
      const strengthFocus = input.goal === 'Strength development' || input.style === 'Strength'
      return {
        ...exercise,
        sets: exercise.kind === 'strength' ? Math.max(2, Math.min(5, Math.round((strengthFocus ? 4 : 3) * levelMultiplier))) : 1,
        reps: exercise.kind === 'cardio' ? `${Math.max(10, input.durationMinutes - 10)} min` : exercise.kind === 'mobility' ? '5 min' : strengthFocus ? '5–8' : input.style === 'Hypertrophy' ? '8–15' : '8–12',
        restSeconds: exercise.kind === 'cardio' || exercise.kind === 'mobility' ? 0 : strengthFocus ? 120 : input.style === 'Hypertrophy' ? 60 : 75,
      }
    }).filter((exercise, index) => !splitNames.length || (input.style === 'Upper / Lower' ? (day % 2 === 0 ? /Chest|shoulder|triceps|Back|biceps/i.test(exercise.muscle) : /Quads|glutes|Hamstrings|Calves/i.test(exercise.muscle)) : (day % 3 === 0 ? /Chest|shoulder|triceps/i.test(exercise.muscle) : day % 3 === 1 ? /Back|biceps/i.test(exercise.muscle) : /Quads|glutes|Hamstrings|Calves/i.test(exercise.muscle))) || exercise.kind !== 'strength').filter((_, index) => splitNames.length || day === 0 || index % sessionCount === day % Math.max(1, sessionCount) || index < 3)
    return { id: `session-${day + 1}`, name: splitNames.length ? `${splitNames[day % splitNames.length]} · Day ${day + 1}` : sessionCount <= 3 ? `Full body · Day ${day + 1}` : `Session ${day + 1}`, exercises: sessionExercises }
  })
  return { ...input, daysPerWeek: sessionCount, createdAt: new Date().toISOString(), sessions }
}
