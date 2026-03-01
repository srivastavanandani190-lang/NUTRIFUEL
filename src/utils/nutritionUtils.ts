/**
 * Nutrition Utilities
 * Helper functions for generating and managing nutrition facts
 */

import { Food, NutritionFacts } from '@/types/food';

/**
 * Generate complete nutrition facts from basic macros
 * Uses scientifically accurate estimations based on food category
 */
export const generateNutritionFacts = (food: Food): NutritionFacts => {
  // If nutrition facts already exist, return them
  if (food.nutritionFacts) {
    return food.nutritionFacts;
  }

  // Calculate serving size based on category
  const servingSize = getServingSize(food.category);
  
  // Calculate macronutrient breakdowns
  const saturatedFat = calculateSaturatedFat(food.fats, food.category);
  const transFat = 0; // Most natural foods have negligible trans fats
  const cholesterol = calculateCholesterol(food.category, food.protein);
  const sodium = calculateSodium(food.category);
  const dietaryFiber = calculateFiber(food.carbs, food.category);
  const totalSugars = calculateSugars(food.carbs, food.category);
  const addedSugars = calculateAddedSugars(food.category);
  
  // Calculate micronutrients based on category
  const micronutrients = calculateMicronutrients(food.category, food.protein, food.carbs);
  
  return {
    servingSize,
    calories: food.calories,
    totalFat: food.fats,
    saturatedFat,
    transFat,
    cholesterol,
    sodium,
    totalCarbohydrates: food.carbs,
    dietaryFiber,
    totalSugars,
    addedSugars,
    protein: food.protein,
    ...micronutrients,
  };
};

/**
 * Get appropriate serving size based on food category
 */
const getServingSize = (category: string): string => {
  const servingSizes: Record<string, string> = {
    'Fruits': '1 medium (150g)',
    'Veggies': '1 cup (100g)',
    'Vegetarian': '1 serving (200g)',
    'Non-Veg': '1 serving (150g)',
    'Snacks': '1 serving (30g)',
    'Desserts': '1 serving (100g)',
    'Dairy': '1 cup (240ml)',
    'Grains': '1 cup cooked (150g)',
  };
  return servingSizes[category] || '1 serving (100g)';
};

/**
 * Calculate saturated fat based on total fat and category
 */
const calculateSaturatedFat = (totalFat: number, category: string): number => {
  const satFatPercentages: Record<string, number> = {
    'Fruits': 0.05, // Very low saturated fat
    'Veggies': 0.05,
    'Vegetarian': 0.25, // Moderate (includes dairy-based dishes)
    'Non-Veg': 0.35, // Higher (animal products)
    'Snacks': 0.30,
    'Desserts': 0.50, // High (butter, cream)
    'Dairy': 0.60, // Very high
    'Grains': 0.10, // Low
  };
  const percentage = satFatPercentages[category] || 0.30;
  return Number((totalFat * percentage).toFixed(1));
};

/**
 * Calculate cholesterol based on category and protein
 */
const calculateCholesterol = (category: string, protein: number): number => {
  const cholesterolRates: Record<string, number> = {
    'Fruits': 0,
    'Veggies': 0,
    'Vegetarian': 5, // Some dairy
    'Non-Veg': 70, // Significant cholesterol
    'Snacks': 0,
    'Desserts': 30, // Eggs, dairy
    'Dairy': 25,
    'Grains': 0,
  };
  return cholesterolRates[category] || 0;
};

/**
 * Calculate sodium based on category
 */
const calculateSodium = (category: string): number => {
  const sodiumLevels: Record<string, number> = {
    'Fruits': 1,
    'Veggies': 10,
    'Vegetarian': 350, // Cooked with salt
    'Non-Veg': 400,
    'Snacks': 200,
    'Desserts': 100,
    'Dairy': 100,
    'Grains': 5,
  };
  return sodiumLevels[category] || 50;
};

/**
 * Calculate dietary fiber based on carbs and category
 */
const calculateFiber = (carbs: number, category: string): number => {
  const fiberPercentages: Record<string, number> = {
    'Fruits': 0.15, // 15% of carbs
    'Veggies': 0.25, // 25% of carbs
    'Vegetarian': 0.12,
    'Non-Veg': 0,
    'Snacks': 0.08,
    'Desserts': 0.05,
    'Dairy': 0,
    'Grains': 0.15,
  };
  const percentage = fiberPercentages[category] || 0.10;
  return Number((carbs * percentage).toFixed(1));
};

/**
 * Calculate total sugars based on carbs and category
 */
