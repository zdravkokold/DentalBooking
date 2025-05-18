-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read services
CREATE POLICY "Anyone can read services"
  ON public.services
  FOR SELECT
  USING (true);

-- Insert development data
INSERT INTO public.services (id, name, description, price, duration, image_url)
VALUES
  (
    '00000000-0000-4000-b000-000000000001',
    'Профилактичен преглед',
    'Редовен преглед за поддържане на здравето на зъбите',
    50,
    30,
    '/placeholder.svg'
  ),
  (
    '00000000-0000-4000-b000-000000000002',
    'Поставяне на имплант',
    'Възстановяване на липсващи зъби с импланти',
    1200,
    120,
    '/placeholder.svg'
  ),
  (
    '00000000-0000-4000-b000-000000000003',
    'Лечение на кариес',
    'Премахване на кариес и възстановяване на зъба',
    80,
    60,
    '/placeholder.svg'
  ),
  (
    '00000000-0000-4000-b000-000000000004',
    'Професионално избелване',
    'Процедура за избелване на зъбите',
    250,
    90,
    '/placeholder.svg'
  ),
  (
    '00000000-0000-4000-b000-000000000005',
    'Ортодонтско лечение',
    'Корекция на зъбни деформации с брекети',
    3000,
    180,
    '/placeholder.svg'
  ),
  (
    '00000000-0000-4000-b000-000000000006',
    'Професионално почистване',
    'Премахване на зъбен камък и полиране',
    100,
    60,
    '/placeholder.svg'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  image_url = EXCLUDED.image_url; 