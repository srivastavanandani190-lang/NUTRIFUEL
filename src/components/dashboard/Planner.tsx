import React, { useState, useEffect, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_FOODS } from '@/data/mockFood';
import { ALL_EXERCISES, EXERCISE_CATEGORIES, getExercisesByCategory, calculateExerciseCalories, type Exercise } from '@/data/exercises';
import { Food, Meal, DailyPlan, EXERCISE_TYPES } from '@/types/food';
import { WeeklyPlanner } from './WeeklyPlanner';
import { Zap, Save, RefreshCw, CheckCircle2, ChevronRight, Info, Download, Plus, Trash2, Search, ChefHat, Sparkles, Calendar, Activity, Flame, Target, Trophy, Clock, Play, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { saveMealPlan } from '@/db/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseModal } from './ExerciseModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const STORAGE_KEY = 'nutrifuel_daily_plan';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MealItem {
  food: Food;
  portion: number;
  id: string;
}

const ItemTypes = {
  FOOD: 'food',
};

// Draggable Food Component
const DraggableFood: React.FC<{ food: Food }> = ({ food }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FOOD,
    item: { food },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`glass p-4 rounded-2xl cursor-move transition-all hover:shadow-xl ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={food.image} alt={food.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1">
          <h4 className="font-bold text-sm">{food.name}</h4>
          <p className="text-xs text-muted-foreground">{food.calories} kcal</p>
        </div>
      </div>
    </div>
  );
};

// Drop Zone Component
const DropZone: React.FC<{ onDrop: (food: Food) => void; children: React.ReactNode }> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FOOD,
    drop: (item: { food: Food }) => onDrop(item.food),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={`min-h-[400px] glass p-6 rounded-[2.5rem] transition-all ${
        isOver ? 'ring-4 ring-primary bg-primary/5' : ''
      }`}
    >
      {children}
    </div>
  );
};

interface PlannerProps {
  initialMode?: 'quick' | 'custom' | 'weekly' | 'cheat' | 'exercise';
}

export const Planner: React.FC<PlannerProps> = ({ initialMode = 'quick' }) => {
  const [mode, setMode] = useState<'quick' | 'custom' | 'weekly' | 'cheat' | 'exercise'>(initialMode);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [customMeals, setCustomMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState('My Custom Plan');
  const [search, setSearch] = useState('');
  const { user, profile } = useAuth();

  // Weekly Chart State
  const [exerciseLogs, setExerciseLogs] = useState<{ day: string; type: string; duration: number }[]>([]);
  const [newLog, setNewLog] = useState({ day: 'Mon', type: 'Running', duration: 30 });

  // Cheat Day Burn State
  const [cheatCalories, setCheatCalories] = useState(3500);
  const [selectedExercise, setSelectedExercise] = useState('Running');
  const [cheatDuration, setCheatDuration] = useState(60);

  // Exercise Tab State
  const [selectedCategory, setSelectedCategory] = useState('cardio');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);

  // Load saved plan on mount
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

  // Generate meals automatically (Quick Mode)
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
      await new Promise(r => setTimeout(r, 800));
    }
    
    const mealNames = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
    const newMeals: Meal[] = [];

    for (let i = 0; i < 4; i++) {
      const mealTarget = i === 2 ? targetCalories * 0.1 : targetCalories * 0.3;
      const mealFoods: Food[] = [];
      let mealCals = 0;

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

  // Save plan to localStorage (Quick Mode)
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

  // Add consumed calories (Quick Mode)
  const addConsumed = (cals: number) => {
    setConsumedCalories(prev => Math.min(prev + cals, targetCalories * 1.5));
    toast.info(`Added ${cals} kcal to your daily intake.`);
  };

  // Custom Mode: Drag & Drop
  const filteredFoods = ALL_FOODS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20);

  const handleDrop = (food: Food) => {
    const newMeal: MealItem = {
      food,
      portion: 1,
      id: `${food.id}-${Date.now()}`,
    };
    setCustomMeals([...customMeals, newMeal]);
    toast.success(`${food.name} added to your plan`);
  };

  const updatePortion = (id: string, portion: number) => {
    setCustomMeals(customMeals.map((m) => (m.id === id ? { ...m, portion } : m)));
  };

  const removeMeal = (id: string) => {
    setCustomMeals(customMeals.filter((m) => m.id !== id));
    toast.info('Item removed');
  };

  const totalCalories = customMeals.reduce((sum, m) => sum + m.food.calories * m.portion, 0);
  const totalProtein = customMeals.reduce((sum, m) => sum + m.food.protein * m.portion, 0);
  const totalCarbs = customMeals.reduce((sum, m) => sum + m.food.carbs * m.portion, 0);
  const totalFats = customMeals.reduce((sum, m) => sum + m.food.fats * m.portion, 0);

  // Save custom plan to database
  const saveCustomPlan = async () => {
    if (!user) {
      toast.error('Please login to save plans');
      return;
    }

    const { error } = await saveMealPlan({
      user_id: user.id,
      plan_name: planName,
      meals: customMeals.map((m) => ({
        food_id: m.food.id,
        food_name: m.food.name,
        portion: m.portion,
        calories: m.food.calories * m.portion,
      })),
      total_calories: Math.round(totalCalories),
      total_protein: Math.round(totalProtein * 10) / 10,
      total_carbs: Math.round(totalCarbs * 10) / 10,
      total_fats: Math.round(totalFats * 10) / 10,
    });

    if (error) {
      toast.error('Failed to save plan');
      console.error(error);
    } else {
      toast.success('Plan saved successfully!');
    }
  };

  // Export to PDF
  const exportPDF = async () => {
    const element = document.getElementById('meal-plan-export');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${planName}.pdf`);
    toast.success('PDF exported!');
  };

  const progress = (consumedCalories / targetCalories) * 100;

  // Exercise Mode Functions
  const toggleFavorite = (exerciseId: string) => {
    setFavoriteExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Weekly Chart Functions
  const addLog = () => {
    if (newLog.duration <= 0) {
      toast.error('Duration must be positive');
      return;
    }
    setExerciseLogs([...exerciseLogs, { ...newLog }]);
    toast.success(`Logged ${newLog.type} for ${newLog.day}`);
  };

  const removeLog = (index: number) => {
    setExerciseLogs(exerciseLogs.filter((_, i) => i !== index));
    toast.info('Log removed');
  };

  const dayTotals = useMemo(() => {
    const totals = DAYS.map(day => {
      const logs = exerciseLogs.filter(l => l.day === day);
      return logs.reduce((sum, log) => {
        const type = EXERCISE_TYPES.find(t => t.name === log.type);
        return sum + (type ? type.burnRate * log.duration : 0);
      }, 0);
    });
    return totals;
  }, [exerciseLogs]);

  const avgBurn = dayTotals.reduce((a, b) => a + b, 0) / 7;

  const barData = {
    labels: DAYS,
    datasets: [
      {
        label: 'Calories Burned (kcal)',
        data: dayTotals,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 12,
        hoverBackgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 16, weight: 'bold' as const },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: { size: 12, weight: 'bold' as const },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12, weight: 'bold' as const },
        },
      },
    },
  };

  // Cheat Day Burn Calculations
  const currentExercise = EXERCISE_TYPES.find(t => t.name === selectedExercise);
  const caloriesBurned = currentExercise ? currentExercise.burnRate * cheatDuration : 0;
  const balanceRemaining = Math.max(0, cheatCalories - caloriesBurned);
  const progressPercent = Math.min(100, (caloriesBurned / cheatCalories) * 100);

  const recommendations = useMemo(() => {
    const list: string[] = [];
    if (balanceRemaining > 1000) {
      list.push("Try a higher-intensity workout like Running or Swimming.");
      list.push("Consider splitting the burn over 2-3 days.");
    } else if (balanceRemaining > 500) {
      list.push("A 30min Gym session + 45min Walk would balance this!");
      list.push("Combine cycling with some strength training.");
    } else {
      list.push("You're almost there! A light walk will cover the rest.");
      list.push("Great job! Keep the momentum going.");
    }
    return list;
  }, [balanceRemaining]);

  // Exercise Calculations
  const totalExerciseCalories = selectedExercises.reduce((sum, ex) => sum + calculateExerciseCalories(ex), 0);
  const adjustedDailyCalories = targetCalories + totalExerciseCalories;

  // Personalized Exercise Recommendations
  const getPersonalizedRecommendations = useMemo(() => {
    if (!profile) return [];

    const currentWeight = profile.current_weight || 70;
    const targetWeight = profile.target_weight || 65;
    const gender = profile.gender || 'other';
    const activityLevel = profile.activity_level || 'moderate';

    const weightDiff = currentWeight - targetWeight;
    const weeklyDeficit = Math.abs(weightDiff) * 7700 / 10; // 10 weeks target
    const dailyBurnTarget = weeklyDeficit / 7;

    const recommendations: Exercise[] = [];

    // Gender-specific recommendations
    if (gender === 'female') {
      recommendations.push(...getExercisesByCategory('women').slice(0, 2));
      recommendations.push(...getExercisesByCategory('yoga').slice(0, 2));
    } else if (gender === 'male') {
      recommendations.push(...getExercisesByCategory('men').slice(0, 2));
      recommendations.push(...getExercisesByCategory('strength').slice(0, 2));
    }

    // Goal-based recommendations
    if (weightDiff > 0) {
      // Weight loss
      recommendations.push(...getExercisesByCategory('weight-loss').slice(0, 2));
      recommendations.push(...getExercisesByCategory('cardio').slice(0, 2));
    } else if (weightDiff < 0) {
      // Muscle gain
      recommendations.push(...getExercisesByCategory('muscle-gain').slice(0, 2));
      recommendations.push(...getExercisesByCategory('strength').slice(0, 2));
    }

    // Activity level adjustments
    if (activityLevel === 'sedentary' || activityLevel === 'light') {
      recommendations.push(...getExercisesByCategory('yoga').slice(0, 2));
    } else if (activityLevel === 'active' || activityLevel === 'extra') {
      recommendations.push(...getExercisesByCategory('cardio').slice(2, 4));
    }

    // Remove duplicates
    const uniqueRecommendations = recommendations.filter((ex, index, self) =>
      index === self.findIndex((t) => t.id === ex.id)
    );

    return uniqueRecommendations.slice(0, 6);
  }, [profile]);

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (selectedExercises.find(ex => ex.id === exercise.id)) {
      toast.info('Exercise already added');
      return;
    }
    setSelectedExercises([...selectedExercises, exercise]);
    toast.success(`Added ${exercise.name} to your workout`);
  };

  const removeExerciseFromWorkout = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
    toast.info('Exercise removed');
  };

  const generateExercisePlan = () => {
    if (getPersonalizedRecommendations.length === 0) {
      toast.error('Please complete your profile first');
      return;
    }
    setSelectedExercises(getPersonalizedRecommendations);
    toast.success('Personalized workout plan generated!');
  };

  const filteredExercises = useMemo(() => {
    const categoryExercises = getExercisesByCategory(selectedCategory);
    if (!exerciseSearch) return categoryExercises;
    return categoryExercises.filter(ex =>
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.description.toLowerCase().includes(exerciseSearch.toLowerCase())
    );
  }, [selectedCategory, exerciseSearch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">
              {mode === 'exercise' ? 'Exercise & Yoga' : 'Meal Planner'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {mode === 'quick' && 'Complete weekly meal planner with grocery list and prep notes'}
              {mode === 'custom' && 'Build your custom meal plan with drag & drop'}
              {mode === 'weekly' && 'Track your weekly exercise and adjust your meal plans'}
              {mode === 'cheat' && 'Balance your cheat day with the right exercise'}
              {mode === 'exercise' && 'Personalized workout plans for your fitness goals'}
            </p>
          </div>

          {/* Mode Toggle */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'custom' | 'weekly' | 'cheat' | 'exercise')} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4 glass h-14">
              <TabsTrigger value="quick" className="data-[state=active]:nav-gradient-btn data-[state=active]:text-white text-xs md:text-sm">
                <Sparkles className="w-4 h-4 mr-1" />
                Quick
              </TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:nav-gradient-btn data-[state=active]:text-white text-xs md:text-sm">
                <ChefHat className="w-4 h-4 mr-1" />
                Custom
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:nav-gradient-btn data-[state=active]:text-white text-xs md:text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="cheat" className="data-[state=active]:nav-gradient-btn data-[state=active]:text-white text-xs md:text-sm">
                <Flame className="w-4 h-4 mr-1" />
                Cheat
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Weekly Meal Planner Mode */}
        {mode === 'quick' && <WeeklyPlanner />}

        {/* Custom Build Mode */}
        {mode === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Food Library */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="glass border-none rounded-[2.5rem] p-6">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Food Library
                </h3>
                <Input
                  placeholder="Search foods..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-4 h-12 rounded-2xl glass border-none"
                />
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {filteredFoods.map((food) => (
                      <DraggableFood key={food.id} food={food} />
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Meal Plan Builder */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Plan name..."
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="flex-1 h-14 rounded-2xl glass border-none text-lg font-bold"
                />
                <Button onClick={saveCustomPlan} className="h-14 px-6 rounded-2xl font-bold nav-gradient-btn text-white">
                  <Save className="w-5 h-5 mr-2" />
                  Save
                </Button>
                <Button onClick={exportPDF} variant="outline" className="h-14 px-6 rounded-2xl font-bold glass border-2">
                  <Download className="w-5 h-5 mr-2" />
                  PDF
                </Button>
              </div>

              <DropZone onDrop={handleDrop}>
                <div id="meal-plan-export" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black">Your Meal Plan</h3>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary">{Math.round(totalCalories)} kcal</div>
                      <div className="text-sm text-muted-foreground font-bold">
                        P: {Math.round(totalProtein)}g • C: {Math.round(totalCarbs)}g • F: {Math.round(totalFats)}g
                      </div>
                    </div>
                  </div>

                  {customMeals.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-bold">Drag foods here to build your plan</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customMeals.map((meal) => (
                        <div key={meal.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                          <img src={meal.food.image} alt={meal.food.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{meal.food.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(meal.food.calories * meal.portion)} kcal • 
                              {Math.round(meal.food.protein * meal.portion)}g protein
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              min="0.5"
                              max="10"
                              step="0.5"
                              value={meal.portion}
                              onChange={(e) => updatePortion(meal.id, parseFloat(e.target.value) || 1)}
                              className="w-20 h-10 rounded-xl glass border-none text-center font-bold"
                            />
                            <span className="text-sm text-muted-foreground font-bold">portions</span>
                            <Button
                              onClick={() => removeMeal(meal.id)}
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          </div>
        )}

        {/* Weekly Mode */}
        {mode === 'weekly' && (
          <div className="space-y-8">
            {/* Stats Header */}
            <div className="flex gap-4 glass p-6 rounded-3xl justify-center">
              <div className="text-center px-6 border-r border-white/20">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Average Burn</div>
                <div className="text-3xl font-black text-primary">{Math.round(avgBurn)} <span className="text-sm font-medium">kcal/day</span></div>
              </div>
              <div className="text-center px-6">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Plan Adjusted</div>
                <div className="text-3xl font-black text-secondary">+{Math.round(avgBurn)} <span className="text-sm font-medium">kcal/day</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Exercise Log Input */}
              <Card className="lg:col-span-1 glass border-none rounded-[3rem] p-6">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    Log Exercise
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6 p-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Day of Week</label>
                      <Select value={newLog.day} onValueChange={(v) => setNewLog({ ...newLog, day: v })}>
                        <SelectTrigger className="glass rounded-2xl h-12 border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-none rounded-2xl">
                          {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Exercise Type</label>
                      <Select value={newLog.type} onValueChange={(v) => setNewLog({ ...newLog, type: v })}>
                        <SelectTrigger className="glass rounded-2xl h-12 border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-none rounded-2xl">
                          {EXERCISE_TYPES.map(t => <SelectItem key={t.name} value={t.name}>{t.name} ({t.burnRate} kcal/min)</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Duration (min)</label>
                      <Input
                        type="number"
                        className="glass rounded-2xl h-12 border-none"
                        value={newLog.duration}
                        onChange={(e) => setNewLog({ ...newLog, duration: Number(e.target.value) })}
                      />
                    </div>

                    <Button 
                      onClick={addLog} 
                      className="w-full h-14 rounded-2xl text-lg font-black nav-gradient-btn text-white"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Tracker
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Logs</h4>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2 pr-4">
                        <AnimatePresence mode="popLayout">
                          {exerciseLogs.slice(-10).reverse().map((log, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex justify-between items-center glass p-3 rounded-2xl group"
                            >
                              <div>
                                <div className="font-bold text-sm">{log.type}</div>
                                <div className="text-xs text-muted-foreground">{log.day} • {log.duration} min</div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeLog(exerciseLogs.length - 1 - i)}
                                className="hover:bg-destructive/10 hover:text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {exerciseLogs.length === 0 && (
                          <p className="text-center py-8 text-muted-foreground font-medium">No logs yet</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bar Chart */}
                <Card className="glass border-none rounded-[3rem] p-8">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                      <Activity className="w-6 h-6 text-primary" />
                      Weekly Calories Burned
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px]">
                      <Bar data={barData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Breakdown */}
                <Card className="glass border-none rounded-[3rem] p-8">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                      <Target className="w-6 h-6 text-secondary" />
                      Daily Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {DAYS.map((day, idx) => (
                        <div key={day} className="glass p-4 rounded-2xl text-center">
                          <div className="text-sm font-bold text-muted-foreground mb-2">{day}</div>
                          <div className="text-2xl font-black text-primary">{Math.round(dayTotals[idx])}</div>
                          <div className="text-xs text-muted-foreground font-bold mt-1">kcal burned</div>
                          {dayTotals[idx] > 0 && (
                            <Badge className="mt-2 bg-secondary/10 text-secondary border-none text-xs">
                              +{Math.round(dayTotals[idx])} to eat
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Cheat Day Mode */}
        {mode === 'cheat' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/20 backdrop-blur-md">
                <Flame className="w-5 h-5 text-primary animate-bounce" />
                <span className="text-sm font-black uppercase tracking-widest text-primary">Cheat Day Balancer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Balance the <span className="text-primary italic">Guilt</span></h2>
              <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
                Had a massive meal? No worries. Let's calculate exactly how much movement you need to stay on track.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6 glass p-8 rounded-[3rem]">
                <div className="space-y-4">
                  <label className="text-xl font-black flex items-center gap-3">
                    <Target className="w-6 h-6 text-primary" />
                    Cheat Calories Eaten
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      className="glass rounded-2xl h-16 text-2xl font-black px-6 border-none"
                      value={cheatCalories}
                      onChange={(e) => setCheatCalories(Number(e.target.value))}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground/30">kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Choose Exercise</label>
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger className="glass rounded-2xl h-14 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-none rounded-2xl">
                        {EXERCISE_TYPES.map(t => <SelectItem key={t.name} value={t.name}>{t.name} ({t.burnRate} kcal/min)</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Duration</label>
                    <div className="glass rounded-2xl h-14 flex items-center justify-between px-6 font-black text-lg">
                      {cheatDuration} <span className="text-sm font-bold text-muted-foreground uppercase">min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Adjust Duration</span>
                    <Activity className="w-5 h-5 text-secondary" />
                  </div>
                  <Slider
                    min={15}
                    max={180}
                    step={5}
                    value={[cheatDuration]}
                    onValueChange={(val) => setCheatDuration(val[0])}
                    className="[&>span]:bg-secondary h-3"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="flex flex-col gap-6">
                {/* Burn Calculation */}
                <div className="glass p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 to-secondary/10 text-center space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Burn Calculation</div>
                    <div className="text-6xl font-black text-primary">{caloriesBurned}</div>
                    <div className="text-lg font-bold text-muted-foreground">kilocalories burned</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                      <span className="text-primary">Burned</span>
                      <span className="text-muted-foreground">{Math.round(progressPercent)}% Covered</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-white/20" />
                  </div>
                </div>

                {/* Suggestions */}
                <div className="glass p-8 rounded-[3rem] space-y-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/20 rounded-2xl">
                      <Zap className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">Smart Suggestions</h3>
                      <p className="text-sm text-muted-foreground font-medium">Ways to reach your balance goal faster</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-start gap-3 p-4 glass rounded-2xl border-l-4 border-primary"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold">{rec}</p>
                      </motion.div>
                    ))}
                  </div>

                  {balanceRemaining > 0 ? (
                    <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-red-500" />
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest text-red-500/60">Deficit Needed</div>
                          <div className="text-xl font-black text-red-500">{balanceRemaining} kcal</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-500/40" />
                    </div>
                  ) : (
                    <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center gap-3">
                      <Trophy className="w-6 h-6 text-primary" />
                      <div className="text-xl font-black text-primary uppercase italic">Perfect Balance!</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Mode */}
        {mode === 'exercise' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="glass p-8 rounded-[3rem] text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest text-primary">Personalized Workout</span>
              </div>
              {totalExerciseCalories > 0 && (
                <div className="space-y-2">
                  <h2 className="text-4xl font-black">Burn {totalExerciseCalories} kcal Today</h2>
                  <p className="text-2xl font-bold text-primary">→ Eat {adjustedDailyCalories} kcal Smart</p>
                  <p className="text-muted-foreground font-medium">Your workout plan adjusts your daily meal target</p>
                </div>
              )}
              {profile && (
                <div className="flex items-center justify-center gap-6 text-sm font-bold">
                  <div>Current: {profile.current_weight || 70}kg</div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-primary">Target: {profile.target_weight || 65}kg</div>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">Exercise Categories</h3>
                <Button onClick={generateExercisePlan} className="nav-gradient-btn text-white rounded-2xl">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Plan
                </Button>
              </div>
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-4 min-w-max">
                  {EXERCISE_CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      className={`rounded-2xl whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'nav-gradient-btn text-white'
                          : 'glass border-none hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-2">{cat.emoji}</span>
                      {cat.name}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="glass rounded-2xl h-14 pl-12 border-none"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Exercise Grid */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-black">Available Exercises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onClick={() => setSelectedExerciseForModal(exercise)}
                      isFavorite={favoriteExercises.includes(exercise.id)}
                      onToggleFavorite={() => toggleFavorite(exercise.id)}
                      onAddToWorkout={() => addExerciseToWorkout(exercise)}
                      isInWorkout={selectedExercises.some(e => e.id === exercise.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Workout */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass p-6 rounded-3xl space-y-6 sticky top-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Your Workout</h3>
                    <Badge className="bg-primary/10 text-primary border-none px-3 py-1">
                      {selectedExercises.length} exercises
                    </Badge>
                  </div>

                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground font-medium">No exercises selected</p>
                      <p className="text-sm text-muted-foreground">Add exercises to build your workout</p>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3 pr-4">
                          {selectedExercises.map((exercise) => (
                            <motion.div
                              key={exercise.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="glass p-4 rounded-2xl space-y-2 group"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold">{exercise.name}</h4>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold mt-1">
                                    <span>{exercise.duration} min</span>
                                    <span>•</span>
                                    <span>{calculateExerciseCalories(exercise)} kcal</span>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => removeExerciseFromWorkout(exercise.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span>Total Duration</span>
                          <span className="text-primary">{selectedExercises.reduce((sum, ex) => sum + ex.duration, 0)} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span>Total Burn</span>
                          <span className="text-orange-500">{totalExerciseCalories} kcal</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-black">
                          <span>Adjusted Calories</span>
                          <span className="text-secondary">{adjustedDailyCalories} kcal</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setMode('quick');
                          setTargetCalories(adjustedDailyCalories);
                          toast.success('Switched to meal planner with adjusted calories!');
                        }}
                        className="w-full h-14 rounded-2xl nav-gradient-btn text-white text-lg font-black"
                      >
                        <ChefHat className="w-5 h-5 mr-2" />
                        Generate Meal Plan
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            {getPersonalizedRecommendations.length > 0 && (
              <Card className="glass border-none rounded-[3rem] p-8">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="text-2xl font-black flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Recommended For You
                  </CardTitle>
                  <p className="text-muted-foreground font-medium">Based on your profile and goals</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getPersonalizedRecommendations.map((exercise) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-4 rounded-2xl space-y-3 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => addExerciseToWorkout(exercise)}
                      >
                        <div className="relative h-32 rounded-xl overflow-hidden">
                          <img
                            src={exercise.thumbnail}
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">{exercise.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold mt-1">
                            <Clock className="w-3 h-3" />
                            {exercise.duration} min
                            <Flame className="w-3 h-3 ml-2" />
                            {calculateExerciseCalories(exercise)} kcal
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise Modal */}
            <ExerciseModal
              exercise={selectedExerciseForModal}
              isOpen={!!selectedExerciseForModal}
              onClose={() => setSelectedExerciseForModal(null)}
              isFavorite={selectedExerciseForModal ? favoriteExercises.includes(selectedExerciseForModal.id) : false}
              onToggleFavorite={() => selectedExerciseForModal && toggleFavorite(selectedExerciseForModal.id)}
              userWeight={profile?.current_weight || 70}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};
