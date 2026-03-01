import { Food, FoodCategory } from '../types/food';

export const MOCK_FOODS: Food[] = [
  // Vegetarian
  {
    id: 'v1',
    name: 'Paneer Tikka',
    category: 'Vegetarian',
    calories: 250,
    protein: 15,
    carbs: 8,
    fats: 18,
    prepTime: 25,
    description: 'Grilled paneer cubes marinated in spices and yogurt.',
    ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Onion', 'Spices'],
    recipe: [
      'Cut paneer and vegetables into cubes.',
      'Mix yogurt and spices to create a marinade.',
      'Marinate paneer and veggies for at least 30 minutes.',
      'Skewer the paneer and veggies.',
      'Grill or bake until golden brown and slightly charred.',
      'Serve hot with mint chutney.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_be5202f1-f8dd-42dd-9b04-251063b307ee.jpg'
  },
  {
    id: 'v2',
    name: 'Dal Makhani',
    category: 'Vegetarian',
    calories: 320,
    protein: 12,
    carbs: 45,
    fats: 10,
    prepTime: 40,
    description: 'Creamy black lentils slow-cooked with spices.',
    ingredients: ['Black Gram', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes'],
    recipe: [
      'Soak lentils and beans overnight.',
      'Pressure cook until soft.',
      'Sauté onions, ginger, garlic, and tomato puree.',
      'Add the cooked lentils and simmer on low heat.',
      'Stir in butter and cream for richness.',
      'Garnish with coriander and serve with naan or rice.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_895dbea8-193c-4219-ab5b-e2cbe0b38c67.jpg'
  },
  {
    id: 'v3',
    name: 'Quinoa Salad',
    category: 'Vegetarian',
    calories: 180,
    protein: 6,
    carbs: 30,
    fats: 4,
    prepTime: 10,
    description: 'Refreshing salad with quinoa, cucumbers, and tomatoes.',
    ingredients: ['Quinoa', 'Cucumber', 'Tomato', 'Lemon', 'Olive Oil'],
    recipe: [
      'Rinse and cook quinoa according to package instructions.',
      'Chop cucumber, tomatoes, and any other desired veggies.',
      'Whisk lemon juice, olive oil, salt, and pepper.',
      'Toss the cooked quinoa with vegetables and dressing.',
      'Chill before serving for better flavor.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_da1a595a-4623-4d8c-b46d-481d9849b7de.jpg'
  },
  {
    id: 'v4',
    name: 'Palak Paneer',
    category: 'Vegetarian',
    calories: 280,
    protein: 14,
    carbs: 10,
    fats: 20,
    prepTime: 30,
    description: 'Cottage cheese cubes in a thick spinach gravy.',
    ingredients: ['Spinach', 'Paneer', 'Garlic', 'Cream', 'Spices'],
    recipe: [
      'Blanch spinach leaves and blend into a smooth paste.',
      'Sauté cumin, garlic, and onions in a pan.',
      'Add spices and the spinach puree.',
      'Simmer for a few minutes.',
      'Add paneer cubes and cream.',
      'Cook for another 2-3 minutes and serve.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_33561ae5-6aaf-4b00-bde4-0e68c92a4d3f.jpg'
  },
  {
    id: 'v5',
    name: 'Aloo Gobi',
    category: 'Vegetarian',
    calories: 150,
    protein: 3,
    carbs: 25,
    fats: 5,
    prepTime: 20,
    description: 'Dry curry made with potatoes and cauliflower.',
    ingredients: ['Potato', 'Cauliflower', 'Turmeric', 'Cumin', 'Onion'],
    recipe: [
      'Heat oil and add cumin seeds.',
      'Add onions and sauté until translucent.',
      'Add potatoes and cauliflower florets.',
      'Sprinkle turmeric, chili powder, and salt.',
      'Cover and cook on low heat until vegetables are tender.',
      'Garnish with coriander leaves.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_910cec0d-e4ea-446a-b059-b63921463196.jpg'
  },
  // Non-Veg
  {
    id: 'nv1',
    name: 'Butter Chicken',
    category: 'Non-Veg',
    calories: 450,
    protein: 28,
    carbs: 12,
    fats: 32,
    prepTime: 45,
    description: 'Tender chicken in a creamy tomato-based sauce.',
    ingredients: ['Chicken', 'Butter', 'Tomato Puree', 'Cream', 'Ginger-Garlic Paste'],
    recipe: [
      'Marinate chicken with yogurt and spices.',
      'Grill or pan-fry the chicken until cooked.',
      'Prepare a sauce with butter, tomato puree, and spices.',
      'Add cream and fenugreek leaves to the sauce.',
      'Toss the cooked chicken in the sauce.',
      'Simmer briefly and serve hot.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_a6d9d504-1376-47b8-8537-765ca3a9da0e.jpg'
  },
  {
    id: 'nv2',
    name: 'Grilled Salmon',
    category: 'Non-Veg',
    calories: 350,
    protein: 34,
    carbs: 0,
    fats: 22,
    prepTime: 15,
    description: 'Perfectly grilled salmon fillet with lemon and herbs.',
    ingredients: ['Salmon', 'Lemon', 'Rosmary', 'Olive Oil', 'Black Pepper'],
    recipe: [
      'Season salmon fillet with salt, pepper, and herbs.',
      'Drizzle with olive oil and lemon juice.',
      'Preheat the grill or pan.',
      'Grill salmon skin-side down first.',
      'Cook until opaque and flakes easily with a fork.',
      'Serve with a side of steamed vegetables.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9f3e1f76-8d1c-49ad-807f-2880a283609b.jpg'
  },
  {
    id: 'nv3',
    name: 'Chicken Biryani',
    category: 'Non-Veg',
    calories: 520,
    protein: 24,
    carbs: 65,
    fats: 18,
    prepTime: 60,
    description: 'Aromatic basmati rice cooked with chicken and spices.',
    ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Mint', 'Yogurt'],
    recipe: [
      'Marinate chicken with yogurt and biryani spices.',
      'Par-boil basmati rice with whole spices.',
      'Layer the marinated chicken and rice in a pot.',
      'Add fried onions, mint, and saffron milk.',
      'Seal the pot and cook on low heat (dum) until done.',
      'Fluff the rice gently and serve.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_2e8bf389-909e-4c03-9069-b8b82b067cd0.jpg'
  },
  {
    id: 'nv4',
    name: 'Tandoori Chicken',
    category: 'Non-Veg',
    calories: 210,
    protein: 30,
    carbs: 2,
    fats: 9,
    prepTime: 35,
    description: 'Chicken marinated in yogurt and spices, roasted in tandoor.',
    ingredients: ['Chicken Drumsticks', 'Yogurt', 'Kashmiri Red Chili', 'Lemon'],
    recipe: [
      'Make gashes on chicken drumsticks.',
      'Marinate with yogurt, lemon juice, and tandoori masala.',
      'Refrigerate for at least 4 hours.',
      'Preheat oven or grill to high heat.',
      'Roast chicken until charred and cooked through.',
      'Serve with onion rings and lemon wedges.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_907f17ab-5094-4de7-9c9b-ff96d0f1af15.jpg'
  },
  // Snacks
  {
    id: 's1',
    name: 'Samosa',
    category: 'Snacks',
    calories: 120,
    protein: 2,
    carbs: 18,
    fats: 6,
    prepTime: 30,
    description: 'Crispy pastry filled with spiced potatoes.',
    ingredients: ['Flour', 'Potato', 'Peas', 'Spices', 'Oil'],
    recipe: [
      'Prepare a stiff dough with flour and water.',
      'Boil and mash potatoes; mix with peas and spices.',
      'Roll out small circles of dough.',
      'Cut in half, form a cone, and fill with potato mixture.',
      'Seal the edges with water.',
      'Deep fry until golden brown.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_745d91c6-78e1-48fe-9829-fd6aaad16340.jpg'
  },
  {
    id: 's2',
    name: 'Dhokla',
    category: 'Snacks',
    calories: 80,
    protein: 3,
    carbs: 12,
    fats: 2,
    prepTime: 20,
    description: 'Steamed savory cake made from fermented rice and chickpeas.',
    ingredients: ['Chickpea Flour', 'Rice', 'Curry Leaves', 'Mustard Seeds'],
    recipe: [
      'Mix chickpea flour with water, yogurt, and spices.',
      'Let the batter ferment (or use fruit salt for instant version).',
      'Pour batter into a greased thali.',
      'Steam for 15-20 minutes.',
      'Temper mustard seeds and curry leaves in oil.',
      'Pour tempering over the dhokla and cut into squares.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_19d05857-2e69-4b7c-b3a2-e545a66ab5e1.jpg'
  },
  {
    id: 's3',
    name: 'Hummus & Pita',
    category: 'Snacks',
    calories: 220,
    protein: 8,
    carbs: 35,
    fats: 6,
    prepTime: 10,
    description: 'Smooth chickpea dip served with whole wheat pita.',
    ingredients: ['Chickpeas', 'Tahini', 'Garlic', 'Lemon', 'Pita Bread'],
    recipe: [
      'Blend chickpeas, tahini, garlic, and lemon juice.',
      'Add ice water slowly while blending for smoothness.',
      'Drizzle with olive oil.',
      'Serve with warm pita bread.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0ecba43c-e53a-4228-99d5-cc6f7b2e61da.jpg'
  },
  // Desserts
  {
    id: 'd1',
    name: 'Gulab Jamun',
    category: 'Desserts',
    calories: 150,
    protein: 2,
    carbs: 25,
    fats: 6,
    prepTime: 40,
    description: 'Deep-fried milk dumplings soaked in sugar syrup.',
    ingredients: ['Milk Solids', 'Flour', 'Sugar', 'Cardamom', 'Rose Water'],
    recipe: [
      'Mix milk solids and flour to form a soft dough.',
      'Shape into small, smooth balls.',
      'Deep fry balls on low heat until golden brown.',
      'Prepare sugar syrup with cardamom and rose water.',
      'Soak fried balls in warm syrup for at least 2 hours.',
      'Serve warm or cold.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_570b5618-ca1f-4d3d-8771-679b0c3b7ce6.jpg'
  },
  {
    id: 'd2',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    calories: 380,
    protein: 5,
    carbs: 45,
    fats: 22,
    prepTime: 15,
    description: 'Warm chocolate cake with a molten center.',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
    recipe: [
      'Melt chocolate and butter together.',
      'Whisk eggs and sugar until pale.',
      'Fold in flour and the chocolate mixture.',
      'Pour into greased ramekins.',
      'Bake at high heat for 10-12 minutes (center should be soft).',
      'Invert onto a plate and serve immediately.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_39712290-ad72-43a3-a2b3-532f2c583af7.jpg'
  },
  {
    id: 'd3',
    name: 'Rasmalai',
    category: 'Desserts',
    calories: 210,
    protein: 8,
    carbs: 20,
    fats: 12,
    prepTime: 50,
    description: 'Soft cottage cheese patties in sweetened, saffron-infused milk.',
    ingredients: ['Milk', 'Sugar', 'Paneer', 'Saffron', 'Pistachios'],
    recipe: [
      'Knead chenna (soft paneer) until smooth.',
      'Shape into flattened discs.',
      'Boil discs in light sugar syrup until they double in size.',
      'Simmer milk with sugar and saffron until thickened (rabri).',
      'Squeeze syrup from discs and add to the rabri.',
      'Chill and garnish with nuts before serving.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3a83741a-f7f9-4b4c-a5e1-db1fdcf5a15e.jpg'
  },
  // Indian Regional
  {
    id: 'i1',
    name: 'Masala Dosa',
    category: 'Vegetarian',
    calories: 350,
    protein: 8,
    carbs: 60,
    fats: 12,
    prepTime: 20,
    description: 'Crispy rice crepe filled with spiced potato mash.',
    ingredients: ['Rice Batter', 'Potato', 'Onion', 'Curry Leaves', 'Ghee'],
    recipe: [
      'Spread dosa batter on a hot griddle to make a thin crepe.',
      'Drizzle ghee around the edges.',
      'Cook until the base becomes golden and crispy.',
      'Place spiced potato filling (masala) in the center.',
      'Fold the dosa over the filling.',
      'Serve hot with sambar and coconut chutney.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_6522504a-0f73-4d18-aef4-fcbf456ce7dd.jpg'
  },
  {
    id: 'i2',
    name: 'Chole Bhature',
    category: 'Vegetarian',
    calories: 600,
    protein: 15,
    carbs: 85,
    fats: 25,
    prepTime: 45,
    description: 'Spicy chickpea curry served with fried leavened bread.',
    ingredients: ['Chickpeas', 'Flour', 'Oil', 'Onion-Tomato Masala'],
    recipe: [
      'Soak chickpeas overnight and boil until soft.',
      'Cook spices, onions, and tomatoes to make a masala base.',
      'Add chickpeas to the masala and simmer.',
      'Make dough with flour, yogurt, and leavening agent.',
      'Roll out dough and deep fry until puffy (bhature).',
      'Serve bhature with hot chole and pickles.'
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e78f1eb6-b0b4-4bb7-a280-2a5fc3210c84.jpg'
  }
];

// Generate more to satisfy "12 per category" and "infinite scroll"
export const generateMoreFoods = (count: number): Food[] => {
  const categories: FoodCategory[] = ['Vegetarian', 'Non-Veg', 'Snacks', 'Desserts', 'Fruits', 'Veggies', 'Dairy', 'Grains'];
  const newFoods: Food[] = [];
  for (let i = 0; i < count; i++) {
    const base = MOCK_FOODS[i % MOCK_FOODS.length];
    const cat = categories[i % categories.length];
    newFoods.push({
      ...base,
      id: `gen-${i}`,
      name: `${base.name} ${i + 1}`,
      category: cat,
      calories: base.calories + (Math.random() * 50 - 25),
      prepTime: Math.random() > 0.5 ? 10 : 25,
      // Inherit recipe from base food since it's a variation
      recipe: base.recipe
    });
  }
  return newFoods;
};

export const ALL_FOODS = [...MOCK_FOODS, ...generateMoreFoods(100)];
