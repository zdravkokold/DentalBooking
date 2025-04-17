
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export const availabilityService = {
  // Get availability for a dentist
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      const { data, error } = await supabase
        .from('dentist_availability')
        .select('*')
        .eq('dentist_id', dentistId);

      if (error) {
        toast.error('Грешка при зареждане на наличност: ' + error.message);
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        dentistId: item.dentist_id,
        dayOfWeek: item.day_of_week,
        startTime: item.start_time,
        endTime: item.end_time,
        isAvailable: item.is_available,
      }));
    } catch (error) {
      console.error('Error fetching dentist availability:', error);
      throw error;
    }
  },

  // Set availability for a dentist
  setDentistAvailability: async (availability: Omit<DentistAvailability, 'id'>): Promise<string> => {
    try {
      // Check for conflicts with existing appointments
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + ((availability.dayOfWeek + 7 - appointmentDate.getDay()) % 7));
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');

      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', availability.dentistId)
        .eq('date', formattedDate)
        .or(`start_time.gte.${availability.startTime},end_time.lte.${availability.endTime}`);

      if (appointmentsError) {
        toast.error('Грешка при проверка на конфликти: ' + appointmentsError.message);
        throw appointmentsError;
      }

      if (appointments && appointments.length > 0) {
        toast.warning('Има съществуващи записвания в този период. Моля изберете друго време.');
        throw new Error('Conflict with existing appointments');
      }

      // Insert new availability
      const { data, error } = await supabase
        .from('dentist_availability')
        .insert({
          dentist_id: availability.dentistId,
          day_of_week: availability.dayOfWeek,
          start_time: availability.startTime,
          end_time: availability.endTime,
          is_available: availability.isAvailable,
        })
        .select()
        .single();

      if (error) {
        toast.error('Грешка при задаване на наличност: ' + error.message);
        throw error;
      }

      toast.success('Наличността е зададена успешно');
      return data.id;
    } catch (error) {
      console.error('Error setting dentist availability:', error);
      throw error;
    }
  },

  // Update availability
  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      const { error } = await supabase
        .from('dentist_availability')
        .update({
          day_of_week: availability.dayOfWeek,
          start_time: availability.startTime,
          end_time: availability.endTime,
          is_available: availability.isAvailable,
        })
        .eq('id', availability.id);

      if (error) {
        toast.error('Грешка при обновяване на наличност: ' + error.message);
        throw error;
      }

      toast.success('Наличността е обновена успешно');
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },

  // Delete availability
  deleteAvailability: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('dentist_availability')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Грешка при изтриване на наличност: ' + error.message);
        throw error;
      }

      toast.success('Наличността е изтрита успешно');
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    }
  },
};
