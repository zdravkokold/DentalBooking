import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentHistory } from '@/data/models';
import { toast } from 'sonner';

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        toast.error('Грешка при зареждане на записванията: ' + error.message);
        throw error;
      }

      // Map the returned data to the Appointment interface
      return data.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        dentistId: appointment.dentist_id,
        serviceId: appointment.service_id,
        date: appointment.date,
        startTime: appointment.time, // assuming time field represents startTime
        endTime: '', // This would need to be calculated based on the service duration
        status: appointment.status as "scheduled" | "completed" | "cancelled",
        notes: appointment.notes || '',
        createdAt: appointment.created_at
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointments for a specific dentist
  getDentistAppointments: async (dentistId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId)
        .order('date', { ascending: true });

      if (error) {
        toast.error('Грешка при зареждане на записванията: ' + error.message);
        throw error;
      }

      // Map the returned data to the Appointment interface
      return data.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        dentistId: appointment.dentist_id,
        serviceId: appointment.service_id,
        date: appointment.date,
        startTime: appointment.time, // assuming time field represents startTime
        endTime: '', // This would need to be calculated based on the service duration
        status: appointment.status as "scheduled" | "completed" | "cancelled",
        notes: appointment.notes || '',
        createdAt: appointment.created_at
      }));
    } catch (error) {
      console.error('Error fetching dentist appointments:', error);
      throw error;
    }
  },

  // Get appointment history
  getAppointmentHistory: async (filters?: {
    patientId?: string;
    dentistId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AppointmentHistory[]> => {
    try {
      // Build query with filters
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id(id, first_name, last_name, email, phone, health_status),
          dentist:dentist_id(id, profile_id, specialization, bio, years_of_experience),
          service:service_id(id, name, description, price, duration)
        `)
        .order('date', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.patientId) {
          query = query.eq('patient_id', filters.patientId);
        }
        if (filters.dentistId) {
          query = query.eq('dentist_id', filters.dentistId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.startDate) {
          query = query.gte('date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('date', filters.endDate);
        }
      }

      const { data, error } = await query;

      if (error) {
        toast.error('Грешка при зареждане на историята: ' + error.message);
        throw error;
      }

      // Handle the case where data might be empty
      if (!data || data.length === 0) {
        return [];
      }

      // Map the returned data to the AppointmentHistory interface
      return data.map(item => {
        const patientData = item.patient || {};
        const dentistData = item.dentist || {};
        const serviceData = item.service || {};

        return {
          appointment: {
            id: item.id,
            patientId: item.patient_id,
            dentistId: item.dentist_id,
            serviceId: item.service_id,
            date: item.date,
            startTime: item.time,
            endTime: '', // Calculate based on service duration and start time
            status: item.status as "scheduled" | "completed" | "cancelled",
            notes: item.notes || '',
            createdAt: item.created_at
          },
          patient: {
            id: patientData.id || '',
            name: `${patientData.first_name || ''} ${patientData.last_name || ''}`.trim(),
            email: patientData.email || '',
            phone: patientData.phone || '',
            healthStatus: patientData.health_status || '',
          },
          dentist: {
            id: dentistData.id || '',
            name: '', // This would need to be fetched from profiles using profile_id
            specialization: dentistData.specialization || '',
            experience: dentistData.years_of_experience || 0,
            bio: dentistData.bio || ''
          },
          service: {
            id: serviceData.id || '',
            name: serviceData.name || '',
            description: serviceData.description || '',
            price: serviceData.price || 0,
            duration: serviceData.duration || 0
          }
        };
      });
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      throw error;
    }
  },
  
  // Additional appointment methods would go here
};
