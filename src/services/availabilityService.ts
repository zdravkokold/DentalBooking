
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
      
      /* Commented out the real implementation until database is working
      const { data, error } = await supabase.rpc('get_dentist_availability', { 
        dentist_id_param: dentistId 
      });

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
      */
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
      
      /* Commented out the real implementation until database is working
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
      */
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
      
      /* Commented out the real implementation until database is working
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
      */
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
      
      /* Commented out the real implementation until database is working
      const { error } = await supabase
        .rpc('delete_dentist_availability', { id_param: id });

      if (error) {
        toast.error('Грешка при изтриване на наличност: ' + error.message);
        throw error;
      }

      toast.success('Наличността е изтрита успешно');
      */
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Грешка при изтриване на наличност');
      throw error;
    }
  },
};
