import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Food } from '@/types/food';
import { Info, Utensils, ChefHat, Zap, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateNutritionFacts, calculateDailyValue } from '@/utils/nutritionUtils';
import { BuyButtons } from './BuyButtons';

interface NutritionModalProps {
  food: Food | null;
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ food, open, isOpen, onClose }) => {
  if (!food) return null;

  const modalOpen = open ?? isOpen ?? false;
  
  // Generate complete nutrition facts (auto-generates if not present)
  const nutrition = generateNutritionFacts(food);
  
  // Calculate percentages for progress bars (based on 2000 calorie diet)
  const pPercentage = (nutrition.protein / 50) * 100; // 50g daily value
  const cPercentage = (nutrition.totalCarbohydrates / 275) * 100; // 275g daily value
  const fPercentage = (nutrition.totalFat / 78) * 100; // 78g daily value
  const fiberPercentage = (nutrition.dietaryFiber / 28) * 100; // 28g daily value

  return (
    <Dialog open={modalOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden glass border-2 border-white/40 rounded-3xl">
        {/* Close Button - Prominent X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-lg border-2 border-white/20"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Scrollable Content */}
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          {/* Header with Image - Reduced Height */}
          <div className="relative h-48 overflow-hidden rounded-t-3xl">
            <img 
              src={food.image} 
              alt={food.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <DialogTitle className="text-3xl font-black text-white mb-2 drop-shadow-2xl">
                {food.name}
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-primary/90 hover:bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-bold border-none">
                  {food.category}
                </Badge>
                <div className="flex items-center gap-2 text-white/90 font-bold text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{food.prepTime} min</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30 text-center mt-3 inline-block">
                <div className="text-xs font-bold text-white/80 uppercase tracking-widest">Total Energy</div>
                <div className="text-2xl font-black text-white">{nutrition.calories} kcal</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/60 backdrop-blur-xl">
            {/* Buy Platforms Section - Prominent at Top */}
            <div className="mb-6 glass p-5 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🛒</span>
                <h3 className="text-xl font-black uppercase tracking-wider">Buy This Food Now</h3>
              </div>
              <BuyButtons food={food} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Food Info */}
              <div className="space-y-5">
                <section className="glass p-4 rounded-2xl space-y-3 border-white/40 shadow-inner">
                  <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <Info className="w-5 h-5" />
                    About
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-sm font-semibold italic">
                    "{food.description}"
                  </p>
                </section>

                <section className="glass p-4 rounded-2xl space-y-3 border-white/40 shadow-inner">
                  <div className="flex items-center gap-2 font-bold text-lg text-secondary">
                    <Utensils className="w-5 h-5" />
                    Ingredients
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {food.ingredients.map((ing, i) => (
                      <Badge key={i} variant="secondary" className="bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-bold border-none transition-colors">
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </section>

                <section className="glass p-4 rounded-2xl space-y-4 border-white/40 shadow-inner">
                  <div className="flex items-center gap-2 font-bold text-lg text-orange-500">
                    <ChefHat className="w-5 h-5" />
                    How to Cook
                  </div>
                  <ul className="space-y-3">
                    {food.recipe.map((step, i) => (
                      <li key={i} className="flex gap-3 text-xs font-bold leading-relaxed text-foreground/80 group">
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Right Column - Complete Nutrition Facts Label */}
              <div className="space-y-4">
                <div className="glass p-4 rounded-2xl border-2 border-black/20 bg-white/95 text-black">
                  {/* FDA-Style Nutrition Facts Label */}
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-black">Nutrition Facts</h3>
                    <Separator className="h-1.5 bg-black" />
                    
                    {/* Serving Size */}
                    <div className="py-1.5">
                      <div className="text-xs font-bold">Serving size</div>
                      <div className="text-base font-black">{nutrition.servingSize}</div>
                      {nutrition.servingsPerContainer && (
                        <div className="text-xs">Servings per container: {nutrition.servingsPerContainer}</div>
                      )}
                    </div>
                    
                    <Separator className="h-1 bg-black" />
                    
                    {/* Calories */}
                    <div className="py-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-black">Calories</span>
                        <span className="text-2xl font-black">{nutrition.calories}</span>
                      </div>
                    </div>
                    
                    <Separator className="h-1 bg-black" />
                    
                    {/* Daily Value Header */}
                    <div className="text-right text-xs font-bold py-0.5">% Daily Value*</div>
                    
                    <Separator className="h-[1px] bg-black/30" />
                    
                    {/* Macronutrients */}
                    <div className="space-y-0.5 text-xs">
                      {/* Total Fat */}
                      <div className="flex justify-between py-0.5 border-b border-black/20">
                        <span className="font-bold">
                          Total Fat <span className="font-normal">{nutrition.totalFat}g</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.totalFat, 78)}%</span>
                      </div>
                      
                      {/* Saturated Fat */}
                      <div className="flex justify-between py-0.5 pl-3 border-b border-black/20">
                        <span>
                          Saturated Fat <span className="font-normal">{nutrition.saturatedFat.toFixed(1)}g</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.saturatedFat, 20)}%</span>
                      </div>
                      
                      {/* Trans Fat */}
                      <div className="flex justify-between py-0.5 pl-3 border-b border-black/20">
                        <span>
                          <span className="italic">Trans</span> Fat <span className="font-normal">{nutrition.transFat.toFixed(1)}g</span>
                        </span>
                      </div>
                      
                      {/* Cholesterol */}
                      <div className="flex justify-between py-0.5 border-b border-black/20">
                        <span className="font-bold">
                          Cholesterol <span className="font-normal">{nutrition.cholesterol}mg</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.cholesterol, 300)}%</span>
                      </div>
                      
                      {/* Sodium */}
                      <div className="flex justify-between py-0.5 border-b border-black/20">
                        <span className="font-bold">
                          Sodium <span className="font-normal">{nutrition.sodium}mg</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.sodium, 2300)}%</span>
                      </div>
                      
                      {/* Total Carbohydrates */}
                      <div className="flex justify-between py-0.5 border-b border-black/20">
                        <span className="font-bold">
                          Total Carbohydrate <span className="font-normal">{nutrition.totalCarbohydrates}g</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.totalCarbohydrates, 275)}%</span>
                      </div>
                      
                      {/* Dietary Fiber */}
                      <div className="flex justify-between py-0.5 pl-3 border-b border-black/20">
                        <span>
                          Dietary Fiber <span className="font-normal">{nutrition.dietaryFiber.toFixed(1)}g</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.dietaryFiber, 28)}%</span>
                      </div>
                      
                      {/* Total Sugars */}
                      <div className="flex justify-between py-0.5 pl-3 border-b border-black/20">
                        <span>
                          Total Sugars <span className="font-normal">{nutrition.totalSugars.toFixed(1)}g</span>
                        </span>
                      </div>
                      
                      {/* Added Sugars */}
                      {nutrition.addedSugars > 0 && (
                        <div className="flex justify-between py-0.5 pl-6 border-b border-black/20">
                          <span className="text-xs">
                            Includes {nutrition.addedSugars.toFixed(1)}g Added Sugars
                          </span>
                          <span className="font-bold">{calculateDailyValue(nutrition.addedSugars, 50)}%</span>
                        </div>
                      )}
                      
                      {/* Protein */}
                      <div className="flex justify-between py-0.5 border-b border-black/20">
                        <span className="font-bold">
                          Protein <span className="font-normal">{nutrition.protein}g</span>
                        </span>
                        <span className="font-bold">{calculateDailyValue(nutrition.protein, 50)}%</span>
                      </div>
                    </div>
                    
                    <Separator className="h-1.5 bg-black" />
                    
                    {/* Micronutrients */}
                    <div className="space-y-1 py-1.5 text-xs">
                      <div className="flex justify-between">
                        <span>Vitamin D {nutrition.vitaminD.toFixed(1)}mcg</span>
                        <span className="font-bold">{calculateDailyValue(nutrition.vitaminD, 20)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calcium {nutrition.calcium}mg</span>
                        <span className="font-bold">{calculateDailyValue(nutrition.calcium, 1300)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iron {nutrition.iron.toFixed(1)}mg</span>
                        <span className="font-bold">{calculateDailyValue(nutrition.iron, 18)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potassium {nutrition.potassium}mg</span>
                        <span className="font-bold">{calculateDailyValue(nutrition.potassium, 4700)}%</span>
                      </div>
                      
                      {/* Optional Micronutrients */}
                      {nutrition.vitaminA && nutrition.vitaminA > 0 && (
                        <div className="flex justify-between">
                          <span>Vitamin A {nutrition.vitaminA.toFixed(1)}mcg</span>
                          <span className="font-bold">{calculateDailyValue(nutrition.vitaminA, 900)}%</span>
                        </div>
                      )}
                      {nutrition.vitaminC && nutrition.vitaminC > 0 && (
                        <div className="flex justify-between">
                          <span>Vitamin C {nutrition.vitaminC.toFixed(1)}mg</span>
                          <span className="font-bold">{calculateDailyValue(nutrition.vitaminC, 90)}%</span>
                        </div>
                      )}
                      {nutrition.vitaminE && nutrition.vitaminE > 0 && (
                        <div className="flex justify-between">
                          <span>Vitamin E {nutrition.vitaminE.toFixed(1)}mg</span>
                          <span className="font-bold">{calculateDailyValue(nutrition.vitaminE, 15)}%</span>
                        </div>
                      )}
                      {nutrition.magnesium && nutrition.magnesium > 0 && (
                        <div className="flex justify-between">
                          <span>Magnesium {nutrition.magnesium}mg</span>
                          <span className="font-bold">{calculateDailyValue(nutrition.magnesium, 420)}%</span>
                        </div>
                      )}
                      {nutrition.zinc && nutrition.zinc > 0 && (
                        <div className="flex justify-between">
                          <span>Zinc {nutrition.zinc.toFixed(1)}mg</span>
                          <span className="font-bold">{calculateDailyValue(nutrition.zinc, 11)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="h-1 bg-black" />
                    
                    {/* Footer Note */}
                    <div className="text-[10px] pt-1.5 leading-tight">
                      <p>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
                    </div>
                  </div>
                </div>
                
                {/* Visual Progress Bars */}
                <div className="glass p-4 rounded-2xl space-y-3 border-white/40">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Macronutrient Breakdown
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-primary">Protein</span>
                        <span>{nutrition.protein}g ({pPercentage.toFixed(0)}% DV)</span>
                      </div>
                      <Progress value={Math.min(pPercentage, 100)} className="h-1.5 bg-primary/20" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-blue-500">Carbohydrates</span>
                        <span>{nutrition.totalCarbohydrates}g ({cPercentage.toFixed(0)}% DV)</span>
                      </div>
                      <Progress value={Math.min(cPercentage, 100)} className="h-1.5 bg-blue-500/20" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-orange-500">Fats</span>
                        <span>{nutrition.totalFat}g ({fPercentage.toFixed(0)}% DV)</span>
                      </div>
                      <Progress value={Math.min(fPercentage, 100)} className="h-1.5 bg-orange-500/20" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-green-500">Fiber</span>
                        <span>{nutrition.dietaryFiber.toFixed(1)}g ({fiberPercentage.toFixed(0)}% DV)</span>
                      </div>
                      <Progress value={Math.min(fiberPercentage, 100)} className="h-1.5 bg-green-500/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
