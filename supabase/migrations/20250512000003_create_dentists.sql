-- Create dentists table
CREATE TABLE IF NOT EXISTS public.dentists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  bio TEXT,
  rating DECIMAL(3,2),
  years_of_experience INTEGER,
  education TEXT,
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.dentists ENABLE ROW LEVEL SECURITY;

-- Allow dentists to manage their own profiles
CREATE POLICY "Dentists can manage their own profiles"
  ON public.dentists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow anyone to read dentist profiles
CREATE POLICY "Anyone can read dentist profiles"
  ON public.dentists
  FOR SELECT
  USING (true);

-- Insert development data
INSERT INTO public.dentists (id, name, specialization, bio, rating, years_of_experience, education, languages)
VALUES
  (
    '00000000-0000-4000-a000-000000000001',
    'Д-р Иван Петров',
    'Ортодонт',
    'Опитен ортодонт с над 10 години практика. Специализиран в лечение на зъбни деформации при деца и възрастни.',
    4.7,
    12,
    'МУ София',
    ARRAY['Bulgarian']
  ),
  (
    '00000000-0000-4000-a000-000000000002',
    'Д-р Мария Димитрова',
    'Детски зъболекар',
    'Детски специалист с индивидуален подход към всяко дете. Безболезнени процедури и приятна атмосфера.',
    4.9,
    9,
    'МУ Пловдив',
    ARRAY['Bulgarian', 'English']
  ),
  (
    '00000000-0000-4000-a000-000000000003',
    'Д-р Петър Георгиев',
    'Хирург',
    'Зъбен хирург с богат опит в сложни екстракции и имплантология. Прецизност и внимание към детайла.',
    4.5,
    15,
    'МУ Варна',
    ARRAY['Bulgarian', 'German']
  ),
  (
    '00000000-0000-4000-a000-000000000004',
    'Д-р Николай Стефанов',
    'Зъболекар',
    'Зъболекар с дългогодишен опит и внимание към пациента.',
    4.6,
    11,
    'МУ Пловдив',
    ARRAY['Bulgarian', 'English']
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specialization = EXCLUDED.specialization,
  bio = EXCLUDED.bio,
  rating = EXCLUDED.rating,
  years_of_experience = EXCLUDED.years_of_experience,
  education = EXCLUDED.education,
  languages = EXCLUDED.languages; 