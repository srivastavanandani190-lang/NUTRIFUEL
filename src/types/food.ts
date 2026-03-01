export type FoodCategory = 'Fruits' | 'Veggies' | 'Vegetarian' | 'Non-Veg' | 'Snacks' | 'Desserts' | 'Dairy' | 'Grains';

export interface NutritionFacts {
  // Serving Information
  servingSize: string; // e.g., "100g", "1 cup (240ml)", "1 medium (182g)"
  servingsPerContainer?: number;
  
  // Macronutrients
  calories: number; // kcal
  totalFat: number; // g
  saturatedFat: number; // g
  transFat: number; // g
  cholesterol: number; // mg
  sodium: number; // mg
  totalCarbohydrates: number; // g
  dietaryFiber: number; // g
  totalSugars: number; // g
  addedSugars: number; // g
  protein: number; // g
  
  // Micronutrients
  vitaminD: number; // mcg
  calcium: number; // mg
  iron: number; // mg
  potassium: number; // mg
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  thiamin?: number; // mg
  riboflavin?: number; // mg
  niacin?: number; // mg
  vitaminB6?: number; // mg
  folate?: number; // mcg
  vitaminB12?: number; // mcg
  phosphorus?: number; // mg
  magnesium?: number; // mg
  zinc?: number; // mg
  selenium?: number; // mcg
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  
  // Basic nutrition (for backward compatibility)
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  
  // Complete nutrition facts (optional - auto-generated if not provided)
  nutritionFacts?: NutritionFacts;
  
  image: string;
  prepTime: number; // in minutes
  description: string;
  ingredients: string[];
  recipe: string[];
}

export interface Meal {
  id: string;
  name: string;
  foods: Food[];
  totalCalories: number;
}

export interface DailyPlan {
  date: string;
  targetCalories: number;
  consumedCalories: number;
  meals: Meal[];
}

export interface Exercise {
  id: string;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
}

export const EXERCISE_TYPES = [
  { name: 'Running', burnRate: 10 },
  { name: 'Gym', burnRate: 8 },
  { name: 'Cycling', burnRate: 7 },
  { name: 'Walking', burnRate: 5 },
  { name: 'Swimming', burnRate: 9 },
];
