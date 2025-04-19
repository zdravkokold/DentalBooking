
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/data/models';
import { toast } from 'sonner';

export const patientService = {
  // Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');
      
      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Грешка при зареждане на пациентите');
        throw error;
      }
      
      // If we have data from Supabase, format it to match the Patient interface
      if (data && data.length > 0) {
        return data.map((profile: any) => ({
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`.trim(),
          email: profile.email,
          phone: profile.phone,
          healthStatus: profile.health_status || '',
          address: profile.address || '',
          birthDate: profile.birth_date || ''
        }));
      }

      // For demo purposes, return mock patient data if we don't have any
      const mockPatients: Patient[] = [
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
      
      return mockPatients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return []; // Return empty array on error
    }
  },

  // Get patient by ID
  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'patient')
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          name: `${data.first_name} ${data.last_name}`.trim(),
          email: data.email,
          phone: data.phone,
          healthStatus: data.health_status || '',
          address: data.address || '',
          birthDate: data.birth_date || ''
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

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: patient.email,
          phone: patient.phone,
          health_status: patient.healthStatus,
          address: patient.address,
          birth_date: patient.birthDate
        })
        .eq('id', patient.id);

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

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: patient.email,
          phone: patient.phone,
          health_status: patient.healthStatus,
          address: patient.address,
          birth_date: patient.birthDate,
          role: 'patient'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        toast.error('Грешка при създаване на пациент');
        throw error;
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
