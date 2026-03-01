import React, { useState, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EXERCISE_TYPES } from '@/types/food';
import { Flame, Activity, LineChart as ChartIcon, Plus, Trash2, Calendar, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyChart: React.FC = () => {
  const [exerciseLogs, setExerciseLogs] = useState<{ day: string; type: string; duration: number }[]>([]);
  const [newLog, setNewLog] = useState({ day: 'Mon', type: 'Running', duration: 30 });

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

  const lineData = {
    labels: DAYS,
    datasets: [
      {
        label: 'Projected Weight (kg)',
        data: DAYS.map((_, i) => 75 - (avgBurn * (i + 1) / 7700)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: 'rgb(59, 130, 246)',
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

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">Weekly Fitness Insights</h1>
          <p className="text-muted-foreground font-medium text-lg">Track your burn and see your progress trend.</p>
        </div>

        <div className="flex gap-4 glass p-4 rounded-3xl">
          <div className="text-center px-4 border-r border-white/20">
            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Average Burn</div>
            <div className="text-2xl font-black text-primary">{Math.round(avgBurn)} <span className="text-sm font-medium">kcal/day</span></div>
          </div>
          <div className="text-center px-4">
            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Plan Adjusted</div>
            <div className="text-2xl font-black text-secondary">+{Math.round(avgBurn)} <span className="text-sm font-medium">kcal/day</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Log */}
        <Card className="lg:col-span-1 glass border-none rounded-[3rem] p-4 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Activity className="w-32 h-32" />
          </div>
          
          <CardHeader className="relative p-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              Log Exercise
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 relative p-6 flex-1 overflow-y-auto max-h-[500px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Day of Week</label>
                <Select value={newLog.day} onValueChange={(v) => setNewLog({ ...newLog, day: v })}>
                  <SelectTrigger className="glass rounded-2xl h-14 border-none text-lg font-medium outline-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-none rounded-2xl">
                    {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Exercise Type</label>
                <Select value={newLog.type} onValueChange={(v) => setNewLog({ ...newLog, type: v })}>
                  <SelectTrigger className="glass rounded-2xl h-14 border-none text-lg font-medium outline-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-none rounded-2xl">
                    {EXERCISE_TYPES.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (min)</label>
                <Input
                  type="number"
                  className="glass rounded-2xl h-14 border-none text-lg font-medium focus-visible:ring-primary outline-none"
                  value={newLog.duration}
                  onChange={(e) => setNewLog({ ...newLog, duration: Number(e.target.value) })}
                />
              </div>

              <Button 
                onClick={addLog} 
                className="w-full h-16 rounded-2xl text-lg font-black nav-gradient-btn text-white"
              >
                <Plus className="w-6 h-6 mr-2" />
                Add to Tracker
              </Button>
            </div>

            <Separator className="bg-white/20" />

            <div className="space-y-4">
               <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Recent Logs</h4>
               <div className="space-y-3">
                 <AnimatePresence mode="popLayout">
                    {exerciseLogs.slice(-4).reverse().map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex justify-between items-center glass p-4 rounded-2xl group"
                      >
                        <div>
                          <div className="font-bold text-md">{log.type}</div>
                          <div className="text-xs text-muted-foreground font-bold">{log.day} • {log.duration} min</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeLog(exerciseLogs.length - 1 - i)}
                          className="hover:bg-red-500/10 hover:text-red-500 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                 </AnimatePresence>
                 {exerciseLogs.length === 0 && (
                   <p className="text-center py-6 text-muted-foreground font-medium italic">No logs yet today.</p>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="glass border-none rounded-[3rem] p-10 overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/20 rounded-2xl">
                    <Flame className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Daily Burn Distribution</h3>
                    <p className="text-muted-foreground font-medium">Your active calories burned per day</p>
                  </div>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <Bar data={barData} options={chartOptions} />
              </div>
           </Card>

           <Card className="glass border-none rounded-[3rem] p-10 overflow-hidden relative bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-secondary/20 rounded-2xl">
                    <ChartIcon className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Weight Projection</h3>
                    <p className="text-muted-foreground font-medium">Estimated trend based on activity</p>
                  </div>
                </div>
                <Badge className="bg-secondary/20 text-secondary border-none px-4 py-2 rounded-xl text-md font-bold">
                  Predictive Analysis
                </Badge>
              </div>
              
              <div className="h-[350px] w-full">
                <Line data={lineData} options={chartOptions} />
              </div>

              <div className="mt-8 flex items-start gap-4 p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm">
                <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <p className="text-md font-medium leading-relaxed">
                  Based on your average daily burn of <span className="font-bold text-primary">{Math.round(avgBurn)} kcal</span>, 
                  you can comfortably increase your daily intake to <span className="font-bold text-secondary">{2000 + Math.round(avgBurn)} kcal</span> while 
                  maintaining your current weight goals.
                </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
