import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Play, Pause, RotateCcw, Check, Clock, Flame, Star } from 'lucide-react';
import { Exercise, calculateExerciseCalories } from '@/data/exercises';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  userWeight?: number;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ 
  exercise, 
  isOpen, 
  onClose,
  isFavorite = false,
  onToggleFavorite,
  userWeight = 70
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (exercise) {
      setTimeRemaining(exercise.duration * 60); // Convert to seconds
      setIsTimerRunning(false);
      setIsCompleted(false);
    }
  }, [exercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsCompleted(true);
            toast.success('🎉 Workout completed! Great job!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  if (!exercise) return null;

  const totalCalories = calculateExerciseCalories(exercise);
  const adjustedCalories = Math.round((totalCalories * userWeight) / 70); // Adjust for user weight
  const progress = exercise.duration > 0 ? ((exercise.duration * 60 - timeRemaining) / (exercise.duration * 60)) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyStars = {
    beginner: '⭐⭐☆☆☆',
    intermediate: '⭐⭐⭐☆☆',
    advanced: '⭐⭐⭐⭐⭐',
  };

  const handlePlayPause = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleReset = () => {
    setTimeRemaining(exercise.duration * 60);
    setIsTimerRunning(false);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    toast.success(`✅ ${adjustedCalories} kcal burned! Added to your daily tracker.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass border-none p-0 dark:glow-accent">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img 
              src={exercise.thumbnail} 
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Close & Favorite Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={onToggleFavorite}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Star className={`w-6 h-6 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
              </button>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-4xl font-black text-white mb-2">{exercise.name}</h2>
              <div className="flex items-center gap-4 text-white/90">
                <Badge className="bg-white/20 text-white border-none">
                  {exercise.difficulty.toUpperCase()} {difficultyStars[exercise.difficulty]}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">{exercise.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-bold">{adjustedCalories} kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* YouTube Video */}
            {exercise.videoUrl && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  📹 Video Tutorial
                </h3>
                <div className="relative rounded-3xl overflow-hidden aspect-video glass">
                  <iframe
                    src={`${exercise.videoUrl}?autoplay=0&mute=1`}
                    title={exercise.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-2xl text-center dark:glow-primary">
                <div className="text-3xl font-black text-primary dark:text-cyan-400">{exercise.duration}</div>
                <div className="text-sm text-muted-foreground font-bold">Minutes</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center dark:glow-primary">
                <div className="text-3xl font-black text-orange-500">{adjustedCalories}</div>
                <div className="text-sm text-muted-foreground font-bold">Calories</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center dark:glow-primary">
                <div className="text-3xl font-black text-blue-500 dark:text-blue-400">{exercise.caloriesPerMin}</div>
                <div className="text-sm text-muted-foreground font-bold">kcal/min</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center dark:glow-primary">
                <div className="text-3xl font-black text-purple-500 dark:text-purple-400">{userWeight}kg</div>
                <div className="text-sm text-muted-foreground font-bold">Your Weight</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-2xl font-black">About This Workout</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{exercise.description}</p>
            </div>

            {/* Target Muscles */}
            {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-2xl font-black">💪 Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.targetMuscles.map((muscle, idx) => (
                    <Badge key={idx} className="text-sm bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 border-none px-4 py-2">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {exercise.equipment && exercise.equipment.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-2xl font-black">🏋️ Equipment Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm px-4 py-2 dark:border-slate-600">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Timer */}
            <div className="glass p-8 rounded-3xl space-y-6 dark:glow-accent">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">⏱️ Workout Timer</h3>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white border-none px-4 py-2">
                    <Check className="w-4 h-4 mr-2" />
                    Completed!
                  </Badge>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-center space-y-4">
                <motion.div 
                  className="text-7xl font-black text-primary dark:text-cyan-400 dark:glow-text"
                  animate={{ scale: isTimerRunning ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1, repeat: isTimerRunning ? Infinity : 0 }}
                >
                  {formatTime(timeRemaining)}
                </motion.div>
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-muted-foreground font-bold">
                  {Math.round(progress)}% Complete • {Math.round((progress / 100) * adjustedCalories)} kcal burned
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="rounded-full w-16 h-16 nav-gradient-btn text-white"
                  disabled={isCompleted}
                >
                  {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="rounded-full w-16 h-16 glass border-none dark:hover:bg-primary/20"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="rounded-full px-8 bg-green-500 hover:bg-green-600 text-white font-bold"
                  disabled={!isCompleted && progress < 100}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
