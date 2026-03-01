-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  current_weight DECIMAL(5,2),
  height DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'extra')),
  daily_calorie_goal INTEGER,
  role user_role DEFAULT 'user'::user_role,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user meal plans table
CREATE TABLE public.user_meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_date DATE DEFAULT CURRENT_DATE,
  meals JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_calories INTEGER DEFAULT 0,
  total_protein DECIMAL(6,2) DEFAULT 0,
  total_carbs DECIMAL(6,2) DEFAULT 0,
  total_fats DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user exercises table
CREATE TABLE public.user_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_date DATE NOT NULL,
  exercise_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Trigger function to auto-create profile on user confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (remove @miaoda.com)
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Trigger on user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercises ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Meal plans policies
CREATE POLICY "Users can manage their own meal plans" ON user_meal_plans
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Exercises policies
CREATE POLICY "Users can manage their own exercises" ON user_exercises
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Public view for shareable profile info
CREATE VIEW public_profiles AS
  SELECT id, username, role FROM profiles;

-- Indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_user_meal_plans_user_id ON user_meal_plans(user_id);
CREATE INDEX idx_user_meal_plans_date ON user_meal_plans(plan_date);
CREATE INDEX idx_user_exercises_user_id ON user_exercises(user_id);
CREATE INDEX idx_user_exercises_date ON user_exercises(exercise_date);
