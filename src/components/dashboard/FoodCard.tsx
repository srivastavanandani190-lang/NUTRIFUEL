import React, { useState } from 'react';
import { Food } from '@/types/food';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, ChevronRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFoodImageUrl, getFallbackGradient, getCachedImageUrl, cacheImageUrl } from '@/utils/foodImages';

interface FoodCardProps {
  food: Food;
  onClick: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get image URL with caching
  const getImageUrl = () => {
    // First check if food already has a valid image URL
    if (food.image && !food.image.includes('placeholder')) {
      return food.image;
    }
    
    // Otherwise use our image utility system
    const cached = getCachedImageUrl(food.name);
    if (cached) return cached;
    
    const url = getFoodImageUrl(food.name, food.category);
    cacheImageUrl(food.name, url);
    return url;
  };

  const imageUrl = getImageUrl();
  const fallbackGradient = getFallbackGradient(food.name);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <Card 
      className="glass overflow-hidden border-none group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] rounded-3xl"
      onClick={onClick}
    >
      <div className="relative h-40 md:h-48 lg:h-56 overflow-hidden">
        {/* Blur Placeholder */}
        {!imageLoaded && (
          <div 
            className="absolute inset-0 animate-pulse"
            style={{ background: fallbackGradient }}
          />
        )}
        
        {/* Real Image or Fallback */}
        {!imageError ? (
          <motion.img 
            src={imageUrl}
            alt={food.name}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white"
            style={{ background: fallbackGradient }}
          >
            <div className="text-center space-y-2">
              <div className="text-6xl">🍽️</div>
              <div className="text-lg font-bold px-4">{food.name}</div>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/80 backdrop-blur-md text-white border-none rounded-full px-3 py-1">
            {food.category}
          </Badge>
          <Badge className="bg-white/40 backdrop-blur-md text-primary font-bold border-none rounded-full px-3 py-1">
            {food.calories} kcal
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {food.name}
          </h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{food.protein}g Protein</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Utensils className="w-4 h-4 text-blue-500" />
            <span>{food.carbs}g Carbs</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{food.prepTime} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
