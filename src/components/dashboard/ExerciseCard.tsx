import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Flame, Star, Plus } from 'lucide-react';
import { Exercise, calculateExerciseCalories } from '@/data/exercises';
import { motion } from 'framer-motion';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToWorkout?: () => void;
  isInWorkout?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onClick, 
  isFavorite = false,
  onToggleFavorite,
  onAddToWorkout,
  isInWorkout = false
}) => {
  const totalCalories = calculateExerciseCalories(exercise);
  
  const difficultyStars = {
    beginner: '⭐⭐☆☆☆',
    intermediate: '⭐⭐⭐☆☆',
    advanced: '⭐⭐⭐⭐⭐',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="glass border-none rounded-3xl overflow-hidden group cursor-pointer dark:glow-primary transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
        <div className="relative h-64 overflow-hidden flex-shrink-0" onClick={onClick}>
          <img 
            src={exercise.thumbnail} 
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
          </button>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-primary/90 dark:bg-cyan-400/90 flex items-center justify-center shadow-2xl">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="text-xl font-black text-white">{exercise.name}</h3>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-bold">{exercise.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold">{totalCalories} kcal</span>
              </div>
              <span className="text-xs">{difficultyStars[exercise.difficulty]}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground line-clamp-2 flex-shrink-0">{exercise.description}</p>
          
          <div className="flex flex-wrap gap-2 flex-1">
            {exercise.targetMuscles?.slice(0, 3).map((muscle, idx) => {
              // Map muscle groups to appropriate emojis
              const muscleEmoji = muscle.toLowerCase().includes('chest') ? '🫀' :
                                 muscle.toLowerCase().includes('back') ? '🦴' :
                                 muscle.toLowerCase().includes('leg') ? '🦵' :
                                 muscle.toLowerCase().includes('arm') || muscle.toLowerCase().includes('bicep') || muscle.toLowerCase().includes('tricep') ? '💪' :
                                 muscle.toLowerCase().includes('shoulder') ? '🏋️' :
                                 muscle.toLowerCase().includes('core') || muscle.toLowerCase().includes('abs') ? '⚡' :
                                 muscle.toLowerCase().includes('glute') ? '🍑' :
                                 muscle.toLowerCase().includes('cardio') || muscle.toLowerCase().includes('heart') ? '❤️' :
                                 '🎯';
              
              return (
                <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 border-none h-fit">
                  <span className="mr-1">{muscleEmoji}</span>
                  {muscle}
                </Badge>
              );
            })}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToWorkout?.();
              }}
              disabled={isInWorkout}
              variant={isInWorkout ? "secondary" : "default"}
              className={`flex-1 rounded-2xl font-bold ${
                isInWorkout 
                  ? 'bg-secondary text-secondary-foreground cursor-not-allowed' 
                  : 'nav-gradient-btn text-white'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isInWorkout ? 'Added' : 'Add to Workout'}
            </Button>
            
            <Button 
              onClick={onClick}
              variant="outline"
              className="rounded-2xl glass border-primary/20 hover:bg-primary/10 flex-shrink-0"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
