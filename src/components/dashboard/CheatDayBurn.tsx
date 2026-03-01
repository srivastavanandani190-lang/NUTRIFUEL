import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { EXERCISE_TYPES } from '@/types/food';
import { Flame, Activity, Zap, Info, ChevronRight, CheckCircle2, Trophy, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export const CheatDayBurn: React.FC = () => {
  const [cheatCalories, setCheatCalories] = useState(3500);
  const [selectedExercise, setSelectedExercise] = useState('Running');
  const [duration, setDuration] = useState(60);

  const currentExercise = EXERCISE_TYPES.find(t => t.name === selectedExercise);
  const caloriesBurned = currentExercise ? currentExercise.burnRate * duration : 0;
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

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/20 backdrop-blur-md">
           <Flame className="w-5 h-5 text-primary animate-bounce" />
           <span className="text-sm font-black uppercase tracking-widest text-primary">Cheat Day Balancer</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Balance the <span className="text-primary italic">Guilt</span></h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
          Had a massive meal? No worries. Let's calculate exactly how much movement you need to stay on track.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 glass p-10 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 transition-transform duration-500 group-hover:scale-110">
             <Trophy className="w-48 h-48" />
          </div>

          <div className="space-y-10 relative">
            <div className="space-y-4">
              <label className="text-xl font-black flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Cheat Calories Eaten
              </label>
              <div className="relative group/input">
                 <Input
                  type="number"
                  className="glass rounded-[1.5rem] h-20 text-3xl font-black px-8 border-none focus-visible:ring-primary shadow-inner"
                  value={cheatCalories}
                  onChange={(e) => setCheatCalories(Number(e.target.value))}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground/30">kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Choose Exercise</label>
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="glass rounded-[1.2rem] h-16 border-none text-lg font-bold outline-none shadow-sm transition-all hover:bg-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-none rounded-2xl">
                    {EXERCISE_TYPES.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Duration</label>
                <div className="glass rounded-[1.2rem] h-16 flex items-center justify-between px-6 font-black text-xl shadow-sm">
                   {duration} <span className="text-sm font-bold text-muted-foreground uppercase">min</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center px-1">
                 <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Adjust Duration</span>
                 <Clock className="w-5 h-5 text-secondary" />
              </div>
              <Slider
                min={15}
                max={180}
                step={5}
                value={[duration]}
                onValueChange={(val) => setDuration(val[0])}
                className="[&>span]:bg-secondary h-4"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="glass p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden flex flex-col justify-center items-center text-center space-y-6 min-h-[300px]">
             <div className="space-y-2">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Total Burn Calculation</div>
                <div className="text-6xl md:text-7xl font-black text-primary drop-shadow-sm">{caloriesBurned}</div>
                <div className="text-xl font-bold text-muted-foreground">kilocalories burned</div>
             </div>
             
             <div className="w-full space-y-3 px-4">
                <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                   <span className="text-primary">Burned</span>
                   <span className="text-muted-foreground">{Math.round(progressPercent)}% Covered</span>
                </div>
                <Progress value={progressPercent} className="h-4 bg-white/20" />
             </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-8 flex-1">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-yellow-500/20 rounded-2xl">
                   <Zap className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-black">Smart Suggestions</h3>
                   <p className="text-muted-foreground font-medium">Ways to reach your balance goal faster</p>
                </div>
             </div>

             <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-start gap-4 p-5 glass rounded-2xl border-l-4 border-primary transition-all hover:bg-white/5"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-md font-bold text-foreground/90">{rec}</p>
                  </motion.div>
                ))}
             </div>

             {balanceRemaining > 0 ? (
               <div className="p-6 bg-red-500/10 rounded-3xl border border-red-500/20 flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <Info className="w-6 h-6 text-red-500" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-red-500/60">Deficit Needed</div>
                      <div className="text-2xl font-black text-red-500">{balanceRemaining} kcal</div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-red-500/40 group-hover:translate-x-2 transition-transform" />
               </div>
             ) : (
               <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center gap-4 animate-bounce">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div className="text-2xl font-black text-primary uppercase italic tracking-tighter">Perfect Balance!</div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
