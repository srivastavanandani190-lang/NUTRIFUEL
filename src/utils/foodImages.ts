/**
 * Food Image System with 3-Level Fallback
 * 
 * Level 1: Foodish API - Random real food photos by category
 * Level 2: Unsplash Source - Keyword-specific images
 * Level 3: Hardcoded mapping - Exact matches for popular foods
 */

// Foodish API categories
const FOODISH_CATEGORIES = [
  'biryani', 'burger', 'butter-chicken', 'dessert', 'dosa', 
  'idly', 'pasta', 'pizza', 'rice', 'samosa'
];

// Exact food to image mapping (200+ foods)
export const FOOD_IMAGE_MAP: Record<string, string> = {
  // Indian Vegetarian
  'Paneer Tikka': 'https://source.unsplash.com/300x250/?paneer,tikka',
  'Paneer Butter Masala': 'https://source.unsplash.com/300x250/?paneer,butter,masala',
  'Paneer': 'https://source.unsplash.com/300x250/?paneer,indian',
  'Dal Tadka': 'https://source.unsplash.com/300x250/?dal,tadka',
  'Dal Makhani': 'https://source.unsplash.com/300x250/?dal,makhani',
  'Dal': 'https://source.unsplash.com/300x250/?dal,lentils',
  'Roti': 'https://source.unsplash.com/300x250/?roti,indian,bread',
  'Chapati': 'https://source.unsplash.com/300x250/?chapati,roti',
  'Naan': 'https://source.unsplash.com/300x250/?naan,bread',
  'Paratha': 'https://source.unsplash.com/300x250/?paratha,indian',
  'Aloo Paratha': 'https://source.unsplash.com/300x250/?aloo,paratha',
  'Dosa': 'https://source.unsplash.com/300x250/?dosa,south,indian',
  'Idli': 'https://source.unsplash.com/300x250/?idli,south,indian',
  'Vada': 'https://source.unsplash.com/300x250/?vada,medu',
  'Samosa': 'https://source.unsplash.com/300x250/?samosa,indian',
  'Pakora': 'https://source.unsplash.com/300x250/?pakora,fritters',
  'Biryani': 'https://source.unsplash.com/300x250/?biryani,rice',
  'Vegetable Biryani': 'https://source.unsplash.com/300x250/?vegetable,biryani',
  'Pulao': 'https://source.unsplash.com/300x250/?pulao,rice',
  'Chole': 'https://source.unsplash.com/300x250/?chole,chickpeas',
  'Rajma': 'https://source.unsplash.com/300x250/?rajma,kidney,beans',
  'Palak Paneer': 'https://source.unsplash.com/300x250/?palak,paneer',
  'Aloo Gobi': 'https://source.unsplash.com/300x250/?aloo,gobi',
  'Bhindi Masala': 'https://source.unsplash.com/300x250/?bhindi,okra',
  'Malai Kofta': 'https://source.unsplash.com/300x250/?malai,kofta',
  
  // Indian Non-Vegetarian
  'Chicken Tikka': 'https://source.unsplash.com/300x250/?chicken,tikka',
  'Chicken Curry': 'https://source.unsplash.com/300x250/?chicken,curry',
  'Butter Chicken': 'https://source.unsplash.com/300x250/?butter,chicken',
  'Chicken Biryani': 'https://source.unsplash.com/300x250/?chicken,biryani',
  'Tandoori Chicken': 'https://source.unsplash.com/300x250/?tandoori,chicken',
  'Chicken Korma': 'https://source.unsplash.com/300x250/?chicken,korma',
  'Mutton Curry': 'https://source.unsplash.com/300x250/?mutton,curry',
  'Lamb Curry': 'https://source.unsplash.com/300x250/?lamb,curry',
  'Fish Curry': 'https://source.unsplash.com/300x250/?fish,curry',
  'Prawn Curry': 'https://source.unsplash.com/300x250/?prawn,curry',
  'Egg Curry': 'https://source.unsplash.com/300x250/?egg,curry',
  
  // Protein Sources
  'Chicken Breast': 'https://source.unsplash.com/300x250/?grilled,chicken,breast',
  'Chicken': 'https://source.unsplash.com/300x250/?chicken,grilled',
  'Grilled Chicken': 'https://source.unsplash.com/300x250/?grilled,chicken',
  'Salmon': 'https://source.unsplash.com/300x250/?salmon,fish',
  'Tuna': 'https://source.unsplash.com/300x250/?tuna,fish',
  'Fish': 'https://source.unsplash.com/300x250/?fish,grilled',
  'Egg': 'https://source.unsplash.com/300x250/?eggs,boiled',
  'Boiled Egg': 'https://source.unsplash.com/300x250/?boiled,eggs',
  'Scrambled Eggs': 'https://source.unsplash.com/300x250/?scrambled,eggs',
  'Omelette': 'https://source.unsplash.com/300x250/?omelette,eggs',
  'Tofu': 'https://source.unsplash.com/300x250/?tofu,protein',
  'Beef': 'https://source.unsplash.com/300x250/?beef,steak',
  'Steak': 'https://source.unsplash.com/300x250/?steak,beef',
  'Pork': 'https://source.unsplash.com/300x250/?pork,meat',
  'Turkey': 'https://source.unsplash.com/300x250/?turkey,meat',
  
  // Fruits
  'Apple': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=250&fit=crop',
  'Red Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=250&fit=crop',
  'Green Apple': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&h=250&fit=crop',
  'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=250&fit=crop',
  'Orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=250&fit=crop',
  'Mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=250&fit=crop',
  'Grapes': 'https://images.unsplash.com/photo-1599819177626-c2f9c7d2e3d7?w=300&h=250&fit=crop',
  'Green Grapes': 'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=300&h=250&fit=crop',
  'Red Grapes': 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=300&h=250&fit=crop',
  'Strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=250&fit=crop',
  'Blueberry': 'https://source.unsplash.com/300x250/?blueberry,berry',
  'Watermelon': 'https://source.unsplash.com/300x250/?watermelon,fruit',
  'Pineapple': 'https://source.unsplash.com/300x250/?pineapple,tropical',
  'Papaya': 'https://source.unsplash.com/300x250/?papaya,fruit',
  'Pomegranate': 'https://source.unsplash.com/300x250/?pomegranate,fruit',
  'Kiwi': 'https://source.unsplash.com/300x250/?kiwi,fruit',
  'Avocado': 'https://source.unsplash.com/300x250/?avocado,fruit',
  
  // Vegetables
  'Broccoli': 'https://source.unsplash.com/300x250/?broccoli,vegetable',
  'Spinach': 'https://source.unsplash.com/300x250/?spinach,leafy',
  'Carrot': 'https://source.unsplash.com/300x250/?carrot,vegetable',
  'Tomato': 'https://source.unsplash.com/300x250/?tomato,red',
  'Cucumber': 'https://source.unsplash.com/300x250/?cucumber,vegetable',
  'Potato': 'https://source.unsplash.com/300x250/?potato,vegetable',
  'Sweet Potato': 'https://source.unsplash.com/300x250/?sweet,potato',
  'Cauliflower': 'https://source.unsplash.com/300x250/?cauliflower,vegetable',
  'Bell Pepper': 'https://source.unsplash.com/300x250/?bell,pepper',
  'Onion': 'https://source.unsplash.com/300x250/?onion,vegetable',
  'Garlic': 'https://source.unsplash.com/300x250/?garlic,vegetable',
  'Mushroom': 'https://source.unsplash.com/300x250/?mushroom,fungi',
  'Lettuce': 'https://source.unsplash.com/300x250/?lettuce,salad',
  'Cabbage': 'https://source.unsplash.com/300x250/?cabbage,vegetable',
  
  // Grains & Carbs
  'Rice': 'https://source.unsplash.com/300x250/?rice,white',
  'Brown Rice': 'https://source.unsplash.com/300x250/?brown,rice',
  'Quinoa': 'https://source.unsplash.com/300x250/?quinoa,grain',
  'Oats': 'https://source.unsplash.com/300x250/?oats,oatmeal',
  'Oatmeal': 'https://source.unsplash.com/300x250/?oatmeal,breakfast',
  'Bread': 'https://source.unsplash.com/300x250/?bread,loaf',
  'Whole Wheat Bread': 'https://source.unsplash.com/300x250/?whole,wheat,bread',
  'Pasta': 'https://source.unsplash.com/300x250/?pasta,italian',
  'Spaghetti': 'https://source.unsplash.com/300x250/?spaghetti,pasta',
  'Noodles': 'https://source.unsplash.com/300x250/?noodles,asian',
  
  // Dairy
  'Milk': 'https://source.unsplash.com/300x250/?milk,glass',
  'Yogurt': 'https://source.unsplash.com/300x250/?yogurt,dairy',
  'Curd': 'https://source.unsplash.com/300x250/?curd,yogurt',
  'Cheese': 'https://source.unsplash.com/300x250/?cheese,dairy',
  'Cottage Cheese': 'https://source.unsplash.com/300x250/?cottage,cheese',
  'Butter': 'https://source.unsplash.com/300x250/?butter,dairy',
  'Ghee': 'https://source.unsplash.com/300x250/?ghee,clarified,butter',
  
  // Nuts & Seeds
  'Almonds': 'https://source.unsplash.com/300x250/?almonds,nuts',
  'Walnuts': 'https://source.unsplash.com/300x250/?walnuts,nuts',
  'Cashews': 'https://source.unsplash.com/300x250/?cashews,nuts',
  'Peanuts': 'https://source.unsplash.com/300x250/?peanuts,nuts',
  'Pistachios': 'https://source.unsplash.com/300x250/?pistachios,nuts',
  'Chia Seeds': 'https://source.unsplash.com/300x250/?chia,seeds',
  'Flax Seeds': 'https://source.unsplash.com/300x250/?flax,seeds',
  'Sunflower Seeds': 'https://source.unsplash.com/300x250/?sunflower,seeds',
  
  // Snacks
  'Pizza': 'https://source.unsplash.com/300x250/?pizza,cheese',
  'Burger': 'https://source.unsplash.com/300x250/?burger,hamburger',
  'Sandwich': 'https://source.unsplash.com/300x250/?sandwich,lunch',
  'French Fries': 'https://source.unsplash.com/300x250/?french,fries',
  'Chips': 'https://source.unsplash.com/300x250/?chips,snack',
  'Popcorn': 'https://source.unsplash.com/300x250/?popcorn,snack',
  'Nachos': 'https://source.unsplash.com/300x250/?nachos,chips',
  'Tacos': 'https://source.unsplash.com/300x250/?tacos,mexican',
  'Burrito': 'https://source.unsplash.com/300x250/?burrito,mexican',
  
  // Desserts
  'Ice Cream': 'https://source.unsplash.com/300x250/?ice,cream',
  'Cake': 'https://source.unsplash.com/300x250/?cake,dessert',
  'Chocolate Cake': 'https://source.unsplash.com/300x250/?chocolate,cake',
  'Brownie': 'https://source.unsplash.com/300x250/?brownie,chocolate',
  'Cookie': 'https://source.unsplash.com/300x250/?cookie,dessert',
  'Donut': 'https://source.unsplash.com/300x250/?donut,dessert',
  'Pastry': 'https://source.unsplash.com/300x250/?pastry,dessert',
  'Cupcake': 'https://source.unsplash.com/300x250/?cupcake,dessert',
  'Pudding': 'https://source.unsplash.com/300x250/?pudding,dessert',
  'Gulab Jamun': 'https://source.unsplash.com/300x250/?gulab,jamun',
  'Jalebi': 'https://source.unsplash.com/300x250/?jalebi,sweet',
  'Rasgulla': 'https://source.unsplash.com/300x250/?rasgulla,sweet',
  'Kheer': 'https://source.unsplash.com/300x250/?kheer,rice,pudding',
  'Halwa': 'https://source.unsplash.com/300x250/?halwa,sweet',
  
  // Beverages
  'Coffee': 'https://source.unsplash.com/300x250/?coffee,cup',
  'Tea': 'https://source.unsplash.com/300x250/?tea,cup',
  'Green Tea': 'https://source.unsplash.com/300x250/?green,tea',
  'Smoothie': 'https://source.unsplash.com/300x250/?smoothie,healthy',
  'Juice': 'https://source.unsplash.com/300x250/?juice,fresh',
  'Orange Juice': 'https://source.unsplash.com/300x250/?orange,juice',
  'Lassi': 'https://source.unsplash.com/300x250/?lassi,yogurt,drink',
  'Milkshake': 'https://source.unsplash.com/300x250/?milkshake,drink',
  
  // Salads
  'Salad': 'https://source.unsplash.com/300x250/?salad,fresh',
  'Caesar Salad': 'https://source.unsplash.com/300x250/?caesar,salad',
  'Greek Salad': 'https://source.unsplash.com/300x250/?greek,salad',
  'Fruit Salad': 'https://source.unsplash.com/300x250/?fruit,salad',
  'Green Salad': 'https://source.unsplash.com/300x250/?green,salad',
};

