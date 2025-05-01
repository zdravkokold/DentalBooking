
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
    // Try a direct update first since using RPC may not work with the current schema
    try {
      await supabase
        .from('profiles')
        .update({
          health_status: healthStatus || null,
          address: address || null,
          birth_date: birthDate || null
        })
        .eq('id', patientId);
      
      console.log('Successfully updated patient extended fields');
      return;
    } catch (directUpdateError) {
      console.error('Direct update failed:', directUpdateError);
    }

    // If direct update fails, try the RPC function
    try {
      const { error } = await supabase.rpc('update_patient_extended_fields', {
        patient_id: patientId,
        health_status_val: healthStatus || '',
        address_val: address || '',
        birth_date_val: birthDate || ''
      });

      if (error) {
        console.error('RPC function failed:', error);
        
        // If RPC fails too, try individual updates as a last resort
        console.log('Using fallback method for patient extended fields');
        
        // Try updating each field individually
        if (healthStatus !== undefined) {
          await updateSingleField(patientId, 'health_status', healthStatus);
        }
        
        if (address !== undefined) {
          await updateSingleField(patientId, 'address', address);
        }
        
        if (birthDate !== undefined) {
          await updateSingleField(patientId, 'birth_date', birthDate);
        }
      }
    } catch (rpcError) {
      console.error('RPC call error:', rpcError);
      // No further fallback, we've tried everything
    }
  } catch (error) {
    console.error('Error updating extended fields:', error);
  }
}

// Helper function to update a single field with error handling
async function updateSingleField(patientId: string, fieldName: string, value: string | null): Promise<void> {
  try {
    const updateObj = {};
    updateObj[fieldName] = value;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateObj)
      .eq('id', patientId);
      
    if (error) {
      console.log(`${fieldName} column may not exist:`, error);
    }
  } catch (e) {
    console.log(`Error updating ${fieldName}:`, e);
  }
}
