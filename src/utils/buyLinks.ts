/**
 * Buy Links Utility
 * 
 * Generates smart buy links for food delivery and grocery platforms
 * with location awareness and category-based platform selection
 */

import { Food } from '@/types/food';

export interface BuyPlatform {
  id: string;
  name: string;
  emoji: string;
  type: 'grocery' | 'restaurant';
  deliveryTime?: string;
  color: string;
  enabled: boolean;
}

export interface BuyLinks {
  zepto: string;
  blinkit: string;
  flipkart: string;
  swiggy: string;
  zomato: string;
  platforms: BuyPlatform[];
}

export interface UserLocation {
  city: string;
  state?: string;
  lat?: number;
  lng?: number;
}

/**
 * Default location (Patna, Bihar)
 */
export const DEFAULT_LOCATION: UserLocation = {
  city: 'Patna',
  state: 'Bihar',
  lat: 25.5941,
  lng: 85.1376
};

/**
 * Platform configurations
 */
const PLATFORMS = {
  zepto: {
    id: 'zepto',
    name: 'Zepto',
    emoji: '🛒',
    type: 'grocery' as const,
    deliveryTime: '10 min',
    color: 'from-purple-500 to-pink-500',
    baseUrl: 'https://www.zepto.com/search'
  },
  blinkit: {
    id: 'blinkit',
    name: 'Blinkit',
    emoji: '⚡',
    type: 'grocery' as const,
    deliveryTime: '10 min',
    color: 'from-yellow-500 to-orange-500',
    baseUrl: 'https://blinkit.com/search'
  },
  flipkart: {
    id: 'flipkart',
    name: 'Flipkart Minutes',
    emoji: '🏪',
    type: 'grocery' as const,
    deliveryTime: '15 min',
    color: 'from-blue-500 to-indigo-500',
    baseUrl: 'https://www.flipkart.com/search'
  },
  swiggy: {
    id: 'swiggy',
    name: 'Swiggy',
    emoji: '🍽️',
    type: 'restaurant' as const,
    deliveryTime: '30-40 min',
    color: 'from-orange-500 to-red-500',
    baseUrl: 'https://www.swiggy.com/search'
  },
  zomato: {
    id: 'zomato',
    name: 'Zomato',
    emoji: '🍕',
    type: 'restaurant' as const,
    deliveryTime: '35-45 min',
    color: 'from-red-500 to-pink-500',
    baseUrl: 'https://www.zomato.com/search'
  }
};

/**
 * Determine which platforms are available based on food category
 */
export function getAvailablePlatforms(food: Food): BuyPlatform[] {
  const category = food.category.toLowerCase();
  
  // Fruits and vegetables - grocery platforms only
  const isGroceryOnly = ['fruits', 'veggies', 'vegetables', 'grains', 'dairy', 'nuts'].includes(category);
  
  return Object.values(PLATFORMS).map(platform => ({
    ...platform,
    enabled: isGroceryOnly ? platform.type === 'grocery' : true
  }));
}

/**
 * Generate Zepto buy link
 */
function generateZeptoLink(foodName: string, location: UserLocation): string {
  const params = new URLSearchParams({
    q: foodName,
    utm_source: 'nutrifuel',
    utm_medium: 'app'
  });
  
  if (location.lat && location.lng) {
    params.append('lat', location.lat.toString());
    params.append('lng', location.lng.toString());
  }
  
  return `${PLATFORMS.zepto.baseUrl}?${params.toString()}`;
}

/**
 * Generate Blinkit buy link
 */
function generateBlinkitLink(foodName: string, location: UserLocation): string {
  const params = new URLSearchParams({
    q: foodName,
    utm_source: 'nutrifuel',
    utm_medium: 'app'
  });
  
  return `${PLATFORMS.blinkit.baseUrl}?${params.toString()}`;
}

/**
 * Generate Flipkart Minutes buy link
 */
function generateFlipkartLink(foodName: string, location: UserLocation): string {
  const params = new URLSearchParams({
    q: foodName,
    utm_source: 'nutrifuel',
    utm_medium: 'app'
  });
  
  return `${PLATFORMS.flipkart.baseUrl}?${params.toString()}`;
}

/**
 * Generate Swiggy buy link
 */
