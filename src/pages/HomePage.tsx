import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingDown, Activity, Utensils, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_FOODS } from '@/data/mockFood';
import { getRandomQuote, type MotivationalQuote } from '@/utils/motivationalQuotes';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const HomePage: React.FC = () => {
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('170');
  const [targetWeight, setTargetWeight] = useState('65');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'extra'>('moderate');
  const [result, setResult] = useState<{
    bmi: number;
    bmr: number;
    tdee: number;
    dailyGoal: number;
  } | null>(null);
  const [quote, setQuote] = useState<MotivationalQuote>(getRandomQuote());

  const navigate = useNavigate();

  // Refresh quote on component mount
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  // Function to manually refresh quote
  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    const tw = parseFloat(targetWeight);
    const a = parseInt(age);

    if (!w || !h || !tw || !a) {
      return;
    }

    // BMI
    const bmi = w / (h * h);

    // BMR (Mifflin-St Jeor Equation)
    const bmr = 10 * w + 6.25 * parseFloat(height) - 5 * a + (gender === 'male' ? 5 : -161);

    // TDEE
    const tdee = bmr * activityMultipliers[activityLevel];

    // Daily calorie goal (assuming 12 weeks to reach target)
    const weeks = 12;
    const calorieDeficit = ((w - tw) * 7700) / (weeks * 7);
    const dailyGoal = Math.round(tdee - calorieDeficit);

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyGoal: Math.max(1200, dailyGoal), // Minimum 1200 kcal
    });
  };

  const sampleFoods = ALL_FOODS.slice(0, 3);

  return (
    <div className="min-h-screen w-full gradient-bg">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              Your Personalized <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-emerald-400 dark:to-cyan-400">
                Food Plan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Calculate your BMI, get personalized calorie goals, and discover delicious meals tailored for you.
            </p>
          </motion.div>

          {/* BMI Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-4xl mx-auto glass border-none rounded-[3rem] shadow-2xl p-8 dark:glow-primary">
              {/* Motivational Quote Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 p-6 border-2 border-primary/20 dark:border-primary/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl" />
                
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary dark:text-cyan-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-cyan-400">
                        Daily Motivation
                      </span>
                    </div>
                    <blockquote className="text-lg md:text-xl font-bold text-foreground leading-relaxed italic">
                      "{quote.text}"
                    </blockquote>
                    <p className="text-sm font-semibold text-muted-foreground">
                      — {quote.author}
                    </p>
                  </div>
                  
                  <Button
                    onClick={refreshQuote}
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all hover:rotate-180 duration-500"
                    title="Get new quote"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-3xl flex items-center justify-center mb-6 dark:glow-primary">
                  <Calculator className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-4xl font-black">BMI & Calorie Calculator</CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Current Weight (kg)</Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-14 rounded-2xl glass border-none text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Height (cm)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="h-14 rounded-2xl glass border-none text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Target Weight (kg)</Label>
                    <Input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="h-14 rounded-2xl glass border-none text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-14 rounded-2xl glass border-none text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Gender</Label>
                    <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                      <SelectTrigger className="h-14 rounded-2xl glass border-none text-lg font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-none rounded-2xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider">Activity Level</Label>
                    <Select value={activityLevel} onValueChange={(v: any) => setActivityLevel(v)}>
                      <SelectTrigger className="h-14 rounded-2xl glass border-none text-lg font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-none rounded-2xl">
                        <SelectItem value="sedentary">Sedentary (Little/No Exercise)</SelectItem>
                        <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                        <SelectItem value="extra">Extra Active (Athlete)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={calculateBMI}
                  className="w-full h-16 rounded-2xl text-xl font-black nav-gradient-btn text-white"
                >
                  <Calculator className="w-6 h-6 mr-2" />
                  Calculate My Goals
                </Button>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                  >
                    <div className="glass p-6 rounded-3xl text-center space-y-2">
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">BMI</div>
                      <div className="text-3xl font-black text-primary">{result.bmi}</div>
                    </div>
                    <div className="glass p-6 rounded-3xl text-center space-y-2">
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">BMR</div>
                      <div className="text-3xl font-black text-secondary">{result.bmr}</div>
                    </div>
                    <div className="glass p-6 rounded-3xl text-center space-y-2">
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">TDEE</div>
                      <div className="text-3xl font-black text-orange-500">{result.tdee}</div>
                    </div>
                    <div className="glass p-6 rounded-3xl text-center space-y-2 col-span-2 md:col-span-1">
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Daily Goal</div>
                      <div className="text-3xl font-black text-primary">{result.dailyGoal} kcal</div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
          >
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="h-16 px-12 rounded-2xl text-xl font-black nav-gradient-btn text-white"
            >
              Sign Up Free
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              variant="outline"
              className="h-16 px-12 rounded-2xl text-xl font-black glass border-primary/20 hover:bg-primary/5"
            >
              Login
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
