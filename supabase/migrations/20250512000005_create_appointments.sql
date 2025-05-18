-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dentist_id UUID REFERENCES public.dentists(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT appointments_time_check CHECK (end_time > start_time)
);

-- Add RLS policies
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow patients to read and create their own appointments
CREATE POLICY "Patients can manage their own appointments"
  ON public.appointments
  FOR ALL
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Allow dentists to read and update appointments they are assigned to
CREATE POLICY "Dentists can manage their assigned appointments"
  ON public.appointments
  FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM public.dentists WHERE id = dentist_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.dentists WHERE id = dentist_id
  )); 