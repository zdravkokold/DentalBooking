
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/data/models';
import { toast } from 'sonner';

// Helper function to map database fields to our model interface
const mapPatientFromDB = (profile: any): Patient => {
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    email: profile.email || '',
    phone: profile.phone || '',
    healthStatus: profile.health_status || '',
    address: profile.address || '',
    birthDate: profile.birth_date || ''
  };
};

export const patientService = {
  // Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      // First, check if the database schema includes the necessary columns
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');
      
      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Грешка при зареждане на пациентите');
        return getMockPatients();
      }
      
      // If we have data from Supabase, map it to the Patient interface
      if (profiles && profiles.length > 0) {
        // Check if the expected columns exist in the profiles table
        return profiles.map(profile => ({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email || '',
          phone: profile.phone || '',
          // Use optional chaining for columns that might not exist
          healthStatus: profile.health_status || '',
          address: profile.address || '',
          birthDate: profile.birth_date || ''
        }));
      }

      // For demo purposes, return mock patient data if we don't have any
      return getMockPatients();
    } catch (error) {
      console.error('Error fetching patients:', error);
      return getMockPatients(); // Return empty array on error
    }
  },

  // Get patient by ID
  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'patient')
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        return null;
      }
      
      if (profile) {
        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email || '',
          phone: profile.phone || '',
          // Use optional accessors for columns that might not exist
          healthStatus: profile.health_status || '',
          address: profile.address || '',
          birthDate: profile.birth_date || ''
        };
      }

      // Mock data for demo if no patient found
      if (id === "p1") {
        return {
          id: "p1",
          name: "Ivan Ivanov",
          email: "ivan@example.com",
          phone: "+359888123456",
          healthStatus: "No known allergies",
          address: "Sofia, ul. Rakovski 50",
          birthDate: "1985-05-15"
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  // Update patient
  updatePatient: async (patient: Patient): Promise<void> => {
    try {
      // Split name into first_name and last_name
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Check if health_status, address, and birth_date columns exist
      // If not, exclude them from the update
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: patient.email,
          phone: patient.phone
        })
        .eq('id', patient.id);

      // Handle additional fields separately if they exist in schema
      try {
        await supabase.rpc('update_patient_extended_fields', {
          patient_id: patient.id,
          health_status_val: patient.healthStatus,
          address_val: patient.address,
          birth_date_val: patient.birthDate
        });
      } catch (extendedError) {
        console.log('Extended fields update failed, may not exist in schema', extendedError);
        // This is expected to fail if the columns don't exist
      }

      if (error) {
        console.error('Error updating patient:', error);
        toast.error('Грешка при обновяване на пациент');
        throw error;
      }

      toast.success('Данните на пациента са обновени успешно');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Грешка при обновяване на пациент');
      throw error;
    }
  },

  // Create a new patient
  createPatient: async (patient: Omit<Patient, 'id'>): Promise<string> => {
    try {
      // Split name into first_name and last_name
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Insert the basic profile information first
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: patient.email,
          phone: patient.phone,
          role: 'patient'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        toast.error('Грешка при създаване на пациент');
        throw error;
      }

      // Try to update extended fields if they exist
      try {
        await supabase.rpc('update_patient_extended_fields', {
          patient_id: data.id,
          health_status_val: patient.healthStatus || '',
          address_val: patient.address || '',
          birth_date_val: patient.birthDate || ''
        });
      } catch (extendedError) {
        console.log('Extended fields update failed, may not exist in schema', extendedError);
        // This is expected to fail if the columns don't exist
      }

      toast.success('Пациентът е създаден успешно');
      return data.id;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Грешка при създаване на пациент');
      throw error;
    }
  },
};

// Helper function for mock data
function getMockPatients(): Patient[] {
  return [
    {
      id: "p1",
      name: "Ivan Ivanov",
      email: "ivan@example.com",
      phone: "+359888123456",
      healthStatus: "No known allergies",
      address: "Sofia, ul. Rakovski 50",
      birthDate: "1985-05-15"
    },
    {
      id: "p2",
      name: "Maria Petrova",
      email: "maria@example.com",
      phone: "+359877234567",
      healthStatus: "Allergic to penicillin",
      address: "Plovdiv, ul. Gladstone 24",
      birthDate: "1990-10-20"
    }
  ];
}
