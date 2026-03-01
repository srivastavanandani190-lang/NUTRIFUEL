export interface MealOption {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  prepTime: number;
  isLeftover?: boolean;
}

export interface DayMeals {
  day: string;
  theme: string;
  themeEmoji: string;
  themeColor: string;
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface GroceryCategory {
  category: string;
  emoji: string;
  items: GroceryItem[];
}

export interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
  estimatedCost: number;
}

export interface PrepNote {
  day: string;
  time: string;
  task: string;
  duration: number;
}

export const THEME_NIGHTS = {
  Mon: { name: 'Meatless Monday', emoji: '🌱', color: 'from-green-500 to-emerald-600' },
  Tue: { name: 'Taco Tuesday', emoji: '🌮', color: 'from-yellow-500 to-orange-600' },
  Wed: { name: 'Wellness Wednesday', emoji: '🥗', color: 'from-teal-500 to-cyan-600' },
  Thu: { name: 'Pasta Thursday', emoji: '🍝', color: 'from-red-500 to-pink-600' },
  Fri: { name: 'Soup & Salad Friday', emoji: '🍲', color: 'from-blue-500 to-indigo-600' },
  Sat: { name: 'Grill Saturday', emoji: '🍖', color: 'from-orange-500 to-red-600' },
  Sun: { name: 'Comfort Sunday', emoji: '🧀', color: 'from-purple-500 to-pink-600' },
};

