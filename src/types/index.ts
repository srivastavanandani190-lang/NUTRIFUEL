export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  current_weight: number | null;
  height: number | null;
  target_weight: number | null;
  age: number | null;
  gender: 'male' | 'female' | null;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra' | null;
  daily_calorie_goal: number | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
