/**
 * Buy Buttons Component
 * 
 * Displays instant buy buttons for food delivery and grocery platforms
 * with glassmorphism design and location awareness
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Food } from '@/types/food';
import { 
  generateBuyLinks, 
  getQuantitySuggestion, 
  getEstimatedPrice,
  openBuyLink,
  getUserLocation,
  UserLocation,
  BuyPlatform 
} from '@/utils/buyLinks';
import { MapPin, ShoppingCart, Store, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BuyButtonsProps {
  food: Food;
  compact?: boolean;
}

export const BuyButtons: React.FC<BuyButtonsProps> = ({ food, compact = false }) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserLocation().then(loc => {
      setLocation(loc);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !location) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-8 bg-muted rounded-2xl" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-muted rounded-2xl" />
          <div className="h-16 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  const buyLinks = generateBuyLinks(food, location);
  const quantitySuggestion = getQuantitySuggestion(food);
  const prices = getEstimatedPrice(food);
  
  const groceryPlatforms = buyLinks.platforms.filter(p => p.type === 'grocery' && p.enabled);
  const restaurantPlatforms = buyLinks.platforms.filter(p => p.type === 'restaurant' && p.enabled);

  const handleBuyClick = (platform: BuyPlatform, url: string) => {
    toast.success(`Opening ${platform.name}...`, {
      description: `Searching for ${food.name} in ${location.city}`,
      duration: 2000
    });
    openBuyLink(url, platform.id);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {buyLinks.platforms.filter(p => p.enabled).map((platform) => (
          <Button
            key={platform.id}
            onClick={() => handleBuyClick(platform, buyLinks[platform.id as keyof typeof buyLinks] as string)}
            variant="outline"
            className="glass border-none hover:scale-105 transition-all duration-300 rounded-2xl h-auto py-3"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{platform.emoji}</span>
              <span className="text-xs font-bold">{platform.name}</span>
            </div>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Location Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="glass border-none px-3 py-1.5">
          <MapPin className="w-3 h-3 mr-1.5" />
          <span className="text-xs font-bold">{location.city}</span>
        </Badge>
        <Badge variant="outline" className="glass border-none px-3 py-1.5">
          <span className="text-xs font-bold">{quantitySuggestion}</span>
        </Badge>
      </div>

      <Separator className="opacity-20" />

      {/* Grocery Platforms */}
      {groceryPlatforms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-black uppercase tracking-wider">Buy Ingredients</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {groceryPlatforms.map((platform) => (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleBuyClick(platform, buyLinks[platform.id as keyof typeof buyLinks] as string)}
                  className={`w-full h-auto py-4 rounded-2xl glass border-none bg-gradient-to-br ${platform.color} text-white hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <span className="text-3xl">{platform.emoji}</span>
                    <div className="text-center">
                      <div className="font-black text-sm">{platform.name}</div>
                      <div className="flex items-center justify-center gap-1 text-xs opacity-90 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{platform.deliveryTime}</span>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-none text-xs px-2 py-0.5">
                      {prices.grocery}
                    </Badge>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant Platforms */}
      {restaurantPlatforms.length > 0 && (
        <>
          <Separator className="opacity-20" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-black uppercase tracking-wider">Order Ready-Made</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {restaurantPlatforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleBuyClick(platform, buyLinks[platform.id as keyof typeof buyLinks] as string)}
                    className={`w-full h-auto py-4 rounded-2xl glass border-none bg-gradient-to-br ${platform.color} text-white hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      <span className="text-3xl">{platform.emoji}</span>
                      <div className="text-center">
                        <div className="font-black text-sm">{platform.name}</div>
                        <div className="flex items-center justify-center gap-1 text-xs opacity-90 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{platform.deliveryTime}</span>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white border-none text-xs px-2 py-0.5">
                        {prices.restaurant}
                      </Badge>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Info */}
      <div className="glass p-3 rounded-2xl">
        <p className="text-xs text-muted-foreground text-center">
          🚀 <span className="font-bold">One-tap ordering</span> • Opens app if installed • Prices may vary
        </p>
      </div>
    </motion.div>
  );
};
