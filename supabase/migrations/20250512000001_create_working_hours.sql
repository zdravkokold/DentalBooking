-- Create working_hours table
CREATE TABLE IF NOT EXISTS public.working_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dentist_id UUID NOT NULL REFERENCES public.dentists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT working_hours_time_check CHECK (end_time > start_time)
);

-- Add RLS policies
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;

-- Allow dentists to manage their own working hours
CREATE POLICY "Dentists can manage their own working hours"
  ON public.working_hours
  FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM public.dentists WHERE id = dentist_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.dentists WHERE id = dentist_id
  ));

-- Allow anyone to read working hours
CREATE POLICY "Anyone can read working hours"
  ON public.working_hours
  FOR SELECT
  USING (true);

-- Add default working hours for existing dentists
INSERT INTO public.working_hours (dentist_id, day_of_week, start_time, end_time)
SELECT 
  d.id,
  dow.day,
  '09:00'::TIME,
  '17:00'::TIME
FROM public.dentists d
CROSS JOIN (
  SELECT unnest(ARRAY[1,2,3,4,5]) as day -- Monday to Friday
) dow
ON CONFLICT DO NOTHING; 