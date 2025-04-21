
import { supabase } from '@/integrations/supabase/client';
import type { Database } from "@/integrations/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * This is a helper function that handles updating patient extended fields
 * It's designed to gracefully handle cases where columns don't exist in the database yet
 */
export async function updatePatientExtendedFields(
  patientId: string,
  healthStatus?: string,
  address?: string,
  birthDate?: string
): Promise<void> {
  try {
    // Try the RPC function if it exists
    const { error } = await supabase.rpc('update_patient_extended_fields', {
      patient_id: patientId,
      health_status_val: healthStatus || '',
      address_val: address || '',
      birth_date_val: birthDate || ''
    });

    if (error) {
      // If RPC fails, fall back to direct update for each field
      console.log('Using fallback method for patient extended fields');

      // Try updating health_status
      try {
        const healthUpdate: ProfileUpdate = { health_status: healthStatus };
        await supabase
          .from('profiles')
          .update(healthUpdate)
          .eq('id', patientId);
      } catch (e) {
        console.log('health_status column may not exist:', e);
      }

      // Try updating address
      try {
        const addressUpdate: ProfileUpdate = { address: address };
        await supabase
          .from('profiles')
          .update(addressUpdate)
          .eq('id', patientId);
      } catch (e) {
        console.log('address column may not exist:', e);
      }

      // Try updating birth_date
      try {
        const birthDateUpdate: ProfileUpdate = { birth_date: birthDate };
        await supabase
          .from('profiles')
          .update(birthDateUpdate)
          .eq('id', patientId);
      } catch (e) {
        console.log('birth_date column may not exist:', e);
      }
    }
  } catch (error) {
    console.error('Error updating extended fields:', error);
  }
}
