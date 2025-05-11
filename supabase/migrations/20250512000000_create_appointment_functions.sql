
-- Create appointment creation function to avoid RLS issues
CREATE OR REPLACE FUNCTION public.create_appointment(
  p_patient_id UUID,
  p_dentist_id UUID,
  p_service_id UUID,
  p_date DATE,
  p_time TIME,
  p_status TEXT DEFAULT 'scheduled'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_appointment_id UUID;
BEGIN
  INSERT INTO public.appointments (
    patient_id,
    dentist_id,
    service_id,
    date,
    time,
    status
  ) VALUES (
    p_patient_id,
    p_dentist_id,
    p_service_id,
    p_date,
    p_time,
    p_status
  )
  RETURNING id INTO v_appointment_id;

  RETURN v_appointment_id;
END;
$$;

-- Update the profiles table RLS policies if not already applied
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_is_user_profile') THEN
    -- Create a proper security definer function to safely check if a user is accessing their own profile
    CREATE FUNCTION public.check_is_user_profile(profile_id uuid)
    RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN profile_id = auth.uid();
    END;
    $$;
  END IF;
END $$;
