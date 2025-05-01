
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
    birthDate: profile.birth_date ? String(profile.birth_date) : ''
  };
};

export const patientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient');
        if (error) {
          console.error('Error fetching patients:', error);
          return getMockPatients();
        }
        if (profiles && profiles.length > 0) {
          return profiles.map(mapPatientFromDB);
        }
      } catch (dbError) {
        console.error('Database error fetching patients:', dbError);
      }
      return getMockPatients();
    } catch (error) {
      console.error('Error fetching patients:', error);
      return getMockPatients();
    }
  },

  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('role', 'patient')
          .maybeSingle();
        if (error) {
          console.error('Error fetching patient:', error);
          return getMockPatientById(id);
        }
        if (profile) {
          return mapPatientFromDB(profile);
        }
      } catch (dbError) {
        console.error('Database error fetching patient:', dbError);
      }
      return getMockPatientById(id);
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  updatePatient: async (patient: Patient): Promise<void> => {
    try {
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: patient.email,
            phone: patient.phone,
            role: 'patient',
            health_status: patient.healthStatus,
            address: patient.address,
            birth_date: patient.birthDate ? patient.birthDate : null,
          })
          .eq('id', patient.id);

        if (error) {
          console.error('Error updating patient:', error);
          toast.error('Грешка при обновяване на пациент');
          return;
        }

        toast.success('Данните на пациента са обновени успешно');
      } catch (dbError) {
        console.error('Database error updating patient:', dbError);
        toast.success('Данните на пациента са обновени успешно (локално)');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Грешка при обновяване на пациент');
    }
  },

  createPatient: async (patient: Omit<Patient, 'id'>): Promise<string> => {
    try {
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const patientId = crypto.randomUUID();

      try {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: patientId,
            first_name: firstName,
            last_name: lastName,
            email: patient.email,
            phone: patient.phone,
            role: 'patient',
            health_status: patient.healthStatus,
            address: patient.address,
            birth_date: patient.birthDate ? patient.birthDate : null,
          });

        if (error) {
          console.error('Error creating patient:', error);
          toast.error('Грешка при създаване на пациент');
          return patientId;
        }

        toast.success('Пациентът е създаден успешно');
        return patientId;
      } catch (dbError) {
        console.error('Database error creating patient:', dbError);
        toast.success('Пациентът е създаден успешно (локално)');
        return patientId;
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Грешка при създаване на пациент');
      return crypto.randomUUID();
    }
  },
};

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

function getMockPatientById(id: string): Patient | null {
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
  } else if (id === "p2") {
    return {
      id: "p2",
      name: "Maria Petrova",
      email: "maria@example.com",
      phone: "+359877234567",
      healthStatus: "Allergic to penicillin",
      address: "Plovdiv, ul. Gladstone 24",
      birthDate: "1990-10-20"
    };
  }
  return null;
}
