import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  WEEKLY_MEAL_PLAN,
  PREP_NOTES,
  GROCERY_LIST,
  calculateWeeklyTotal,
  calculateGroceryTotal,
  type DayMeals,
} from '@/data/weeklyMeals';

export const WeeklyPlanner: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [weeklyPlan] = useState<DayMeals[]>(WEEKLY_MEAL_PLAN);
  const [groceryList, setGroceryList] = useState(GROCERY_LIST);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [showPrepNotes, setShowPrepNotes] = useState(false);

  const currentDayMeals = weeklyPlan.find((d) => d.day === selectedDay) || weeklyPlan[0];
  const weeklyTotals = calculateWeeklyTotal();
  const groceryTotal = calculateGroceryTotal();

  const toggleGroceryItem = (categoryIndex: number, itemIndex: number) => {
    const newList = [...groceryList];
    newList[categoryIndex].items[itemIndex].checked = !newList[categoryIndex].items[itemIndex].checked;
    setGroceryList(newList);
  };

  const copyGroceryList = () => {
    const text = groceryList
      .map(
        (cat) =>
          `${cat.emoji} ${cat.category.toUpperCase()}\n${cat.items.map((item) => `- ${item.name}: ${item.quantity}${item.unit}`).join('\n')}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Grocery list copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      {/* Weekly Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-none rounded-3xl p-6 dark:glow-primary">
          <CardContent className="p-0 text-center space-y-2">
            <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">Avg Daily</div>
            <div className="text-3xl font-black text-primary dark:text-cyan-400 dark:glow-text">{weeklyTotals.avgCalories}</div>
            <div className="text-xs font-bold text-muted-foreground">kcal/day</div>
          </CardContent>
        </Card>
        <Card className="glass border-none rounded-3xl p-6 dark:glow-primary">
          <CardContent className="p-0 text-center space-y-2">
            <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">Protein</div>
            <div className="text-3xl font-black text-orange-500 dark:text-orange-400">{weeklyTotals.avgProtein}g</div>
            <div className="text-xs font-bold text-muted-foreground">per day</div>
          </CardContent>
        </Card>
        <Card className="glass border-none rounded-3xl p-6 dark:glow-primary">
          <CardContent className="p-0 text-center space-y-2">
            <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">Grocery</div>
            <div className="text-3xl font-black text-secondary dark:text-cyan-400 dark:glow-text">₹{groceryTotal}</div>
            <div className="text-xs font-bold text-muted-foreground">weekly</div>
          </CardContent>
        </Card>
        <Card className="glass border-none rounded-3xl p-6 dark:glow-primary">
          <CardContent className="p-0 text-center space-y-2">
            <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">Fiber</div>
            <div className="text-3xl font-black text-green-500 dark:text-emerald-400">{weeklyTotals.avgFiber}g</div>
            <div className="text-xs font-bold text-muted-foreground">per day</div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black">Weekly Plan</h3>
          <div className="flex gap-2">
            <Button onClick={() => setShowGroceryList(!showGroceryList)} variant="outline" className="glass border-none rounded-2xl dark:hover:bg-primary/20 transition-all duration-300">
              🛒 Grocery List
            </Button>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4">
            {weeklyPlan.map((day) => (
              <Button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                variant={selectedDay === day.day ? 'default' : 'outline'}
                className={`rounded-2xl whitespace-nowrap min-w-[120px] transition-all duration-300 ${
                  selectedDay === day.day 
                    ? 'nav-gradient-btn text-white dark:active-tab-glow' 
                    : 'glass border-none hover:bg-white/10 dark:hover:bg-primary/20'
                }`}
              >
                <span className="mr-2">{day.themeEmoji}</span>
                <div className="text-left">
                  <div className="font-black">{day.day}</div>
                  <div className="text-xs opacity-80">{day.totalCalories} kcal</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Theme Banner */}
      <div className={`glass p-6 rounded-3xl bg-gradient-to-r ${currentDayMeals.themeColor} bg-opacity-10 dark:glow-accent`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentDayMeals.themeEmoji}</div>
            <div>
              <h2 className="text-3xl font-black">{currentDayMeals.theme}</h2>
              <p className="text-muted-foreground font-medium">Balanced nutrition for your goals</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-primary dark:text-cyan-400 dark:glow-text">{currentDayMeals.totalCalories}</div>
            <div className="text-sm font-bold text-muted-foreground">kcal total</div>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakfast */}
        <Card className="glass border-none rounded-3xl overflow-hidden dark:glow-primary">
          <CardHeader className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 dark:from-orange-500/30 dark:to-yellow-500/30 p-6">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              🧇 Breakfast
              <Badge className="bg-orange-500/20 dark:bg-orange-500/30 text-orange-600 dark:text-orange-400 border-none ml-auto">{currentDayMeals.breakfast[0].calories} kcal</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentDayMeals.breakfast.map((meal, idx) => (
              <div key={meal.id} className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-lg">{meal.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold mt-1">⏱️ {meal.prepTime} min prep</p>
                  </div>
                  <Badge variant="outline" className="border-none bg-primary/10 text-primary">
                    Option {idx + 1}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div>
                    <div className="text-orange-500">{meal.protein}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-blue-500">{meal.carbs}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-yellow-500">{meal.fat}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                  <div>
                    <div className="text-green-500">{meal.fiber}g</div>
                    <div className="text-muted-foreground">Fiber</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold">Ingredients:</span> {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lunch */}
        <Card className="glass border-none rounded-3xl overflow-hidden dark:glow-primary">
          <CardHeader className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 p-6">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              🍲 Lunch
              <Badge className="bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 border-none ml-auto">{currentDayMeals.lunch[0].calories} kcal</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentDayMeals.lunch.map((meal, idx) => (
              <div key={meal.id} className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-lg">{meal.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold mt-1">⏱️ {meal.prepTime} min prep</p>
                  </div>
                  <Badge variant="outline" className="border-none bg-primary/10 text-primary">
                    Option {idx + 1}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div>
                    <div className="text-orange-500">{meal.protein}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-blue-500">{meal.carbs}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-yellow-500">{meal.fat}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                  <div>
                    <div className="text-green-500">{meal.fiber}g</div>
                    <div className="text-muted-foreground">Fiber</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold">Ingredients:</span> {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dinner */}
        <Card className="glass border-none rounded-3xl overflow-hidden dark:glow-primary">
          <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 p-6">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              🍗 Dinner
              <Badge className="bg-purple-500/20 dark:bg-purple-500/30 text-purple-600 dark:text-purple-400 border-none ml-auto">{currentDayMeals.dinner[0].calories} kcal</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentDayMeals.dinner.map((meal) => (
              <div key={meal.id} className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-lg">{meal.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold mt-1">
                      ⏱️ {meal.prepTime} min prep
                      {meal.isLeftover && <span className="ml-2 text-primary">♻️ Uses Leftovers</span>}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div>
                    <div className="text-orange-500">{meal.protein}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-blue-500">{meal.carbs}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-yellow-500">{meal.fat}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                  <div>
                    <div className="text-green-500">{meal.fiber}g</div>
                    <div className="text-muted-foreground">Fiber</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold">Ingredients:</span> {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Snacks */}
        <Card className="glass border-none rounded-3xl overflow-hidden dark:glow-primary">
          <CardHeader className="bg-gradient-to-r from-green-500/20 to-teal-500/20 dark:from-green-500/30 dark:to-teal-500/30 p-6">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              🥜 Snacks
              <Badge className="bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400 border-none ml-auto">
                {currentDayMeals.snacks.reduce((sum, s) => sum + s.calories, 0)} kcal
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {currentDayMeals.snacks.map((meal, idx) => (
              <div key={meal.id} className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-lg">{meal.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold mt-1">{idx === 0 ? '🌤️ PM Snack' : '🌙 Evening Snack'}</p>
                  </div>
                  <Badge variant="outline" className="border-none bg-primary/10 text-primary">
                    {meal.calories} kcal
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  <div>
                    <div className="text-orange-500">{meal.protein}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-blue-500">{meal.carbs}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-yellow-500">{meal.fat}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                  <div>
                    <div className="text-green-500">{meal.fiber}g</div>
                    <div className="text-muted-foreground">Fiber</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold">Ingredients:</span> {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily Nutrition Summary */}
      <Card className="glass border-none rounded-3xl p-8 dark:glow-accent">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-2xl font-black flex items-center gap-2">📊 Daily Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-primary dark:text-cyan-400 dark:glow-text">{currentDayMeals.totalCalories}</div>
              <div className="text-sm font-bold text-muted-foreground">Total Calories</div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-orange-500 dark:text-orange-400">{currentDayMeals.totalProtein}g</div>
              <div className="text-sm font-bold text-muted-foreground">Protein</div>
              <Progress value={(currentDayMeals.totalProtein / 120) * 100} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-500 dark:text-blue-400">{currentDayMeals.totalCarbs}g</div>
              <div className="text-sm font-bold text-muted-foreground">Carbs</div>
              <Progress value={(currentDayMeals.totalCarbs / 300) * 100} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-yellow-500 dark:text-yellow-400">{currentDayMeals.totalFat}g</div>
              <div className="text-sm font-bold text-muted-foreground">Fat</div>
              <Progress value={(currentDayMeals.totalFat / 80) * 100} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-green-500 dark:text-emerald-400">{currentDayMeals.totalFiber}g</div>
              <div className="text-sm font-bold text-muted-foreground">Fiber</div>
              <Progress value={(currentDayMeals.totalFiber / 35) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grocery List Modal */}
      {showGroceryList && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl space-y-6 dark:glow-accent">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">🛒 Weekly Grocery List</h3>
            <div className="flex gap-2">
              <Button onClick={copyGroceryList} variant="outline" className="glass border-none rounded-2xl dark:hover:bg-primary/20 transition-all duration-300">
                📋 Copy List
              </Button>
              <Button onClick={() => setShowGroceryList(false)} variant="ghost" size="icon" className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="text-center p-4 glass rounded-2xl dark:glow-primary">
            <div className="text-3xl font-black text-secondary dark:text-cyan-400 dark:glow-text">₹{groceryTotal}</div>
            <div className="text-sm font-bold text-muted-foreground">Estimated Weekly Total</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groceryList.map((category, catIdx) => (
              <Card key={category.category} className="glass border-none rounded-2xl">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    {category.category}
                    <Badge className="ml-auto bg-primary/10 text-primary border-none">{category.items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer"
                      onClick={() => toggleGroceryItem(catIdx, itemIdx)}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleGroceryItem(catIdx, itemIdx)}
                        className="w-4 h-4 rounded"
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${item.checked ? 'line-through text-muted-foreground' : ''}`}>{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity}
                          {item.unit} • ₹{item.estimatedCost}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Prep Notes Modal */}
      {showPrepNotes && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl space-y-6 dark:glow-accent">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">📝 Weekly Prep Schedule</h3>
            <Button onClick={() => setShowPrepNotes(false)} variant="ghost" size="icon" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-3">
            {PREP_NOTES.map((note, idx) => (
              <div key={idx} className="glass p-4 rounded-2xl flex items-start gap-4 dark:hover:bg-primary/10 transition-all duration-300">
                <div className="text-center min-w-[80px]">
                  <div className="text-lg font-black text-primary dark:text-cyan-400">{note.day}</div>
                  <div className="text-xs font-bold text-muted-foreground">{note.time}</div>
                </div>
                <div className="flex-1">
                  <div className="font-black">{note.task}</div>
                  <div className="text-xs text-muted-foreground font-bold mt-1">⏱️ {note.duration} minutes</div>
                </div>
                <Badge className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 border-none">{note.duration}min</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
