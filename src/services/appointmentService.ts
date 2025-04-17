
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentHistory, Report, AppointmentStatus } from '@/data/models';
import { toast } from 'sonner';
import { format } from 'date-fns';

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

      if (!data) return [];

      // Map the returned data to the Appointment interface
      return data.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        dentistId: appointment.dentist_id,
        serviceId: appointment.service_id,
        date: appointment.date,
        startTime: appointment.time,
        endTime: calculateEndTime(appointment.time, 60), // Default to 60 min if we don't have service duration
        status: appointment.status as AppointmentStatus,
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

      if (!data) return [];

      // Map the returned data to the Appointment interface
      return data.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id,
        dentistId: appointment.dentist_id,
        serviceId: appointment.service_id,
        date: appointment.date,
        startTime: appointment.time,
        endTime: calculateEndTime(appointment.time, 60), // Default to 60 min
        status: appointment.status as AppointmentStatus,
        notes: appointment.notes || '',
        createdAt: appointment.created_at
      }));
    } catch (error) {
      console.error('Error fetching dentist appointments:', error);
      throw error;
    }
  },

  // Get appointment history with optional filters
  getAppointmentHistory: async (filters?: {
    patientId?: string;
    dentistId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } | 'week' | 'month' | 'all'): Promise<AppointmentHistory[]> => {
    try {
      // Handle period shortcuts
      let actualFilters: {
        patientId?: string;
        dentistId?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      } = {};
      
      if (filters === 'week') {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        actualFilters = {
          startDate: format(startOfWeek, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd')
        };
      } else if (filters === 'month') {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        actualFilters = {
          startDate: format(startOfMonth, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd')
        };
      } else if (filters && filters !== 'all') {
        actualFilters = filters;
      }
      
      // For demo without actual database data
      const mockAppointmentHistories: AppointmentHistory[] = [
        {
          appointment: {
            id: "1",
            patientId: "p1",
            dentistId: "d1",
            serviceId: "s1",
            date: new Date().toISOString(),
            startTime: "10:00",
            endTime: "11:00",
            status: "completed",
            notes: "Patient arrived on time",
            createdAt: new Date().toISOString()
          },
          patient: {
            id: "p1",
            name: "Ivan Ivanov",
            email: "ivan@example.com",
            phone: "+359888123456",
            healthStatus: "No allergies"
          },
          dentist: {
            id: "d1",
            name: "Dr. Petrov",
            specialization: "Orthodontist",
            imageUrl: "/placeholder.svg",
            bio: "Experienced orthodontist",
            rating: 4.8,
            yearsOfExperience: 15,
            education: "Medical University Sofia",
            languages: ["Bulgarian", "English"]
          },
          service: {
            id: "s1",
            name: "Dental Cleaning",
            description: "Professional teeth cleaning",
            price: 100,
            duration: 60,
            imageUrl: "/placeholder.svg"
          }
        }
      ];
      
      // Return mock data for now as the database query isn't working
      return mockAppointmentHistories;
      
      /* Commented out the real implementation until database is ready
      // Build query with filters
      let query = supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_patient_id_fkey(*),
          dentists!appointments_dentist_id_fkey(*),
          services!appointments_service_id_fkey(*)
        `)
        .order('date', { ascending: false });

      // Apply filters
      if (actualFilters) {
        if (actualFilters.patientId) {
          query = query.eq('patient_id', actualFilters.patientId);
        }
        if (actualFilters.dentistId) {
          query = query.eq('dentist_id', actualFilters.dentistId);
        }
        if (actualFilters.status) {
          query = query.eq('status', actualFilters.status);
        }
        if (actualFilters.startDate) {
          query = query.gte('date', actualFilters.startDate);
        }
        if (actualFilters.endDate) {
          query = query.lte('date', actualFilters.endDate);
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
        return {
          appointment: {
            id: item.id,
            patientId: item.patient_id,
            dentistId: item.dentist_id,
            serviceId: item.service_id,
            date: item.date,
            startTime: item.time,
            endTime: calculateEndTime(item.time, item.services?.duration || 60),
            status: item.status as AppointmentStatus,
            notes: item.notes || '',
            createdAt: item.created_at
          },
          patient: {
            id: item.profiles.id,
            name: `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim(),
            email: item.profiles.email || '',
            phone: item.profiles.phone || '',
            healthStatus: item.profiles.health_status || '',
          },
          dentist: {
            id: item.dentists.id,
            name: "Dr. " + item.dentists.name || '',
            specialization: item.dentists.specialization || '',
            imageUrl: "/placeholder.svg",
            bio: item.dentists.bio || '',
            rating: 4.5, // Default rating
            yearsOfExperience: item.dentists.years_of_experience || 0,
            education: "Medical University",
            languages: ["Bulgarian", "English"]
          },
          service: {
            id: item.services.id,
            name: item.services.name || '',
            description: item.services.description || '',
            price: item.services.price || 0,
            duration: item.services.duration || 0,
            imageUrl: "/placeholder.svg"
          }
        };
      });
      */
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      return []; // Return empty array on error
    }
  },
  
  // Generate report
  generateReport: async (startDate: string, endDate: string): Promise<Report> => {
    try {
      // For demo, return mock report data
      return {
        startDate,
        endDate,
        totalAppointments: 45,
        completedAppointments: 30,
        cancelledAppointments: 5,
        patientCount: 25
      };
      
      /* Commented out the real implementation until database is ready
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        toast.error('Грешка при генериране на справка: ' + error.message);
        throw error;
      }

      if (!appointments) {
        return {
          startDate,
          endDate,
          totalAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          patientCount: 0
        };
      }

      // Get unique patient count
      const uniquePatients = new Set(appointments.map(a => a.patient_id)).size;

      return {
        startDate,
        endDate,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
        patientCount: uniquePatients
      };
      */
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Грешка при генериране на справка');
      throw error;
    }
  }
};

// Helper function to calculate end time based on start time and duration
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes + durationMinutes);
  return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
};
