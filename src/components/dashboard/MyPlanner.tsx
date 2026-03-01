import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ALL_FOODS } from '@/data/mockFood';
import { Food } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Download, Plus, Trash2, Search, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveMealPlan } from '@/db/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MealItem {
  food: Food;
  portion: number;
  id: string;
}

const ItemTypes = {
  FOOD: 'food',
};

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

export const MyPlanner: React.FC = () => {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [planName, setPlanName] = useState('My Custom Plan');
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const filteredFoods = ALL_FOODS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20);

  const handleDrop = (food: Food) => {
    const newMeal: MealItem = {
      food,
      portion: 1,
      id: `${food.id}-${Date.now()}`,
    };
    setMeals([...meals, newMeal]);
    toast.success(`${food.name} added to your plan`);
  };

  const updatePortion = (id: string, portion: number) => {
    setMeals(meals.map((m) => (m.id === id ? { ...m, portion } : m)));
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter((m) => m.id !== id));
    toast.info('Item removed');
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.food.calories * m.portion, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.food.protein * m.portion, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.food.carbs * m.portion, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.food.fats * m.portion, 0);

  const savePlan = async () => {
    if (!user) {
      toast.error('Please login to save plans');
      return;
    }

    const { error } = await saveMealPlan({
      user_id: user.id,
      plan_name: planName,
      meals: meals.map((m) => ({
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">My Planner</h1>
            <p className="text-muted-foreground font-medium mt-1">Drag & drop foods to create your perfect meal plan</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={savePlan} className="rounded-2xl h-12 px-6 font-bold nav-gradient-btn text-white">
              <Save className="w-5 h-5 mr-2" />
              Save Plan
            </Button>
            <Button onClick={exportPDF} variant="outline" className="rounded-2xl h-12 px-6 font-bold glass border-primary/20">
              <Download className="w-5 h-5 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Foods */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass border-none rounded-[2.5rem] p-6">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-primary" />
                  Available Foods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-2xl glass border-none"
                  />
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {filteredFoods.map((food) => (
                      <DraggableFood key={food.id} food={food} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* My Meals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-[2.5rem]">
              <Input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="text-2xl font-black h-14 rounded-2xl glass border-none mb-6"
              />

              <DropZone onDrop={handleDrop}>
                {meals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Plus className="w-16 h-16 text-muted-foreground/30" />
                    <p className="text-lg font-bold text-muted-foreground">
                      Drag foods here to build your meal plan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4" id="meal-plan-export">
                    {meals.map((meal) => (
                      <div key={meal.id} className="glass p-5 rounded-2xl flex items-center gap-4">
                        <img src={meal.food.image} alt={meal.food.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{meal.food.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {Math.round(meal.food.calories * meal.portion)} kcal • {Math.round(meal.food.protein * meal.portion)}g protein
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMeal(meal.id)}
                              className="hover:bg-destructive/10 hover:text-destructive rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold">Portion:</span>
                            <Slider
                              min={0.5}
                              max={2}
                              step={0.5}
                              value={[meal.portion]}
                              onValueChange={(val) => updatePortion(meal.id, val[0])}
                              className="flex-1 [&>span]:bg-primary"
                            />
                            <Badge className="bg-primary/10 text-primary border-none px-3 py-1 rounded-xl font-bold">
                              {meal.portion}x
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DropZone>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass border-none rounded-3xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Calories</p>
                <p className="text-3xl font-black text-primary">{Math.round(totalCalories)}</p>
              </Card>
              <Card className="glass border-none rounded-3xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Protein</p>
                <p className="text-3xl font-black text-secondary">{Math.round(totalProtein)}g</p>
              </Card>
              <Card className="glass border-none rounded-3xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Carbs</p>
                <p className="text-3xl font-black text-blue-500">{Math.round(totalCarbs)}g</p>
              </Card>
              <Card className="glass border-none rounded-3xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Fats</p>
                <p className="text-3xl font-black text-orange-500">{Math.round(totalFats)}g</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
