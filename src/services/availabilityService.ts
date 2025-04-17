
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export const availabilityService = {
  // Get availability for a dentist
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      // Mock data for demo
      const mockAvailability: DentistAvailability[] = [
        {
          id: "1",
          dentistId,
          dayOfWeek: 1, // Monday
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        },
        {
          id: "2",
          dentistId,
          dayOfWeek: 2, // Tuesday
          startTime: "10:00",
          endTime: "18:00",
          isAvailable: true
        },
        {
          id: "3",
          dentistId,
          dayOfWeek: 3, // Wednesday
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        }
      ];
      
      return mockAvailability;
    } catch (error) {
      console.error('Error fetching dentist availability:', error);
      return []; // Return empty array on error
    }
  },

  // Set availability for a dentist
  setDentistAvailability: async (availability: Omit<DentistAvailability, 'id'>): Promise<string> => {
    try {
      // Mock success for demo
      const newId = Math.random().toString(36).substring(2, 15);
      toast.success('Наличността е зададена успешно');
      return newId;
    } catch (error) {
      console.error('Error setting dentist availability:', error);
      toast.error('Грешка при задаване на наличност');
      throw error;
    }
  },

  // Update availability
  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      // Mock success for demo
      toast.success('Наличността е обновена успешно');
      return;
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Грешка при обновяване на наличност');
      throw error;
    }
  },

  // Delete availability
  deleteAvailability: async (id: string): Promise<void> => {
    try {
      // Mock success for demo
      toast.success('Наличността е изтрита успешно');
      return;
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Грешка при изтриване на наличност');
      throw error;
    }
  },
};
