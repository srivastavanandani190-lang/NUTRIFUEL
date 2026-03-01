/**
 * Edamam Nutrition API Integration
 * Provides live nutrition data for food items
 */

import { Food } from '@/types/food';

// Edamam API Credentials
const EDAMAM_APP_ID = '9b2a2b8e';
const EDAMAM_APP_KEY = '1b3e6f8a8f8b9c0d1e2f3a4b5c6d7e8f';
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/nutrition-data';

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface EdamamNutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface EdamamResponse {
  calories: number;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  totalNutrients: {
    ENERC_KCAL?: EdamamNutrient;
    PROCNT?: EdamamNutrient;
    CHOCDF?: EdamamNutrient;
    FAT?: EdamamNutrient;
    FIBTG?: EdamamNutrient;
    SUGAR?: EdamamNutrient;
    NA?: EdamamNutrient;
    CA?: EdamamNutrient;
    FE?: EdamamNutrient;
    VITD?: EdamamNutrient;
    VITC?: EdamamNutrient;
    VITA_RAE?: EdamamNutrient;
    K?: EdamamNutrient;
    MG?: EdamamNutrient;
    ZN?: EdamamNutrient;
    CHOLE?: EdamamNutrient;
    FASAT?: EdamamNutrient;
    FATRN?: EdamamNutrient;
  };
  totalDaily: Record<string, EdamamNutrient>;
}

interface CachedData {
  data: EdamamResponse;
  timestamp: number;
}

/**
 * Get nutrition data from Edamam API
 */
export const getNutritionFromEdamam = async (foodName: string, quantity: string = '100g'): Promise<EdamamResponse | null> => {
  const cacheKey = `edamam_${foodName}_${quantity}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`✅ Using cached data for ${foodName}`);
    return cached;
  }

  try {
    const ingredient = `${quantity} ${foodName}`;
    const url = `${EDAMAM_BASE_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(ingredient)}`;
    
    console.log(`🔄 Fetching live nutrition data for: ${ingredient}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.status}`);
    }
    
    const data: EdamamResponse = await response.json();
    
    // Validate response has nutrition data
    if (!data.calories && !data.totalNutrients) {
      throw new Error('No nutrition data returned');
    }
    
    // Cache the result
    setCachedData(cacheKey, data);
    
    console.log(`✅ Live nutrition data fetched for ${foodName}: ${data.calories} kcal`);
    
    return data;
  } catch (error) {
    console.error(`❌ Edamam API error for ${foodName}:`, error);
    return null;
  }
};

/**
 * Convert Edamam response to Food object
 */
export const convertEdamamToFood = (foodName: string, edamamData: EdamamResponse, category: string = 'Search Results'): Food => {
  const nutrients = edamamData.totalNutrients;
  
  return {
    id: `edamam_${foodName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    name: foodName.charAt(0).toUpperCase() + foodName.slice(1),
    category: category as any,
    calories: Math.round(edamamData.calories || 0),
    protein: Math.round(nutrients.PROCNT?.quantity || 0),
    carbs: Math.round(nutrients.CHOCDF?.quantity || 0),
    fats: Math.round(nutrients.FAT?.quantity || 0),
    nutritionFacts: {
      servingSize: '100g',
      calories: Math.round(edamamData.calories || 0),
      totalFat: Math.round(nutrients.FAT?.quantity || 0),
      saturatedFat: nutrients.FASAT?.quantity || 0,
      transFat: nutrients.FATRN?.quantity || 0,
      cholesterol: Math.round(nutrients.CHOLE?.quantity || 0),
      sodium: Math.round(nutrients.NA?.quantity || 0),
      totalCarbohydrates: Math.round(nutrients.CHOCDF?.quantity || 0),
      dietaryFiber: nutrients.FIBTG?.quantity || 0,
      totalSugars: nutrients.SUGAR?.quantity || 0,
      addedSugars: 0,
      protein: Math.round(nutrients.PROCNT?.quantity || 0),
      vitaminD: nutrients.VITD?.quantity || 0,
      calcium: Math.round(nutrients.CA?.quantity || 0),
      iron: nutrients.FE?.quantity || 0,
      potassium: Math.round(nutrients.K?.quantity || 0),
      vitaminA: nutrients.VITA_RAE?.quantity,
      vitaminC: nutrients.VITC?.quantity,
      magnesium: Math.round(nutrients.MG?.quantity || 0),
      zinc: nutrients.ZN?.quantity,
    },
    image: getDefaultFoodImage(foodName, category),
    prepTime: 15,
    description: `Fresh ${foodName} with complete nutrition data from Edamam API`,
    ingredients: [foodName],
    recipe: [
      'This is a live nutrition result from Edamam API',
      'Nutrition values are based on 100g serving',
      'Data sourced from USDA and other verified databases',
    ],
  };
};

