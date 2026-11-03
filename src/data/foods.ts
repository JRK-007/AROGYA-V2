// Values are per 100 g of edible portion. Initial entries are marked as estimates;
// replace with validated IFCT/INDB imports before presenting them as verified.
export type Food = { id: string; name: string; local: string; category: string; kcal: number; protein: number; carbs: number; fat: number; fiber: number; saturatedFat?: number; sugar?: number; sodium?: number; source: string; status: 'Estimated' | 'Unverified' | 'Verified' }
// No nutrition values are seeded. Populate from licensed, source-attributed data
// through the import workflow, or create user-entered custom foods.
export const foods: Food[] = []
