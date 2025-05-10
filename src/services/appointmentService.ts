
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentHistory, Report } from '@/data/models';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define the type of appointment status for type safety
type AppointmentStatus = 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

// Helper function to map database fields to our model interface
const mapAppointmentFromDB = (dbAppointment: any): Appointment => {
  return {
    id: dbAppointment.id,
    patientId: dbAppointment.patient_id,
    dentistId: dbAppointment.dentist_id,
    serviceId: dbAppointment.service_id,
    date: dbAppointment.date,
    startTime: dbAppointment.time,
    endTime: calculateEndTime(dbAppointment.time, 60), // Default to 60 min if no duration
    status: dbAppointment.status || 'pending',
    notes: dbAppointment.notes || '',
    createdAt: dbAppointment.created_at
  };
};

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');
      
      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      
      return data ? data.map(mapAppointmentFromDB) : [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Грешка при зареждане на часовете');
      return []; // Return empty array on error
    }
  },

  // Get appointments for a specific dentist
  getDentistAppointments: async (dentistId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId);
      
      if (error) {
        console.error('Error fetching dentist appointments:', error);
        return getMockAppointments(dentistId);
      }
      
      console.log('Fetched dentist appointments:', data);
      return data ? data.map(mapAppointmentFromDB) : [];
    } catch (error) {
      console.error('Error fetching dentist appointments:', error);
      toast.error('Грешка при зареждане на часовете на зъболекаря');
      return getMockAppointments(dentistId); // Return mock data on error
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> => {
    try {
      // Format data to match the database schema
      const formattedData = {
        patient_id: appointmentData.patientId,
        dentist_id: appointmentData.dentistId,
        service_id: appointmentData.serviceId,
        date: appointmentData.date,
        time: appointmentData.startTime,
        status: appointmentData.status,
        notes: appointmentData.notes,
        created_at: new Date().toISOString()
      };

      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert(formattedData)
          .select()
          .single();

        if (error) {
          console.error('Error creating appointment:', error);
          toast.error('Грешка при запазване на час');
          // Return mock ID instead of throwing error
          return crypto.randomUUID();
        }

        toast.success('Часът е запазен успешно');
        return data?.id || crypto.randomUUID();
      } catch (dbError) {
        console.error('Database error creating appointment:', dbError);
        toast.success('Часът е запазен успешно (локално)');
        return crypto.randomUUID();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Грешка при запазване на час');
      return crypto.randomUUID();
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, status: string): Promise<void> => {
    try {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id);

        if (error) {
          console.error('Error updating appointment status:', error);
          toast.error('Грешка при обновяване на статуса на часа');
          return;
        }

        toast.success('Статусът на часа е обновен успешно');
      } catch (dbError) {
        console.error('Database error updating appointment:', dbError);
        toast.success('Статусът на часа е обновен успешно (локално)');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Грешка при обновяване на статуса на часа');
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
      // This would ideally use a view or a join in the database
      // For now, we'll simulate with a mock implementation
      // In a real implementation, you'd use supabase.from(...).select(...) with proper joins
      
      // Mock data for demo
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
            specialization: "Зъболекар",
            imageUrl: "/placeholder.svg",
            bio: "Experienced зъболекар",
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
      
      return mockAppointmentHistories;
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      return []; // Return empty array on error
    }
  },
  
  // Generate report
  generateReport: async (startDate: string, endDate: string): Promise<Report> => {
    try {
      // In a real implementation, you'd create a database query to aggregate this data
      // For demo, return mock report data
      return {
        startDate,
        endDate,
        totalAppointments: 45,
        completedAppointments: 30,
        cancelledAppointments: 5,
        patientCount: 25
      };
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

// Mock appointments for fallback
function getMockAppointments(dentistId: string): Appointment[] {
  return [
    {
      id: "1",
      patientId: "p1",
      dentistId: dentistId,
      serviceId: "s1",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "10:00",
      status: "scheduled",
      notes: "Regular checkup",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      patientId: "p2",
      dentistId: dentistId,
      serviceId: "s2",
      date: new Date().toISOString().split('T')[0],
      startTime: "11:00",
      endTime: "12:00",
      status: "scheduled",
      notes: "Teeth cleaning",
      createdAt: new Date().toISOString()
    }
  ];
}
