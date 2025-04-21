
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';

// Use database-generated types from Supabase
import type { Database } from '@/integrations/supabase/types';

type DentistAvailabilitiesRow = Database['public']['Tables']['dentist_availabilities']['Row'];
type DentistAvailabilitiesInsert = Database['public']['Tables']['dentist_availabilities']['Insert'];
type DentistAvailabilitiesUpdate = Database['public']['Tables']['dentist_availabilities']['Update'];

const mapAvailabilityFromDB = (dbAvailability: DentistAvailabilitiesRow): DentistAvailability => ({
  id: dbAvailability.id,
  dentistId: dbAvailability.dentist_id,
  dayOfWeek: dbAvailability.day_of_week,
  startTime: dbAvailability.start_time,
  endTime: dbAvailability.end_time,
  isAvailable: dbAvailability.is_available,
});

export const availabilityService = {
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      const { data, error } = await supabase
        .from('dentist_availabilities')
        .select('*')
        .eq('dentist_id', dentistId);

      if (error) {
        console.error('Error fetching dentist availability:', error);
        return getMockAvailability(dentistId);
      }

      if (data && data.length > 0) {
        return data.map((item) => mapAvailabilityFromDB(item));
      }

      return getMockAvailability(dentistId);
    } catch (error) {
      console.error('Error fetching dentist availability:', error);
      toast.error('Грешка при зареждане на наличността на зъболекаря');
      return getMockAvailability(dentistId);
    }
  },

  setDentistAvailability: async (availability: Omit<DentistAvailability, 'id'>): Promise<string> => {
    try {
      const insertData: DentistAvailabilitiesInsert = {
        dentist_id: availability.dentistId,
        day_of_week: availability.dayOfWeek,
        start_time: availability.startTime,
        end_time: availability.endTime,
        is_available: availability.isAvailable,
      };
      const { data, error } = await supabase
        .from('dentist_availabilities')
        .insert(insertData)
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

  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      const updateData: DentistAvailabilitiesUpdate = {
        day_of_week: availability.dayOfWeek,
        start_time: availability.startTime,
        end_time: availability.endTime,
        is_available: availability.isAvailable,
      };
      const { error } = await supabase
        .from('dentist_availabilities')
        .update(updateData)
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

function getMockAvailability(dentistId: string): DentistAvailability[] {
  return [
    { id: "1", dentistId, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true },
    { id: "2", dentistId, dayOfWeek: 2, startTime: "10:00", endTime: "18:00", isAvailable: true },
    { id: "3", dentistId, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isAvailable: true }
  ];
}
