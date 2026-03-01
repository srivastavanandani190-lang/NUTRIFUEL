import { supabase } from './supabase';

export interface MealPlanData {
  user_id: string;
  plan_name: string;
  meals: any;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
}

export interface SearchHistoryData {
  user_id: string;
  search_query?: string;
  total_calories: number;
  foods: any;
}

export const saveMealPlan = async (data: MealPlanData) => {
  const { data: result, error } = await supabase
    .from('user_meal_plans')
    .insert([data]);

  return { data: result, error };
};

export const getUserMealPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: Array.isArray(data) ? data : [], error };
};

export const saveSearchHistory = async (data: SearchHistoryData) => {
  const { data: result, error } = await supabase
    .from('search_history')
    .insert([data]);

  return { data: result, error };
};

export const getUserSearchHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  return { data: Array.isArray(data) ? data : [], error };
};

export const deleteSearchHistoryItem = async (historyId: string) => {
  const { error } = await supabase
    .from('search_history')
    .delete()
    .eq('id', historyId);

  return { error };
};

export const clearAllSearchHistory = async (userId: string) => {
  const { error } = await supabase
    .from('search_history')
    .delete()
    .eq('user_id', userId);

  return { error };
};

export const updateProfile = async (userId: string, updates: Partial<{
  current_weight: number;
  height: number;
  target_weight: number;
  age: number;
  gender: string;
  activity_level: string;
  daily_calorie_goal: number;
}>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  return { data, error };
};

export const saveExercise = async (userId: string, exerciseData: {
  exercise_date: string;
  exercise_type: string;
  duration_minutes: number;
  calories_burned: number;
}) => {
  const { data, error } = await supabase
    .from('user_exercises')
    .insert([{ user_id: userId, ...exerciseData }]);

  return { data, error };
};

export const getUserExercises = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_exercises')
    .select('*')
    .eq('user_id', userId)
    .order('exercise_date', { ascending: false });

  return { data: Array.isArray(data) ? data : [], error };
};