function generateSwiggyLink(foodName: string, location: UserLocation): string {
  const searchQuery = `${foodName} ${location.city}`;
  const params = new URLSearchParams({
    q: searchQuery,
    utm_source: 'nutrifuel',
    utm_medium: 'app'
  });
  
  return `${PLATFORMS.swiggy.baseUrl}?${params.toString()}`;
}

/**
 * Generate Zomato buy link
 */
function generateZomatoLink(foodName: string, location: UserLocation): string {
  const searchQuery = `${foodName} ${location.city}`;
  const params = new URLSearchParams({
    q: searchQuery,
    utm_source: 'nutrifuel',
    utm_medium: 'app'
  });
  
  return `${PLATFORMS.zomato.baseUrl}?${params.toString()}`;
}

/**
 * Generate all buy links for a food item
 */
export function generateBuyLinks(food: Food, location: UserLocation = DEFAULT_LOCATION): BuyLinks {
  const platforms = getAvailablePlatforms(food);
  
  return {
    zepto: generateZeptoLink(food.name, location),
    blinkit: generateBlinkitLink(food.name, location),
    flipkart: generateFlipkartLink(food.name, location),
    swiggy: generateSwiggyLink(food.name, location),
    zomato: generateZomatoLink(food.name, location),
    platforms
  };
}

/**
 * Get quantity suggestion based on food type
 */
export function getQuantitySuggestion(food: Food): string {
  const category = food.category.toLowerCase();
  const name = food.name.toLowerCase();
  
  // Specific suggestions based on food type
  if (name.includes('paneer')) {
    return 'Paneer 200g (₹120) + Spices';
  }
  if (name.includes('chicken')) {
    return '500g Chicken Breast (₹250)';
  }
  if (name.includes('dal') || name.includes('lentil')) {
    return '1kg Dal (₹150)';
  }
  if (name.includes('rice')) {
    return '5kg Rice (₹400)';
  }
  
  // Category-based suggestions
  switch (category) {
    case 'fruits':
      return `1kg ${food.name} (₹160)`;
    case 'veggies':
    case 'vegetables':
      return `500g ${food.name} (₹80)`;
    case 'dairy':
      return `1L ${food.name} (₹60)`;
    case 'grains':
      return `1kg ${food.name} (₹100)`;
    case 'protein':
      return `500g ${food.name} (₹250)`;
    case 'nuts':
      return `250g ${food.name} (₹200)`;
    default:
      return `${food.name} ingredients`;
  }
}

/**
 * Get estimated price range
 */
export function getEstimatedPrice(food: Food): { grocery: string; restaurant: string } {
  const category = food.category.toLowerCase();
  
  if (['fruits', 'veggies', 'vegetables'].includes(category)) {
    return {
      grocery: '₹80-160',
      restaurant: 'N/A'
    };
  }
  
  if (['protein', 'snacks'].includes(category)) {
    return {
      grocery: '₹150-300',
      restaurant: '₹200-400'
    };
  }
  
  return {
    grocery: '₹100-250',
    restaurant: '₹180-350'
  };
}

/**
 * Open buy link in new tab (with deep link support)
 */
export function openBuyLink(url: string, platformId: string): void {
  // Try to open in app first (deep link), then fallback to web
  const deepLinks: Record<string, string> = {
    zepto: 'zepto://',
    blinkit: 'blinkit://',
    swiggy: 'swiggy://',
    zomato: 'zomato://'
  };
  
  // Try deep link first
  const deepLink = deepLinks[platformId];
  if (deepLink) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);
    
    // Fallback to web after 1 second
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 1000);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Get user location from localStorage or browser geolocation
 */
export async function getUserLocation(): Promise<UserLocation> {
  // Try localStorage first
  const stored = localStorage.getItem('user_location');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored location:', e);
    }
  }
  
  // Try geolocation API
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000 // 5 minutes
        });
      });
      
      // Reverse geocode to get city name (simplified - in production use a geocoding API)
      return {
        city: 'Current Location',
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (e) {
      console.error('Geolocation failed:', e);
    }
  }
  
  // Fallback to default
  return DEFAULT_LOCATION;
}

/**
 * Save user location to localStorage
 */
export function saveUserLocation(location: UserLocation): void {
  localStorage.setItem('user_location', JSON.stringify(location));
}
