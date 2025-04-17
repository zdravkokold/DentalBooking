
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/data/models';
import { toast } from 'sonner';

export const patientService = {
  // Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      // For demo purposes, return mock patient data
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
      
      /* Commented out the real implementation until database is ready
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, health_status, address, birth_date')
        .eq('role', 'patient');

      if (error) {
        toast.error('Грешка при зареждане на пациенти: ' + error.message);
        throw error;
      }

      if (!data) return [];

      // Map the returned data to the Patient interface
      return data.map(profile => ({
        id: profile.id || '',
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || '',
        phone: profile.phone || '',
        healthStatus: profile.health_status || '',
        address: profile.address || '',
        birthDate: profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : undefined,
      }));
      */
    } catch (error) {
      console.error('Error fetching patients:', error);
      return []; // Return empty array on error
    }
  },

  // Get patient by ID
  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      // Mock data for demo
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
      
      /* Commented out the real implementation until database is ready
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, health_status, address, birth_date')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        toast.error('Грешка при зареждане на пациент: ' + error.message);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id || '',
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email || '',
        phone: data.phone || '',
        healthStatus: data.health_status || '',
        address: data.address || '',
        birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : undefined,
      };
      */
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  // Update patient
  updatePatient: async (patient: Patient): Promise<void> => {
    try {
      // Mock success for demo
      toast.success('Данните на пациента са обновени успешно');
      return;
      
      /* Commented out the real implementation until database is ready
      const names = patient.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: patient.email,
          phone: patient.phone,
          health_status: patient.healthStatus,
          address: patient.address,
          birth_date: patient.birthDate,
        })
        .eq('id', patient.id);

      if (error) {
        toast.error('Грешка при обновяване на пациент: ' + error.message);
        throw error;
      }

      toast.success('Данните на пациента са обновени успешно');
      */
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Грешка при обновяване на пациент');
      throw error;
    }
  },

  // Create a new patient
  createPatient: async (patient: Omit<Patient, 'id'>): Promise<string> => {
    try {
      // Mock ID for demo
      const newId = "p" + Math.floor(Math.random() * 1000);
      toast.success('Пациентът е създаден успешно');
      return newId;
      
      /* Commented out the real implementation until database is ready
      const names = patient.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      // Generate a random email if not provided
      const email = patient.email || `patient-${Math.random().toString(36).substring(2, 15)}@example.com`;
      
      // Register the user with a random password first
      const password = Math.random().toString(36).substring(2, 15);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'patient',
            phone: patient.phone,
            health_status: patient.healthStatus,
            address: patient.address,
            birth_date: patient.birthDate,
          }
        }
      });

      if (authError) {
        toast.error('Грешка при създаване на пациент: ' + authError.message);
        throw authError;
      }

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('Не беше създаден потребителски идентификатор');
      }

      toast.success('Пациентът е създаден успешно');
      return userId;
      */
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Грешка при създаване на пациент');
      throw error;
    }
  },
};
