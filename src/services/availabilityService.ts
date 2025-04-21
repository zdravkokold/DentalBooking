
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

// Define expected database schema
interface DbAvailability {
  id: string;
  dentist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// Helper function to map database fields to our model interface
const mapAvailabilityFromDB = (dbAvailability: DbAvailability): DentistAvailability => {
  return {
    id: dbAvailability.id,
    dentistId: dbAvailability.dentist_id,
    dayOfWeek: dbAvailability.day_of_week,
    startTime: dbAvailability.start_time,
    endTime: dbAvailability.end_time,
    isAvailable: dbAvailability.is_available
  };
};

export const availabilityService = {
  // Get availability for a dentist
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      // Check if the table exists first by trying a query
      const { data, error } = await supabase
        .from('dentist_availabilities')
        .select('*')
        .eq('dentist_id', dentistId);
      
      if (error) {
        console.error('Error fetching dentist availability:', error);
        // If there's an error, use mock data for now
        return getMockAvailability(dentistId);
      }
      
      if (data && data.length > 0) {
        return data.map((item: DbAvailability) => mapAvailabilityFromDB(item));
      }
      
      // If no data found, return mock data
      return getMockAvailability(dentistId);
    } catch (error) {
      console.error('Error fetching dentist availability:', error);
      toast.error('Грешка при зареждане на наличността на зъболекаря');
      return getMockAvailability(dentistId);
    }
  },

  // Set availability for a dentist
  setDentistAvailability: async (availability: Omit<DentistAvailability, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('dentist_availabilities')
        .insert({
          dentist_id: availability.dentistId,
          day_of_week: availability.dayOfWeek,
          start_time: availability.startTime,
          end_time: availability.endTime,
          is_available: availability.isAvailable
        })
        .select()
        .single();

      if (error) {
        console.error('Error setting dentist availability:', error);
        toast.error('Грешка при задаване на наличност');
        throw error;
      }

      toast.success('Наличността е зададена успешно');
      return data?.id || 'mock-id';
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

// Helper function to get mock availability data
function getMockAvailability(dentistId: string): DentistAvailability[] {
  return [
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
}
