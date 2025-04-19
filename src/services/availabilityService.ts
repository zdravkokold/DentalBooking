
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export const availabilityService = {
  // Get availability for a dentist
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      // Implement with actual Supabase query
      // This would be a real implementation
      const { data, error } = await supabase
        .from('dentist_availabilities') // Make sure this table exists in your Supabase
        .select('*')
        .eq('dentist_id', dentistId);
      
      if (error) {
        console.error('Error fetching dentist availability:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
      
      // If no data found, return mock data for now
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
      toast.error('Грешка при зареждане на наличността на зъболекаря');
      return []; // Return empty array on error
    }
  },

  // Set availability for a dentist
  setDentistAvailability: async (availability: Omit<DentistAvailability, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('dentist_availabilities')
        .insert(availability)
        .select()
        .single();

      if (error) {
        console.error('Error setting dentist availability:', error);
        toast.error('Грешка при задаване на наличност');
        throw error;
      }

      toast.success('Наличността е зададена успешно');
      return data.id;
    } catch (error) {
      console.error('Error setting dentist availability:', error);
      toast.error('Грешка при задаване на наличност');
      throw error;
    }
  },

  // Update availability
  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      const { error } = await supabase
        .from('dentist_availabilities')
        .update({
          day_of_week: availability.dayOfWeek,
          start_time: availability.startTime,
          end_time: availability.endTime,
          is_available: availability.isAvailable
        })
        .eq('id', availability.id);

      if (error) {
        console.error('Error updating availability:', error);
        toast.error('Грешка при обновяване на наличност');
        throw error;
      }

      toast.success('Наличността е обновена успешно');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Грешка при обновяване на наличност');
      throw error;
    }
  },

  // Delete availability
  deleteAvailability: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('dentist_availabilities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting availability:', error);
        toast.error('Грешка при изтриване на наличност');
        throw error;
      }

      toast.success('Наличността е изтрита успешно');
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Грешка при изтриване на наличност');
      throw error;
    }
  },
};