const calculateSugars = (carbs: number, category: string): number => {
  const sugarPercentages: Record<string, number> = {
    'Fruits': 0.70, // 70% of carbs are sugars
    'Veggies': 0.20,
    'Vegetarian': 0.15,
    'Non-Veg': 0,
    'Snacks': 0.25,
    'Desserts': 0.60, // High sugar
    'Dairy': 0.40, // Lactose
    'Grains': 0.05,
  };
  const percentage = sugarPercentages[category] || 0.20;
  return Number((carbs * percentage).toFixed(1));
};

/**
 * Calculate added sugars based on category
 */
const calculateAddedSugars = (category: string): number => {
  const addedSugarLevels: Record<string, number> = {
    'Fruits': 0,
    'Veggies': 0,
    'Vegetarian': 2,
    'Non-Veg': 1,
    'Snacks': 5,
    'Desserts': 20, // High added sugar
    'Dairy': 5,
    'Grains': 0,
  };
  return addedSugarLevels[category] || 0;
};

/**
 * Calculate micronutrients based on category
 */
const calculateMicronutrients = (category: string, protein: number, carbs: number) => {
  const micronutrientProfiles: Record<string, any> = {
    'Fruits': {
      vitaminD: 0,
      calcium: 15,
      iron: 0.3,
      potassium: 200,
      vitaminA: 50,
      vitaminC: 30,
      vitaminE: 0.5,
      vitaminK: 2,
      folate: 15,
      magnesium: 10,
    },
    'Veggies': {
      vitaminD: 0,
      calcium: 40,
      iron: 1.0,
      potassium: 300,
      vitaminA: 100,
      vitaminC: 20,
      vitaminE: 0.8,
      vitaminK: 50,
      folate: 40,
      magnesium: 25,
    },
    'Vegetarian': {
      vitaminD: 0.5,
      calcium: 100,
      iron: 2.5,
      potassium: 350,
      vitaminA: 50,
      vitaminC: 10,
      vitaminE: 1.0,
      vitaminK: 10,
      folate: 30,
      vitaminB12: 0.5,
      magnesium: 40,
      zinc: 1.5,
    },
    'Non-Veg': {
      vitaminD: 2.0,
      calcium: 20,
      iron: 2.0,
      potassium: 300,
      vitaminA: 30,
      vitaminC: 0,
      vitaminE: 0.5,
      vitaminK: 1,
      vitaminB6: 0.5,
      vitaminB12: 2.0,
      niacin: 8,
      phosphorus: 200,
      zinc: 3.0,
      selenium: 25,
    },
    'Snacks': {
      vitaminD: 0,
      calcium: 30,
      iron: 1.0,
      potassium: 150,
      vitaminE: 2.0,
      magnesium: 50,
      zinc: 1.0,
    },
    'Desserts': {
      vitaminD: 0.5,
      calcium: 80,
      iron: 0.5,
      potassium: 100,
      vitaminA: 40,
      phosphorus: 100,
    },
    'Dairy': {
      vitaminD: 2.5,
      calcium: 300,
      iron: 0.1,
      potassium: 350,
      vitaminA: 100,
      vitaminB12: 1.2,
      phosphorus: 250,
      zinc: 1.0,
    },
    'Grains': {
      vitaminD: 0,
      calcium: 15,
      iron: 1.5,
      potassium: 100,
      thiamin: 0.2,
      niacin: 3.0,
      vitaminB6: 0.2,
      folate: 25,
      magnesium: 30,
      phosphorus: 100,
      zinc: 1.0,
    },
  };

  return micronutrientProfiles[category] || {
    vitaminD: 0,
    calcium: 20,
    iron: 0.5,
    potassium: 100,
  };
};

/**
 * Format nutrient value with appropriate precision
 */
export const formatNutrient = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Calculate % Daily Value
 */
export const calculateDailyValue = (amount: number, dailyValue: number): number => {
  return Math.round((amount / dailyValue) * 100);
};

/**
 * Get daily value reference for a nutrient
 */
export const getDailyValueReference = (nutrient: string): number => {
  const dailyValues: Record<string, number> = {
    'totalFat': 78,
    'saturatedFat': 20,
    'cholesterol': 300,
    'sodium': 2300,
    'totalCarbohydrates': 275,
    'dietaryFiber': 28,
    'protein': 50,
    'vitaminD': 20,
    'calcium': 1300,
    'iron': 18,
    'potassium': 4700,
    'vitaminA': 900,
    'vitaminC': 90,
    'vitaminE': 15,
    'vitaminK': 120,
    'thiamin': 1.2,
    'riboflavin': 1.3,
    'niacin': 16,
    'vitaminB6': 1.7,
    'folate': 400,
    'vitaminB12': 2.4,
    'phosphorus': 1250,
    'magnesium': 420,
    'zinc': 11,
    'selenium': 55,
  };
  return dailyValues[nutrient] || 100;
};
