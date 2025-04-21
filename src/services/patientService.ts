
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/data/models';
import { toast } from 'sonner';
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Helper function to map database fields to our model interface
const mapPatientFromDB = (profile: ProfileRow): Patient => {
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
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');
      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Грешка при зареждане на пациентите');
        return getMockPatients();
      }
      if (profiles && profiles.length > 0) {
        return profiles.map(mapPatientFromDB);
      }
      return getMockPatients();
    } catch (error) {
      console.error('Error fetching patients:', error);
      return getMockPatients();
    }
  },

  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'patient')
        .maybeSingle();
      if (error) {
        console.error('Error fetching patient:', error);
        return null;
      }
      if (profile) {
        return mapPatientFromDB(profile);
      }
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

  updatePatient: async (patient: Patient): Promise<void> => {
    try {
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updateData: ProfileUpdate = {
        first_name: firstName,
        last_name: lastName,
        email: patient.email,
        phone: patient.phone,
        role: 'patient',
        health_status: patient.healthStatus,
        address: patient.address,
        birth_date: patient.birthDate ? patient.birthDate : null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
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

  createPatient: async (patient: Omit<Patient, 'id'>): Promise<string> => {
    try {
      const nameParts = patient.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const insertData: ProfileInsert = {
        id: crypto.randomUUID(),
        first_name: firstName,
        last_name: lastName,
        email: patient.email,
        phone: patient.phone,
        role: 'patient',
        health_status: patient.healthStatus,
        address: patient.address,
        birth_date: patient.birthDate ? patient.birthDate : null,
      };
      const { data, error } = await supabase
        .from('profiles')
        .insert(insertData)
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
