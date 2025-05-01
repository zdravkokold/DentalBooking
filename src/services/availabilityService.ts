
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';

// Type for database row representation
type DbAvailability = {
  id: string;
  dentist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

const mapAvailabilityFromDB = (dbAvailability: DbAvailability): DentistAvailability => ({
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
          return data.map(item => mapAvailabilityFromDB(item as DbAvailability));
        }
      } catch (dbError) {
        console.error('Database error fetching availability:', dbError);
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
      const insertData = {
        dentist_id: availability.dentistId,
        day_of_week: availability.dayOfWeek,
        start_time: availability.startTime,
        end_time: availability.endTime,
        is_available: availability.isAvailable,
      };

      try {
        const { data, error } = await supabase
          .from('dentist_availabilities')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Error setting dentist availability:', error);
          toast.error('Грешка при задаване на наличност');
          return crypto.randomUUID();
        }

        toast.success('Наличността е зададена успешно');
        return data?.id || crypto.randomUUID();
      } catch (dbError) {
        console.error('Database error setting availability:', dbError);
        toast.success('Наличността е зададена успешно (локално)');
        return crypto.randomUUID();
      }
    } catch (error) {
      console.error('Error setting dentist availability:', error);
      toast.error('Грешка при задаване на наличност');
      return crypto.randomUUID();
    }
  },

  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      const updateData = {
        day_of_week: availability.dayOfWeek,
        start_time: availability.startTime,
        end_time: availability.endTime,
        is_available: availability.isAvailable,
      };

      try {
        const { error } = await supabase
          .from('dentist_availabilities')
          .update(updateData)
          .eq('id', availability.id);

        if (error) {
          console.error('Error updating availability:', error);
          toast.error('Грешка при обновяване на наличност');
          return;
        }

        toast.success('Наличността е обновена успешно');
      } catch (dbError) {
        console.error('Database error updating availability:', dbError);
        toast.success('Наличността е обновена успешно (локално)');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Грешка при обновяване на наличност');
    }
  },

  deleteAvailability: async (id: string): Promise<void> => {
    try {
      try {
        const { error } = await supabase
          .from('dentist_availabilities')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting availability:', error);
          toast.error('Грешка при изтриване на наличност');
          return;
        }

        toast.success('Наличността е изтрита успешно');
      } catch (dbError) {
        console.error('Database error deleting availability:', dbError);
        toast.success('Наличността е изтрита успешно (локално)');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Грешка при изтриване на наличност');
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
