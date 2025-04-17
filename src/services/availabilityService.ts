
import { supabase } from '@/integrations/supabase/client';
import { DentistAvailability } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export const availabilityService = {
  // Get availability for a dentist
  getDentistAvailability: async (dentistId: string): Promise<DentistAvailability[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_dentist_availability', { dentist_id_param: dentistId });

      if (error) {
        toast.error('Грешка при зареждане на наличност: ' + error.message);
        throw error;
      }

      // If no data returned, return empty array
      if (!data) return [];

      // Map the data to the expected format
      return data.map((item: any) => ({
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
        .or(`time.gte.${availability.startTime},time.lte.${availability.endTime}`);

      if (appointmentsError) {
        toast.error('Грешка при проверка на конфликти: ' + appointmentsError.message);
        throw appointmentsError;
      }

      if (appointments && appointments.length > 0) {
        toast.warning('Има съществуващи записвания в този период. Моля изберете друго време.');
        throw new Error('Conflict with existing appointments');
      }

      // Insert new availability using stored procedure
      const { data, error } = await supabase
        .rpc('create_dentist_availability', {
          dentist_id_param: availability.dentistId,
          day_of_week_param: availability.dayOfWeek,
          start_time_param: availability.startTime,
          end_time_param: availability.endTime,
          is_available_param: availability.isAvailable
        });

      if (error) {
        toast.error('Грешка при задаване на наличност: ' + error.message);
        throw error;
      }

      toast.success('Наличността е зададена успешно');
      return data;
    } catch (error) {
      console.error('Error setting dentist availability:', error);
      throw error;
    }
  },

  // Update availability
  updateAvailability: async (availability: DentistAvailability): Promise<void> => {
    try {
      const { error } = await supabase
        .rpc('update_dentist_availability', {
          id_param: availability.id,
          day_of_week_param: availability.dayOfWeek,
          start_time_param: availability.startTime,
          end_time_param: availability.endTime,
          is_available_param: availability.isAvailable
        });

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
        .rpc('delete_dentist_availability', { id_param: id });

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
