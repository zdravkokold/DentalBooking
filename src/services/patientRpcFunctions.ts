
import { supabase } from '@/integrations/supabase/client';

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
    // First try the RPC function if it exists
    const { error } = await supabase.rpc('update_patient_extended_fields', {
      patient_id: patientId,
      health_status_val: healthStatus || '',
      address_val: address || '',
      birth_date_val: birthDate || ''
    });

    if (error) {
      // If RPC fails, fall back to direct update with try-catch for each field
      console.log('Using fallback method for patient extended fields');
      
      // Try updating health_status
      try {
        await supabase
          .from('profiles')
          .update({ health_status: healthStatus })
          .eq('id', patientId);
      } catch (e) {
        console.log('health_status column may not exist:', e);
      }

      // Try updating address
      try {
        await supabase
          .from('profiles')
          .update({ address: address })
          .eq('id', patientId);
      } catch (e) {
        console.log('address column may not exist:', e);
      }

      // Try updating birth_date
      try {
        await supabase
          .from('profiles')
          .update({ birth_date: birthDate })
          .eq('id', patientId);
      } catch (e) {
        console.log('birth_date column may not exist:', e);
      }
    }
  } catch (error) {
    console.error('Error updating extended fields:', error);
  }
}
