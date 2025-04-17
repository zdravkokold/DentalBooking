
import { Appointment, AppointmentHistory, Report, AppointmentStatus } from '@/data/models';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      // Mock data for demo
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          patientId: "p1",
          dentistId: "d1",
          serviceId: "s1",
          date: "2025-04-20",
          startTime: "10:00",
          endTime: "11:00",
          status: "scheduled",
          notes: "First visit",
          createdAt: "2025-04-15T10:30:00Z"
        },
        {
          id: "2",
          patientId: "p2",
          dentistId: "d1",
          serviceId: "s2",
          date: "2025-04-21",
          startTime: "14:00",
          endTime: "15:00",
          status: "scheduled",
          notes: "Follow-up",
          createdAt: "2025-04-15T11:15:00Z"
        }
      ];
      
      return mockAppointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return []; // Return empty array on error
    }
  },

  // Get appointments for a specific dentist
  getDentistAppointments: async (dentistId: string): Promise<Appointment[]> => {
    try {
      // Mock data for demo
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          patientId: "p1",
          dentistId: dentistId,
          serviceId: "s1",
          date: "2025-04-20",
          startTime: "10:00",
          endTime: "11:00",
          status: "scheduled",
          notes: "First visit",
          createdAt: "2025-04-15T10:30:00Z"
        },
        {
          id: "2",
          patientId: "p2",
          dentistId: dentistId,
          serviceId: "s2",
          date: "2025-04-21",
          startTime: "14:00",
          endTime: "15:00",
          status: "scheduled", 
          notes: "Follow-up",
          createdAt: "2025-04-15T11:15:00Z"
        }
      ];
      
      return mockAppointments;
    } catch (error) {
      console.error('Error fetching dentist appointments:', error);
      return []; // Return empty array on error
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
      // For demo, return mock data
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
      
      return mockAppointmentHistories;
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
