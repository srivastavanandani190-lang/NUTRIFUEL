-- Create search history table
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_query TEXT,
  search_date DATE DEFAULT CURRENT_DATE,
  total_calories INTEGER,
  foods JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Policies for search history
CREATE POLICY "Users can manage their own search history" ON search_history
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_date ON search_history(search_date DESC);