export const WEEKLY_MEAL_PLAN: DayMeals[] = [
  {
    day: 'Mon',
    theme: 'Meatless Monday',
    themeEmoji: '🌱',
    themeColor: 'from-green-500 to-emerald-600',
    breakfast: [
      {
        id: 'mon-b1',
        name: 'Oats with Almonds & Berries',
        calories: 400,
        protein: 15,
        carbs: 55,
        fat: 12,
        fiber: 8,
        ingredients: ['Oats 50g', 'Almonds 15g', 'Blueberries 50g', 'Honey 10g', 'Milk 200ml'],
        prepTime: 10,
      },
      {
        id: 'mon-b2',
        name: 'Paneer Paratha with Yogurt',
        calories: 420,
        protein: 18,
        carbs: 50,
        fat: 15,
        fiber: 6,
        ingredients: ['Whole wheat flour 80g', 'Paneer 60g', 'Yogurt 100g', 'Ghee 10g'],
        prepTime: 20,
      },
    ],
    lunch: [
      {
        id: 'mon-l1',
        name: 'Dal Tadka with Brown Rice',
        calories: 600,
        protein: 22,
        carbs: 85,
        fat: 15,
        fiber: 12,
        ingredients: ['Toor dal 80g', 'Brown rice 100g', 'Tomatoes 100g', 'Onions 50g', 'Ghee 10g'],
        prepTime: 30,
      },
      {
        id: 'mon-l2',
        name: 'Rajma Chawal with Salad',
        calories: 620,
        protein: 24,
        carbs: 90,
        fat: 12,
        fiber: 15,
        ingredients: ['Rajma 100g', 'Rice 100g', 'Cucumber 50g', 'Tomatoes 50g'],
        prepTime: 40,
      },
    ],
    dinner: [
      {
        id: 'mon-d1',
        name: 'Paneer Bhurji with Roti & Veggies',
        calories: 700,
        protein: 35,
        carbs: 65,
        fat: 25,
        fiber: 10,
        ingredients: ['Paneer 150g', 'Roti 3pcs', 'Broccoli 100g', 'Bell peppers 80g', 'Onions 50g'],
        prepTime: 25,
      },
    ],
    snacks: [
      {
        id: 'mon-s1',
        name: 'Apple with Almonds',
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
        fiber: 5,
        ingredients: ['Apple 1pc', 'Almonds 15g'],
        prepTime: 2,
      },
      {
        id: 'mon-s2',
        name: 'Greek Yogurt with Honey',
        calories: 180,
        protein: 12,
        carbs: 20,
        fat: 6,
        fiber: 2,
        ingredients: ['Greek yogurt 150g', 'Honey 15g'],
        prepTime: 2,
      },
    ],
    totalCalories: 1900,
    totalProtein: 89,
    totalCarbs: 225,
    totalFat: 62,
    totalFiber: 35,
  },
  {
    day: 'Tue',
    theme: 'Taco Tuesday',
    themeEmoji: '🌮',
    themeColor: 'from-yellow-500 to-orange-600',
    breakfast: [
      {
        id: 'tue-b1',
        name: 'Scrambled Eggs with Toast',
        calories: 380,
        protein: 20,
        carbs: 40,
        fat: 15,
        fiber: 5,
        ingredients: ['Eggs 3pcs', 'Whole wheat bread 2 slices', 'Butter 10g', 'Tomatoes 50g'],
        prepTime: 10,
      },
      {
        id: 'tue-b2',
        name: 'Protein Smoothie Bowl',
        calories: 400,
        protein: 25,
        carbs: 50,
        fat: 10,
        fiber: 8,
        ingredients: ['Banana 1pc', 'Protein powder 30g', 'Oats 30g', 'Berries 50g', 'Almond milk 200ml'],
        prepTime: 8,
      },
    ],
    lunch: [
      {
        id: 'tue-l1',
        name: 'Chicken Tacos with Salsa',
        calories: 650,
        protein: 40,
        carbs: 60,
        fat: 22,
        fiber: 10,
        ingredients: ['Chicken breast 150g', 'Tortillas 3pcs', 'Lettuce 50g', 'Tomatoes 80g', 'Cheese 30g'],
        prepTime: 25,
      },
      {
        id: 'tue-l2',
        name: 'Mushroom & Bean Tacos',
        calories: 600,
        protein: 25,
        carbs: 75,
        fat: 18,
        fiber: 15,
        ingredients: ['Mushrooms 150g', 'Black beans 100g', 'Tortillas 3pcs', 'Avocado 50g'],
        prepTime: 20,
      },
    ],
    dinner: [
      {
        id: 'tue-d1',
        name: 'Grilled Fish with Quinoa',
        calories: 680,
        protein: 45,
        carbs: 55,
        fat: 20,
        fiber: 8,
        ingredients: ['Fish fillet 200g', 'Quinoa 80g', 'Asparagus 100g', 'Lemon 1pc', 'Olive oil 10ml'],
        prepTime: 30,
      },
    ],
    snacks: [
      {
        id: 'tue-s1',
        name: 'Protein Bar',
        calories: 220,
        protein: 15,
        carbs: 25,
        fat: 8,
        fiber: 5,
        ingredients: ['Protein bar 1pc'],
        prepTime: 0,
      },
      {
        id: 'tue-s2',
        name: 'Carrot Sticks with Hummus',
        calories: 150,
        protein: 6,
        carbs: 18,
        fat: 7,
        fiber: 6,
        ingredients: ['Carrots 100g', 'Hummus 50g'],
        prepTime: 5,
      },
    ],
    totalCalories: 2080,
    totalProtein: 126,
    totalCarbs: 248,
    totalFat: 72,
    totalFiber: 42,
  },
  {
    day: 'Wed',
    theme: 'Wellness Wednesday',
    themeEmoji: '🥗',
    themeColor: 'from-teal-500 to-cyan-600',
    breakfast: [
      {
        id: 'wed-b1',
        name: 'Avocado Toast with Eggs',
        calories: 420,
        protein: 18,
        carbs: 45,
        fat: 20,
        fiber: 10,
        ingredients: ['Whole wheat bread 2 slices', 'Avocado 80g', 'Eggs 2pcs', 'Cherry tomatoes 50g'],
        prepTime: 12,
      },
      {
        id: 'wed-b2',
        name: 'Chia Pudding with Fruits',
        calories: 380,
        protein: 12,
        carbs: 50,
        fat: 15,
        fiber: 12,
        ingredients: ['Chia seeds 30g', 'Almond milk 200ml', 'Mango 80g', 'Coconut flakes 10g'],
        prepTime: 5,
      },
    ],
    lunch: [
      {
        id: 'wed-l1',
        name: 'Grilled Chicken Salad Bowl',
        calories: 580,
        protein: 45,
        carbs: 40,
        fat: 22,
        fiber: 12,
        ingredients: ['Chicken breast 150g', 'Mixed greens 100g', 'Quinoa 50g', 'Avocado 50g', 'Olive oil 15ml'],
        prepTime: 20,
      },
      {
        id: 'wed-l2',
        name: 'Buddha Bowl with Tofu',
        calories: 620,
        protein: 28,
        carbs: 70,
        fat: 24,
        fiber: 15,
        ingredients: ['Tofu 150g', 'Sweet potato 100g', 'Chickpeas 80g', 'Kale 80g', 'Tahini 20g'],
        prepTime: 25,
      },
    ],
    dinner: [
      {
        id: 'wed-d1',
        name: 'Leftover Taco Filling with Rice',
        calories: 650,
        protein: 38,
        carbs: 65,
        fat: 20,
        fiber: 10,
        ingredients: ['Leftover chicken 120g', 'Brown rice 100g', 'Bell peppers 80g', 'Corn 50g'],
        prepTime: 15,
        isLeftover: true,
      },
    ],
    snacks: [
      {
        id: 'wed-s1',
        name: 'Mixed Nuts',
        calories: 200,
        protein: 8,
        carbs: 12,
        fat: 16,
        fiber: 4,
        ingredients: ['Almonds 15g', 'Walnuts 10g', 'Cashews 10g'],
        prepTime: 0,
      },
      {
        id: 'wed-s2',
        name: 'Banana with Peanut Butter',
        calories: 220,
        protein: 8,
        carbs: 30,
        fat: 10,
        fiber: 5,
        ingredients: ['Banana 1pc', 'Peanut butter 20g'],
        prepTime: 2,
      },
    ],
    totalCalories: 2070,
    totalProtein: 119,
    totalCarbs: 242,
    totalFat: 92,
    totalFiber: 48,
  },
  {
    day: 'Thu',
    theme: 'Pasta Thursday',
    themeEmoji: '🍝',
    themeColor: 'from-red-500 to-pink-600',
    breakfast: [
      {
        id: 'thu-b1',
        name: 'Poha with Peanuts',
        calories: 380,
        protein: 12,
        carbs: 60,
        fat: 10,
        fiber: 6,
        ingredients: ['Poha 80g', 'Peanuts 20g', 'Onions 30g', 'Curry leaves', 'Lemon 1pc'],
        prepTime: 15,
      },
      {
        id: 'thu-b2',
        name: 'Idli with Sambar',
        calories: 400,
        protein: 15,
        carbs: 70,
        fat: 8,
        fiber: 8,
        ingredients: ['Idli 4pcs', 'Sambar 200ml', 'Coconut chutney 50g'],
        prepTime: 10,
      },
    ],
    lunch: [
      {
        id: 'thu-l1',
        name: 'Pesto Pasta with Veggies',
        calories: 650,
        protein: 22,
        carbs: 85,
        fat: 22,
        fiber: 10,
        ingredients: ['Whole wheat pasta 100g', 'Basil pesto 40g', 'Cherry tomatoes 80g', 'Zucchini 100g', 'Parmesan 20g'],
        prepTime: 20,
      },
      {
        id: 'thu-l2',
        name: 'Arrabiata Pasta with Chicken',
        calories: 680,
        protein: 35,
        carbs: 80,
        fat: 20,
        fiber: 8,
        ingredients: ['Pasta 100g', 'Chicken 100g', 'Tomato sauce 150g', 'Garlic 10g', 'Chili flakes'],
        prepTime: 25,
      },
    ],
    dinner: [
      {
        id: 'thu-d1',
        name: 'Grilled Paneer with Roti',
        calories: 720,
        protein: 38,
        carbs: 60,
        fat: 30,
        fiber: 8,
        ingredients: ['Paneer 180g', 'Roti 3pcs', 'Mixed veggies 150g', 'Mint chutney 30g'],
        prepTime: 25,
      },
    ],
    snacks: [
      {
        id: 'thu-s1',
        name: 'Roasted Chickpeas',
        calories: 180,
        protein: 10,
        carbs: 25,
        fat: 5,
        fiber: 8,
        ingredients: ['Chickpeas 80g', 'Olive oil 5ml', 'Spices'],
        prepTime: 30,
      },
      {
        id: 'thu-s2',
        name: 'Orange with Walnuts',
        calories: 200,
        protein: 6,
        carbs: 28,
        fat: 10,
        fiber: 6,
        ingredients: ['Orange 1pc', 'Walnuts 20g'],
        prepTime: 2,
      },
    ],
    totalCalories: 2210,
    totalProtein: 123,
    totalCarbs: 318,
    totalFat: 85,
    totalFiber: 46,
  },
  {
    day: 'Fri',
    theme: 'Soup & Salad Friday',
    themeEmoji: '🍲',
    themeColor: 'from-blue-500 to-indigo-600',
    breakfast: [
      {
        id: 'fri-b1',
        name: 'Masala Dosa with Chutney',
        calories: 420,
        protein: 12,
        carbs: 65,
        fat: 12,
        fiber: 6,
        ingredients: ['Dosa 2pcs', 'Potato filling 100g', 'Coconut chutney 50g', 'Sambar 100ml'],
        prepTime: 20,
      },
      {
        id: 'fri-b2',
        name: 'Upma with Vegetables',
        calories: 380,
        protein: 10,
        carbs: 60,
        fat: 10,
        fiber: 8,
        ingredients: ['Semolina 80g', 'Mixed veggies 100g', 'Peanuts 15g', 'Curry leaves'],
        prepTime: 15,
      },
    ],
    lunch: [
      {
        id: 'fri-l1',
        name: 'Tomato Soup with Grilled Sandwich',
        calories: 580,
        protein: 25,
        carbs: 70,
        fat: 20,
        fiber: 10,
        ingredients: ['Tomatoes 200g', 'Cream 30ml', 'Bread 4 slices', 'Cheese 40g', 'Veggies 100g'],
        prepTime: 25,
      },
      {
        id: 'fri-l2',
        name: 'Lentil Soup with Quinoa Salad',
        calories: 620,
        protein: 28,
        carbs: 80,
        fat: 18,
        fiber: 15,
        ingredients: ['Lentils 100g', 'Quinoa 60g', 'Mixed greens 100g', 'Olive oil 15ml'],
        prepTime: 30,
      },
    ],
    dinner: [
      {
        id: 'fri-d1',
        name: 'Chicken Soup with Whole Wheat Bread',
        calories: 650,
        protein: 45,
        carbs: 60,
        fat: 18,
        fiber: 8,
        ingredients: ['Chicken 150g', 'Mixed veggies 150g', 'Whole wheat bread 2 slices', 'Herbs'],
        prepTime: 35,
      },
    ],
    snacks: [
      {
        id: 'fri-s1',
        name: 'Makhana (Fox Nuts)',
        calories: 150,
        protein: 5,
        carbs: 22,
        fat: 5,
        fiber: 4,
        ingredients: ['Makhana 40g', 'Ghee 5g', 'Spices'],
        prepTime: 10,
      },
      {
        id: 'fri-s2',
        name: 'Dates with Almonds',
        calories: 200,
        protein: 6,
        carbs: 32,
        fat: 8,
        fiber: 5,
        ingredients: ['Dates 4pcs', 'Almonds 15g'],
        prepTime: 0,
      },
    ],
    totalCalories: 2000,
    totalProtein: 121,
    totalCarbs: 289,
    totalFat: 73,
    totalFiber: 48,
  },
  {
    day: 'Sat',
    theme: 'Grill Saturday',
    themeEmoji: '🍖',
    themeColor: 'from-orange-500 to-red-600',
    breakfast: [
      {
        id: 'sat-b1',
        name: 'French Toast with Berries',
        calories: 420,
        protein: 16,
        carbs: 55,
        fat: 15,
        fiber: 6,
        ingredients: ['Bread 3 slices', 'Eggs 2pcs', 'Milk 100ml', 'Berries 80g', 'Maple syrup 15ml'],
        prepTime: 15,
      },
      {
        id: 'sat-b2',
        name: 'Aloo Paratha with Curd',
        calories: 450,
        protein: 14,
        carbs: 65,
        fat: 16,
        fiber: 7,
        ingredients: ['Whole wheat flour 100g', 'Potato 150g', 'Curd 150g', 'Ghee 15g'],
        prepTime: 25,
      },
    ],
    lunch: [
      {
        id: 'sat-l1',
        name: 'Grilled Chicken with Sweet Potato',
        calories: 680,
        protein: 50,
        carbs: 60,
        fat: 22,
        fiber: 10,
        ingredients: ['Chicken breast 200g', 'Sweet potato 200g', 'Broccoli 100g', 'Olive oil 15ml'],
        prepTime: 30,
      },
      {
        id: 'sat-l2',
        name: 'BBQ Paneer with Corn',
        calories: 650,
        protein: 35,
        carbs: 55,
        fat: 28,
        fiber: 8,
        ingredients: ['Paneer 180g', 'Corn 100g', 'Bell peppers 100g', 'BBQ sauce 30g'],
        prepTime: 25,
      },
    ],
    dinner: [
      {
        id: 'sat-d1',
        name: 'Grilled Fish with Salad',
        calories: 620,
        protein: 48,
        carbs: 40,
        fat: 25,
        fiber: 8,
        ingredients: ['Fish 200g', 'Mixed salad 200g', 'Quinoa 60g', 'Lemon dressing 20ml'],
        prepTime: 25,
      },
    ],
    snacks: [
      {
        id: 'sat-s1',
        name: 'Trail Mix',
        calories: 220,
        protein: 8,
        carbs: 20,
        fat: 14,
        fiber: 5,
        ingredients: ['Mixed nuts 30g', 'Dried fruits 20g', 'Dark chocolate chips 10g'],
        prepTime: 0,
      },
      {
        id: 'sat-s2',
        name: 'Protein Shake',
        calories: 200,
        protein: 25,
        carbs: 15,
        fat: 5,
        fiber: 3,
        ingredients: ['Protein powder 30g', 'Banana 1pc', 'Almond milk 200ml'],
        prepTime: 5,
      },
    ],
    totalCalories: 2240,
    totalProtein: 146,
    totalCarbs: 255,
    totalFat: 110,
    totalFiber: 42,
  },
  {
    day: 'Sun',
    theme: 'Comfort Sunday',
    themeEmoji: '🧀',
    themeColor: 'from-purple-500 to-pink-600',
    breakfast: [
      {
        id: 'sun-b1',
        name: 'Pancakes with Maple Syrup',
        calories: 450,
        protein: 14,
        carbs: 70,
        fat: 14,
        fiber: 5,
        ingredients: ['Flour 100g', 'Eggs 2pcs', 'Milk 150ml', 'Maple syrup 30ml', 'Butter 10g'],
        prepTime: 20,
      },
      {
        id: 'sun-b2',
        name: 'Chole Bhature',
        calories: 520,
        protein: 18,
        carbs: 75,
        fat: 18,
        fiber: 10,
        ingredients: ['Chickpeas 150g', 'Bhature 2pcs', 'Onions 50g', 'Pickle 20g'],
        prepTime: 30,
      },
    ],
    lunch: [
      {
        id: 'sun-l1',
        name: 'Butter Chicken with Naan',
        calories: 720,
        protein: 45,
        carbs: 65,
        fat: 30,
        fiber: 6,
        ingredients: ['Chicken 180g', 'Butter 20g', 'Cream 50ml', 'Naan 2pcs', 'Tomato gravy 150g'],
        prepTime: 40,
      },
      {
        id: 'sun-l2',
        name: 'Paneer Tikka Masala with Rice',
        calories: 700,
        protein: 35,
        carbs: 70,
        fat: 28,
        fiber: 8,
        ingredients: ['Paneer 180g', 'Rice 120g', 'Tikka masala 150g', 'Cream 30ml'],
        prepTime: 35,
      },
    ],
    dinner: [
      {
        id: 'sun-d1',
        name: 'Mac & Cheese with Veggies',
        calories: 680,
        protein: 28,
        carbs: 75,
        fat: 28,
        fiber: 6,
        ingredients: ['Macaroni 100g', 'Cheese 80g', 'Milk 150ml', 'Broccoli 100g', 'Carrots 80g'],
        prepTime: 25,
      },
    ],
    snacks: [
      {
        id: 'sun-s1',
        name: 'Samosa with Chutney',
        calories: 250,
        protein: 6,
        carbs: 35,
        fat: 10,
        fiber: 4,
        ingredients: ['Samosa 2pcs', 'Mint chutney 30g'],
        prepTime: 0,
      },
      {
        id: 'sun-s2',
        name: 'Gulab Jamun',
        calories: 200,
        protein: 4,
        carbs: 35,
        fat: 8,
        fiber: 2,
        ingredients: ['Gulab jamun 2pcs'],
        prepTime: 0,
      },
    ],
    totalCalories: 2300,
    totalProtein: 115,
    totalCarbs: 350,
    totalFat: 108,
    totalFiber: 36,
  },
];