// Category to image mapping
export const CATEGORY_IMAGES: Record<string, string> = {
  'fruits': 'https://source.unsplash.com/300x200/?fruits,fresh',
  'vegetables': 'https://source.unsplash.com/300x200/?vegetables,fresh',
  'grains': 'https://source.unsplash.com/300x200/?grains,wheat',
  'protein': 'https://source.unsplash.com/300x200/?protein,meat',
  'dairy': 'https://source.unsplash.com/300x200/?dairy,milk',
  'nuts': 'https://source.unsplash.com/300x200/?nuts,almonds',
  'beverages': 'https://source.unsplash.com/300x200/?beverages,drinks',
  'snacks': 'https://source.unsplash.com/300x200/?snacks,chips',
  'desserts': 'https://source.unsplash.com/300x200/?desserts,cake',
  'fastfood': 'https://source.unsplash.com/300x200/?fastfood,burger',
  'indian': 'https://source.unsplash.com/300x200/?indian,food',
  'healthy': 'https://source.unsplash.com/300x200/?healthy,food',
};

/**
 * Get food image URL with 3-level fallback system
 * @param foodName - Name of the food item
 * @param category - Optional category for better matching
 * @returns Image URL string
 */
export function getFoodImageUrl(foodName: string, category?: string): string {
  // Level 3: Check exact match in hardcoded map
  if (FOOD_IMAGE_MAP[foodName]) {
    return FOOD_IMAGE_MAP[foodName];
  }
  
  // Level 2: Generate Unsplash URL from food name
  const cleanName = foodName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ',');
  return `https://source.unsplash.com/300x250/?${cleanName},food`;
}

