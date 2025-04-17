
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
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Грешка при създаване на пациент');
      throw error;
    }
  },
};