/**
 * Search multiple foods from Edamam
 */
export const searchFoodsFromEdamam = async (foodNames: string[]): Promise<Food[]> => {
  const results: Food[] = [];
  
  for (const foodName of foodNames) {
    const data = await getNutritionFromEdamam(foodName);
    if (data && data.calories > 0) {
      results.push(convertEdamamToFood(foodName, data));
    }
  }
  
  return results;
};

/**
 * Get default food image based on name and category
 */
const getDefaultFoodImage = (foodName: string, category: string): string => {
  const name = foodName.toLowerCase();
  
  // Fruits
  if (name.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
  if (name.includes('banana')) return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400';
  if (name.includes('orange')) return 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400';
  if (name.includes('mango')) return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400';
  if (name.includes('strawberry')) return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400';
  
  // Vegetables
  if (name.includes('spinach') || name.includes('palak')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400';
  if (name.includes('broccoli')) return 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400';
  if (name.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400';
  if (name.includes('tomato')) return 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400';
  
  // Proteins
  if (name.includes('chicken')) return 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400';
  if (name.includes('egg')) return 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400';
  if (name.includes('fish')) return 'https://images.unsplash.com/photo-1559737558-2f5a35f4523f?w=400';
  if (name.includes('paneer')) return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400';
  if (name.includes('dal') || name.includes('lentil')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400';
  
  // Grains
  if (name.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
  if (name.includes('roti') || name.includes('chapati')) return 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400';
  if (name.includes('bread')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400';
  
  // Dairy
  if (name.includes('milk')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400';
  if (name.includes('curd') || name.includes('yogurt')) return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400';
  if (name.includes('cheese')) return 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400';
  
  // Default
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
};

/**
 * Cache management
 */
const getCachedData = (key: string): EdamamResponse | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const parsed: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (24 hours)
    if (now - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedData = (key: string, data: EdamamResponse): void => {
  try {
    const cached: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cached));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith('edamam_')) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const parsed: CachedData = JSON.parse(cached);
          if (now - parsed.timestamp >= CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
};

/**
 * Popular foods for quick search
 */
export const POPULAR_FOODS = [
  // Indian Foods
  'Paneer', 'Dal', 'Roti', 'Rice', 'Curd', 'Chapati', 'Idli', 'Dosa',
  // Proteins
  'Chicken', 'Egg', 'Fish', 'Tofu', 'Salmon',
  // Fruits
  'Apple', 'Banana', 'Orange', 'Mango', 'Strawberry', 'Grapes', 'Watermelon',
  // Vegetables
  'Spinach', 'Broccoli', 'Carrot', 'Tomato', 'Potato', 'Onion',
  // Grains
  'Oats', 'Quinoa', 'Brown Rice', 'Bread', 'Pasta',
  // Dairy
  'Milk', 'Yogurt', 'Cheese', 'Butter',
  // Nuts
  'Almonds', 'Cashews', 'Walnuts', 'Peanuts',
];

/**
 * Check if Edamam API is available
 */
export const checkEdamamStatus = async (): Promise<boolean> => {
  try {
    const response = await getNutritionFromEdamam('apple', '100g');
    return response !== null && response.calories > 0;
  } catch {
    return false;
  }
};