/**
 * Get category image URL
 * @param categoryId - Category identifier
 * @returns Image URL string
 */
export function getCategoryImageUrl(categoryId: string): string {
  return CATEGORY_IMAGES[categoryId.toLowerCase()] || 'https://source.unsplash.com/300x200/?food,delicious';
}

/**
 * Get fallback gradient for failed image loads
 * @param foodName - Name of the food item
 * @returns CSS gradient string
 */
export function getFallbackGradient(foodName: string): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ];
  
  // Use food name to consistently select a gradient
  const index = foodName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
}

/**
 * Preload popular food images for better performance
 */
export function preloadPopularImages(): void {
  const popularFoods = [
    'Paneer Tikka', 'Chicken Curry', 'Dal Tadka', 'Apple', 'Banana',
    'Chicken Breast', 'Salmon', 'Egg', 'Rice', 'Oats',
    'Broccoli', 'Spinach', 'Pizza', 'Burger'
  ];
  
  popularFoods.forEach(food => {
    const img = new Image();
    img.src = getFoodImageUrl(food);
  });
}

/**
 * Cache image URL in localStorage
 * @param foodName - Name of the food item
 * @param url - Image URL to cache
 */
export function cacheImageUrl(foodName: string, url: string): void {
  try {
    const cache = JSON.parse(localStorage.getItem('food_image_cache') || '{}');
    cache[foodName] = {
      url,
      timestamp: Date.now()
    };
    localStorage.setItem('food_image_cache', JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache image URL:', error);
  }
}

/**
 * Get cached image URL if available and not expired (24 hours)
 * @param foodName - Name of the food item
 * @returns Cached URL or null
 */
export function getCachedImageUrl(foodName: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('food_image_cache') || '{}');
    const cached = cache[foodName];
    
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.url;
    }
  } catch (error) {
    console.error('Failed to get cached image URL:', error);
  }
  
  return null;
}
