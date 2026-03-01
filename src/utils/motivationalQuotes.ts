/**
 * Motivational Quotes for Health & Fitness
 * Randomly displayed to inspire users on their wellness journey
 */

export interface MotivationalQuote {
  text: string;
  author: string;
  category: 'fitness' | 'nutrition' | 'mindset' | 'wellness';
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  // Fitness Quotes
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
    category: 'fitness',
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
    category: 'wellness',
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian",
    category: 'fitness',
  },
  
  // Nutrition Quotes
  {
    text: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates",
    category: 'nutrition',
  },
  {
    text: "You are what you eat, so don't be fast, cheap, easy, or fake.",
    author: "Unknown",
    category: 'nutrition',
  },
  {
    text: "Eat well, live well, be well.",
    author: "Unknown",
    category: 'nutrition',
  },
  {
    text: "Your diet is a bank account. Good food choices are good investments.",
    author: "Bethenny Frankel",
    category: 'nutrition',
  },
  {
    text: "Don't dig your grave with your own knife and fork.",
    author: "English Proverb",
    category: 'nutrition',
  },
  
  // Mindset Quotes
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: 'mindset',
  },
  {
    text: "The difference between try and triumph is a little umph.",
    author: "Unknown",
    category: 'mindset',
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: 'mindset',
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: 'mindset',
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: 'mindset',
  },
  
  // Wellness Quotes
  {
    text: "Health is not valued until sickness comes.",
    author: "Thomas Fuller",
    category: 'wellness',
  },
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich",
    category: 'wellness',
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil",
    category: 'wellness',
  },
  {
    text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.",
    author: "Buddha",
    category: 'wellness',
  },
  {
    text: "Health is a state of complete harmony of the body, mind and spirit.",
    author: "B.K.S. Iyengar",
    category: 'wellness',
  },
  
  // More Fitness Quotes
  {
    text: "Sweat is fat crying.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "Push yourself because no one else is going to do it for you.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown",
    category: 'wellness',
  },
  {
    text: "Strive for progress, not perfection.",
    author: "Unknown",
    category: 'mindset',
  },
  
  // Additional Motivational Quotes
  {
    text: "The body achieves what the mind believes.",
    author: "Unknown",
    category: 'mindset',
  },
  {
    text: "Don't wish for it, work for it.",
    author: "Unknown",
    category: 'mindset',
  },
  {
    text: "Every workout counts. Every meal matters. Every day is a new opportunity.",
    author: "Unknown",
    category: 'wellness',
  },
  {
    text: "You don't have to be extreme, just consistent.",
    author: "Unknown",
    category: 'fitness',
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: 'mindset',
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: 'mindset',
  },
  {
    text: "Your future self will thank you for the healthy choices you make today.",
    author: "Unknown",
    category: 'wellness',
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: 'mindset',
  },
  {
    text: "The only person you should try to be better than is the person you were yesterday.",
    author: "Unknown",
    category: 'mindset',
  },
  {
    text: "Eat clean, stay fit, and have a burger to stay sane.",
    author: "Gigi Hadid",
    category: 'nutrition',
  },
];

/**
 * Get a random motivational quote
 */
export const getRandomQuote = (): MotivationalQuote => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};

/**
 * Get a random quote by category
 */
export const getQuoteByCategory = (category: MotivationalQuote['category']): MotivationalQuote => {
  const categoryQuotes = MOTIVATIONAL_QUOTES.filter(q => q.category === category);
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
};

/**
 * Get multiple random quotes
 */
export const getRandomQuotes = (count: number): MotivationalQuote[] => {
  const shuffled = [...MOTIVATIONAL_QUOTES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
