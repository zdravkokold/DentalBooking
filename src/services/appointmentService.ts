
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentHistory, Report } from '@/data/models';
import { toast } from 'sonner';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const appointmentService = {
  // Get appointments for a dentist
  getDentistAppointments: async (dentistId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        toast.error('Грешка при зареждане на часове: ' + error.message);
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        patientId: item.patient_id,
        dentistId: item.dentist_id,
        serviceId: item.service_id,
        date: item.date,
        startTime: item.time.split('-')[0].trim(),
        endTime: item.time.split('-')[1].trim(),
        status: item.status || 'scheduled',
        notes: item.notes,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error('Error fetching dentist appointments:', error);
      throw error;
    }
  },

  // Get appointments for a patient
  getPatientAppointments: async (patientId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        toast.error('Грешка при зареждане на часове: ' + error.message);
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        patientId: item.patient_id,
        dentistId: item.dentist_id,
        serviceId: item.service_id,
        date: item.date,
        startTime: item.time.split('-')[0].trim(),
        endTime: item.time.split('-')[1].trim(),
        status: item.status || 'scheduled',
        notes: item.notes,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  },

  // Get appointment history (with detailed information)
  getAppointmentHistory: async (period: 'week' | 'month' | 'all' = 'all'): Promise<AppointmentHistory[]> => {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          dentists:dentist_id(*),
          profiles:patient_id(id, first_name, last_name, email, phone, health_status),
          services:service_id(*)
        `)
        .order('date', { ascending: false });

      const now = new Date();
      
      // Filter by period if specified
      if (period === 'week') {
        const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
        const weekEnd = format(endOfWeek(now), 'yyyy-MM-dd');
        query = query.gte('date', weekStart).lte('date', weekEnd);
      } else if (period === 'month') {
        const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
        query = query.gte('date', monthStart).lte('date', monthEnd);
      }

      const { data, error } = await query;

      if (error) {
        toast.error('Грешка при зареждане на история: ' + error.message);
        throw error;
      }

      return data.map(item => {
        const dentist = item.dentists;
        const patient = item.profiles;
        const service = item.services;

        return {
          appointment: {
            id: item.id,
            patientId: item.patient_id,
            dentistId: item.dentist_id,
            serviceId: item.service_id,
            date: item.date,
            startTime: item.time.split('-')[0].trim(),
            endTime: item.time.split('-')[1].trim(),
            status: item.status || 'scheduled',
            notes: item.notes,
            createdAt: item.created_at,
          },
          patient: {
            id: patient.id,
            name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
            email: patient.email || '',
            phone: patient.phone || '',
            healthStatus: patient.health_status || '',
          },
          dentist: {
            id: dentist.id,
            name: dentist.name || '',
            specialization: dentist.specialization || '',
            imageUrl: '',
            bio: dentist.bio || '',
            rating: dentist.rating || 0,
            yearsOfExperience: dentist.years_of_experience || 0,
            education: '',
            languages: [],
          },
          service: {
            id: service.id,
            name: service.name || '',
            description: service.description || '',
            price: service.price || 0,
            duration: service.duration || 0,
            imageUrl: '',
          },
        };
      });
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, status: 'scheduled' | 'completed' | 'cancelled', notes?: string): Promise<void> => {
    try {
      const updateData: any = { status };
      if (notes) updateData.notes = notes;

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);

      if (error) {
        toast.error('Грешка при обновяване на статус: ' + error.message);
        throw error;
      }

      toast.success('Статусът е обновен успешно');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Generate reports
  generateReport: async (startDate: string, endDate: string): Promise<Report> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, status, patient_id')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        toast.error('Грешка при генериране на справка: ' + error.message);
        throw error;
      }

      // Count unique patients
      const patientIds = new Set<string>();
      let completedCount = 0;
      let cancelledCount = 0;

      data.forEach(appointment => {
        patientIds.add(appointment.patient_id);
        if (appointment.status === 'completed') completedCount++;
        if (appointment.status === 'cancelled') cancelledCount++;
      });

      return {
        startDate,
        endDate,
        totalAppointments: data.length,
        completedAppointments: completedCount,
        cancelledAppointments: cancelledCount,
        patientCount: patientIds.size,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
};
