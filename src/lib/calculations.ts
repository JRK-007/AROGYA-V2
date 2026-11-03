export type Sex = 'male' | 'female' | 'unspecified'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete'
export type Profile = { name: string; age: number; sex: Sex; height: number; weight: number; waist: number; hip: number; neck: number; activity: Activity; goal: string; dietaryPreference:string; workoutMinutes: number; hotWeather: boolean }
export const multipliers: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725, athlete: 1.9 }
const log10 = (x: number) => Math.log(x) / Math.LN10
export function assess(p: Profile) {
  const h = p.height / 100, bmi = p.weight / (h * h)
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'male' ? 5 : p.sex === 'female' ? -161 : NaN)
  const tdee = bmr * multipliers[p.activity]
  const validCore = p.age > 0 && p.height > 0 && p.weight > 0
  const validEnergy = validCore && p.sex !== 'unspecified'
  const validBmi = validCore && Number.isFinite(bmi)
  const whr = p.waist > 0 && p.hip > 0 ? p.waist / p.hip : null
  const whtr = p.waist > 0 && p.height > 0 ? p.waist / p.height : null
  const absi = p.waist > 0 && validBmi ? (p.waist / 100) / (Math.pow(bmi, 2 / 3) * Math.pow(h, 1 / 2)) : null
  // US Navy circumference estimate. Female equation requires hip; male does not.
  const bfRaw = p.sex === 'male' && p.waist > p.neck && p.neck > 0 && p.height > 0
    ? 495 / (1.0324 - 0.19077 * log10(p.waist - p.neck) + 0.15456 * log10(p.height)) - 450
      : p.sex === 'female' && p.waist > 0 && p.hip > 0 && p.waist + p.hip > p.neck && p.neck > 0 && p.height > 0
      ? 495 / (1.29579 - 0.35004 * log10(p.waist + p.hip - p.neck) + 0.221 * log10(p.height)) - 450 : null
  const bodyFat = bfRaw != null && Number.isFinite(bfRaw) && bfRaw > 0 && bfRaw < 70 ? bfRaw : null
  const maxHr = p.age > 0 ? 208 - .7 * p.age : NaN
  const hydration = p.weight > 0 ? p.weight * 0.033 + Math.min(Math.max(0,p.workoutMinutes), 120) / 60 * 0.4 + (p.hotWeather ? 0.5 : 0) : NaN
  const ideal = validCore ? 22.5 * h * h : NaN
  return { bmi:validBmi?bmi:NaN, bmr:validEnergy?bmr:NaN, tdee:validEnergy?tdee:NaN, whr, whtr, absi, bodyFat, fatMass: bodyFat == null ? null : p.weight * bodyFat / 100, leanMass: bodyFat == null ? null : p.weight * (1 - bodyFat / 100), maxHr, hydration, ideal, loss: validEnergy?tdee - 300:NaN, gain: validEnergy?tdee + 200:NaN }
}
export function bmiLabel(bmi: number) { if(!Number.isFinite(bmi)) return 'Enter age, height and weight'; const who=bmi<18.5?'WHO: underweight':bmi<25?'WHO: healthy range':bmi<30?'WHO: overweight':'WHO: obesity'; const asian=bmi<18.5?'Asian Indian: underweight':bmi<23?'Asian Indian: healthy range':bmi<25?'Asian Indian: increased risk':bmi<30?'Asian Indian: overweight':'Asian Indian: obesity'; return `${who} · ${asian}` }
export const zones = [{ name: 'Zone 1', range: [.5,.6], purpose: 'Recovery' }, { name: 'Zone 2', range: [.6,.7], purpose: 'Aerobic base' }, { name: 'Zone 3', range: [.7,.8], purpose: 'Tempo endurance' }, { name: 'Zone 4', range: [.8,.9], purpose: 'Threshold' }, { name: 'Zone 5', range: [.9,1], purpose: 'High intensity' }]
export function navyMethod(p: Profile) { return p.sex === 'male' ? 'US Navy circumference equation (waist, neck, height)' : 'US Navy circumference equation (waist, hip, neck, height)' }
