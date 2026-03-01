import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ALL_FOODS } from '@/data/mockFood';
import { Food, Meal, DailyPlan } from '@/types/food';
import { Zap, Save, RefreshCw, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'nutrifuel_daily_plan';

export const DailyPlanner: React.FC = () => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTargetCalories(parsed.targetCalories || 2000);
        setConsumedCalories(parsed.consumedCalories || 0);
        setMeals(parsed.meals || []);
      } catch (e) {
        console.error('Failed to parse saved plan', e);
      }
    }
  }, []);

  const generateMeals = async () => {
    setLoading(true);
    
    try {
      // Attempt to call the KGAT API
      const response = await fetch(`https://api.example.com/recommend?key=KGAT_13345494d9391f7a3681ae0e973350c6&target=${targetCalories}`);
      if (!response.ok) throw new Error('API Unavailable');
      const data = await response.json();
      // Handle data...
    } catch (error) {
      console.warn('KGAT API unavailable, falling back to mock data');
      // Simulated delay for fallback
      await new Promise(r => setTimeout(r, 800));
    }
    
    const mealNames = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
    const newMeals: Meal[] = [];
    let remainingCals = targetCalories;

    for (let i = 0; i < 4; i++) {
      const mealTarget = i === 2 ? targetCalories * 0.1 : targetCalories * 0.3;
      const mealFoods: Food[] = [];
      let mealCals = 0;

      // Pick 2-3 foods for each meal
      const pool = ALL_FOODS.sort(() => Math.random() - 0.5);
      for (const food of pool) {
        if (mealCals + food.calories <= mealTarget + 50) {
          mealFoods.push(food);
          mealCals += food.calories;
          if (mealFoods.length >= 2) break;
        }
      }

      newMeals.push({
        id: `meal-${i}-${Date.now()}`,
        name: mealNames[i],
        foods: mealFoods,
        totalCalories: mealCals
      });
    }

    setMeals(newMeals);
    setConsumedCalories(0);
    setLoading(false);
    toast.success('New meal plan generated!');
  };

  const savePlan = () => {
    const plan: DailyPlan = {
      date: new Date().toISOString().split('T')[0],
      targetCalories,
      consumedCalories,
      meals
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    toast.success('Meal plan saved to local storage!');
  };

  const addConsumed = (cals: number) => {
    setConsumedCalories(prev => Math.min(prev + cals, targetCalories * 1.5));
    toast.info(`Added ${cals} kcal to your daily intake.`);
  };

  const progress = (consumedCalories / targetCalories) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter">Daily Planner</h1>
          <p className="text-muted-foreground font-medium">Customize your calorie goals and let AI plan your day.</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] w-full md:w-[320px] text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
             <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * Math.min(progress, 100)) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{Math.round(progress)}%</span>
              </div>
          </div>
          <div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Target Remaining</div>
            <div className="text-2xl font-black text-primary">{Math.max(0, targetCalories - consumedCalories)} kcal</div>
          </div>
        </div>
      </div>

      <div className="glass p-10 rounded-[3rem] space-y-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <label className="text-xl font-bold flex items-center gap-2">
               <Zap className="w-6 h-6 text-yellow-500" />
               Daily Calorie Target
             </label>
             <span className="text-3xl font-black text-primary bg-primary/10 px-6 py-2 rounded-2xl">{targetCalories} kcal</span>
          </div>
          <Slider
            min={1200}
            max={3500}
            step={50}
            value={[targetCalories]}
            onValueChange={(val) => setTargetCalories(val[0])}
            className="[&>span]:bg-primary h-4"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={generateMeals} 
            disabled={loading}
            size="lg"
            className="rounded-2xl px-8 h-14 text-lg font-bold nav-gradient-btn text-white flex-1 md:flex-none"
          >
            {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
            Generate Meals
          </Button>
          <Button 
            onClick={savePlan} 
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 h-14 text-lg font-bold glass border-primary/20 hover:bg-primary/5 flex-1 md:flex-none"
          >
            <Save className="w-5 h-5 mr-2 text-primary" />
            Save Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {meals.map((meal, idx) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass border-none rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none p-6 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-black tracking-tight">{meal.name}</CardTitle>
                    <Badge className="bg-white/40 backdrop-blur-md text-primary font-bold border-none px-4 py-1.5 rounded-full text-md">
                      {meal.totalCalories} kcal
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <ul className="space-y-3">
                    {meal.foods.map((food, fidx) => (
                      <li key={fidx} className="flex justify-between items-center text-md font-medium group/item cursor-default">
                        <span className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {food.name}
                        </span>
                        <span className="text-muted-foreground group-hover/item:text-primary transition-colors">{food.calories} kcal</span>
                      </li>
                    ))}
                  </ul>

                  <Separator className="bg-white/20" />

                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 rounded-xl h-12 font-bold text-md nav-gradient-btn text-white"
                      onClick={() => addConsumed(meal.totalCalories)}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Eat Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {meals.length === 0 && !loading && (
        <div className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-primary/20">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Meal Plan Found</h3>
          <p className="text-muted-foreground text-lg mb-8">Set your daily goal and click Generate to start your nutrition journey.</p>
          <Button 
            onClick={generateMeals}
            className="rounded-2xl h-14 px-10 text-lg font-bold nav-gradient-btn text-white"
          >
            Create My First Plan
          </Button>
        </div>
      )}
    </div>
  );
};