export const PREP_NOTES: PrepNote[] = [
  { day: 'Sun', time: '4:00 PM', task: 'Chop onions, tomatoes, garlic for 3 days', duration: 30 },
  { day: 'Sun', time: '4:30 PM', task: 'Cook dal batch (4 portions)', duration: 45 },
  { day: 'Sun', time: '5:15 PM', task: 'Marinate chicken for Tuesday tacos', duration: 15 },
  { day: 'Mon', time: '7:00 AM', task: 'Boil eggs for breakfast', duration: 10 },
  { day: 'Mon', time: '7:10 AM', task: 'Prepare overnight oats for Tuesday', duration: 5 },
  { day: 'Wed', time: '6:00 PM', task: 'Use leftover taco filling with rice', duration: 15 },
  { day: 'Thu', time: '7:00 PM', task: 'Roast chickpeas for Friday snack', duration: 30 },
  { day: 'Sat', time: '10:00 AM', task: 'Prep grill items and marinades', duration: 20 },
];

export const GROCERY_LIST: GroceryCategory[] = [
  {
    category: 'Produce',
    emoji: '🥬',
    items: [
      { name: 'Spinach', quantity: '500', unit: 'g', checked: false, estimatedCost: 40 },
      { name: 'Broccoli', quantity: '400', unit: 'g', checked: false, estimatedCost: 60 },
      { name: 'Tomatoes', quantity: '1', unit: 'kg', checked: false, estimatedCost: 50 },
      { name: 'Onions', quantity: '1', unit: 'kg', checked: false, estimatedCost: 40 },
      { name: 'Bell Peppers', quantity: '500', unit: 'g', checked: false, estimatedCost: 80 },
      { name: 'Carrots', quantity: '500', unit: 'g', checked: false, estimatedCost: 30 },
      { name: 'Cucumber', quantity: '500', unit: 'g', checked: false, estimatedCost: 30 },
      { name: 'Mixed Greens', quantity: '300', unit: 'g', checked: false, estimatedCost: 60 },
      { name: 'Avocado', quantity: '3', unit: 'pcs', checked: false, estimatedCost: 150 },
      { name: 'Lemon', quantity: '6', unit: 'pcs', checked: false, estimatedCost: 30 },
      { name: 'Garlic', quantity: '100', unit: 'g', checked: false, estimatedCost: 20 },
      { name: 'Ginger', quantity: '100', unit: 'g', checked: false, estimatedCost: 20 },
      { name: 'Sweet Potato', quantity: '500', unit: 'g', checked: false, estimatedCost: 40 },
      { name: 'Mushrooms', quantity: '300', unit: 'g', checked: false, estimatedCost: 100 },
    ],
  },
  {
    category: 'Dairy',
    emoji: '🧀',
    items: [
      { name: 'Paneer', quantity: '1', unit: 'kg', checked: false, estimatedCost: 350 },
      { name: 'Milk', quantity: '2', unit: 'L', checked: false, estimatedCost: 120 },
      { name: 'Yogurt', quantity: '1', unit: 'kg', checked: false, estimatedCost: 80 },
      { name: 'Greek Yogurt', quantity: '500', unit: 'g', checked: false, estimatedCost: 150 },
      { name: 'Cheese', quantity: '300', unit: 'g', checked: false, estimatedCost: 200 },
      { name: 'Butter', quantity: '200', unit: 'g', checked: false, estimatedCost: 100 },
    ],
  },
  {
    category: 'Protein',
    emoji: '🥩',
    items: [
      { name: 'Chicken Breast', quantity: '1.2', unit: 'kg', checked: false, estimatedCost: 360 },
      { name: 'Fish Fillet', quantity: '600', unit: 'g', checked: false, estimatedCost: 400 },
      { name: 'Eggs', quantity: '24', unit: 'pcs', checked: false, estimatedCost: 150 },
      { name: 'Tofu', quantity: '400', unit: 'g', checked: false, estimatedCost: 120 },
      { name: 'Toor Dal', quantity: '500', unit: 'g', checked: false, estimatedCost: 80 },
    ],
  },
  {
    category: 'Grains',
    emoji: '🌾',
    items: [
      { name: 'Brown Rice', quantity: '2', unit: 'kg', checked: false, estimatedCost: 180 },
      { name: 'Oats', quantity: '1', unit: 'kg', checked: false, estimatedCost: 150 },
      { name: 'Whole Wheat Flour', quantity: '2', unit: 'kg', checked: false, estimatedCost: 100 },
      { name: 'Quinoa', quantity: '500', unit: 'g', checked: false, estimatedCost: 300 },
      { name: 'Pasta', quantity: '500', unit: 'g', checked: false, estimatedCost: 80 },
      { name: 'Bread', quantity: '2', unit: 'loaves', checked: false, estimatedCost: 80 },
    ],
  },
  {
    category: 'Snacks',
    emoji: '🥜',
    items: [
      { name: 'Almonds', quantity: '250', unit: 'g', checked: false, estimatedCost: 200 },
      { name: 'Walnuts', quantity: '150', unit: 'g', checked: false, estimatedCost: 180 },
      { name: 'Protein Bars', quantity: '7', unit: 'pcs', checked: false, estimatedCost: 350 },
      { name: 'Peanut Butter', quantity: '500', unit: 'g', checked: false, estimatedCost: 250 },
      { name: 'Hummus', quantity: '300', unit: 'g', checked: false, estimatedCost: 150 },
    ],
  },
  {
    category: 'Fruits',
    emoji: '🍎',
    items: [
      { name: 'Apples', quantity: '1', unit: 'kg', checked: false, estimatedCost: 150 },
      { name: 'Bananas', quantity: '12', unit: 'pcs', checked: false, estimatedCost: 60 },
      { name: 'Berries', quantity: '500', unit: 'g', checked: false, estimatedCost: 200 },
      { name: 'Oranges', quantity: '6', unit: 'pcs', checked: false, estimatedCost: 80 },
      { name: 'Mango', quantity: '3', unit: 'pcs', checked: false, estimatedCost: 150 },
    ],
  },
];

export const calculateWeeklyTotal = () => {
  const totals = WEEKLY_MEAL_PLAN.reduce(
    (acc, day) => ({
      calories: acc.calories + day.totalCalories,
      protein: acc.protein + day.totalProtein,
      carbs: acc.carbs + day.totalCarbs,
      fat: acc.fat + day.totalFat,
      fiber: acc.fiber + day.totalFiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return {
    ...totals,
    avgCalories: Math.round(totals.calories / 7),
    avgProtein: Math.round(totals.protein / 7),
    avgCarbs: Math.round(totals.carbs / 7),
    avgFat: Math.round(totals.fat / 7),
    avgFiber: Math.round(totals.fiber / 7),
  };
};

export const calculateGroceryTotal = (): number => {
  return GROCERY_LIST.reduce((total, category) => {
    return total + category.items.reduce((sum, item) => sum + item.estimatedCost, 0);
  }, 0);
};
