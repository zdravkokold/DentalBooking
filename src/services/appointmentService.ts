import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentHistory, Report } from '@/data/models';
import { toast } from 'sonner';
import { format, addMinutes, parseISO } from 'date-fns';
import { Appointment, TimeSlot, WorkingHours } from '@/types';

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

class AppointmentService {
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Validate appointment time
      if (!this.isValidAppointmentTime(appointment)) {
        throw new Error('Invalid appointment time');
      }

      // Check for conflicts
      const hasConflict = await this.checkForConflicts(appointment);
      if (hasConflict) {
        throw new Error('This time slot is no longer available');
      }

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: appointment.patientId,
          dentist_id: appointment.dentistId,
          service_id: appointment.serviceId,
          date: appointment.date,
          start_time: appointment.startTime,
          end_time: appointment.endTime,
          status: appointment.status,
          notes: appointment.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.message || 'Failed to create appointment');
    }
  }

  async getDentistAppointments(dentistId: string, date?: string): Promise<Appointment[]> {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId);

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(appt => ({
        ...appt,
        patientId: appt.patient_id,
        dentistId: appt.dentist_id,
        serviceId: appt.service_id,
        startTime: appt.start_time,
        endTime: appt.end_time,
        createdAt: new Date(appt.created_at),
        updatedAt: new Date(appt.updated_at)
      }));
    } catch (error: any) {
      console.error('Error fetching dentist appointments:', error);
      throw new Error(error.message || 'Failed to fetch appointments');
    }
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          dentists:dentist_id (
            users:user_id (
              name
            )
          ),
          services:service_id (
            name,
            price
          )
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      return data.map(appt => ({
        id: appt.id,
        patientId: appt.patient_id,
        dentistId: appt.dentist_id,
        serviceId: appt.service_id,
        date: appt.date,
        startTime: appt.start_time,
        endTime: appt.end_time,
        status: appt.status,
        notes: appt.notes,
        createdAt: new Date(appt.created_at),
        updatedAt: new Date(appt.updated_at),
        dentistName: appt.dentists?.users?.name,
        serviceName: appt.services?.name,
        servicePrice: appt.services?.price
      }));
    } catch (error: any) {
      console.error('Error fetching patient appointments:', error);
      throw new Error(error.message || 'Failed to fetch appointments');
    }
  }

  async getAvailableTimeSlots(
    dentistId: string,
    date: string,
    serviceId?: string
  ): Promise<TimeSlot[]> {
    try {
      // Get dentist's working hours
      let { data: workingHours, error: whError } = await supabase
        .from('working_hours')
        .select('*')
        .eq('dentist_id', dentistId)
        .eq('day_of_week', new Date(date).getDay());

      if (whError) throw whError;

      // If no working hours found, create default ones (9 AM to 5 PM)
      if (!workingHours || workingHours.length === 0) {
        const defaultHours = {
          dentist_id: dentistId,
          day_of_week: new Date(date).getDay(),
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        };

        const { data: newHours, error: createError } = await supabase
          .from('working_hours')
          .insert([defaultHours])
          .select()
          .single();

        if (createError) throw createError;
        workingHours = [newHours];
      }

      // Get existing appointments
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', dentistId)
        .eq('date', date);

      if (apptError) throw apptError;

      // Get service duration
      let duration = 30; // default duration
      if (serviceId) {
        const { data: service, error: serviceError } = await supabase
          .from('services')
          .select('duration')
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;
        if (service) duration = service.duration;
      }

      return this.generateTimeSlots(workingHours, appointments, date, duration);
    } catch (error: any) {
      console.error('Error fetching available time slots:', error);
      throw new Error(error.message || 'Failed to fetch available time slots');
    }
  }

  private generateTimeSlots(
    workingHours: WorkingHours[],
    appointments: Appointment[],
    date: string,
    duration: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    workingHours.forEach(wh => {
      if (!wh.isAvailable) return;

      let currentTime = parseISO(`${date}T${wh.startTime}`);
      const endTime = parseISO(`${date}T${wh.endTime}`);

      while (currentTime < endTime) {
        const slotEndTime = addMinutes(currentTime, duration);
        if (slotEndTime > endTime) break;

        const isAvailable = !this.isTimeSlotConflicting(
          currentTime,
          slotEndTime,
          appointments
        );

        if (isAvailable) {
          slots.push({
            id: `${date}-${format(currentTime, 'HH:mm')}-${wh.dentistId}`,
            dentistId: wh.dentistId,
            date: date,
            startTime: format(currentTime, 'HH:mm'),
            endTime: format(slotEndTime, 'HH:mm'),
            isAvailable: true
          });
        }

        currentTime = slotEndTime;
      }
    });

    return slots;
  }

  private isTimeSlotConflicting(
    start: Date,
    end: Date,
    appointments: Appointment[]
  ): boolean {
    return appointments.some(appt => {
      const apptStart = parseISO(`${appt.date}T${appt.startTime}`);
      const apptEnd = parseISO(`${appt.date}T${appt.endTime}`);
      return (
        (start >= apptStart && start < apptEnd) ||
        (end > apptStart && end <= apptEnd) ||
        (start <= apptStart && end >= apptEnd)
      );
    });
  }

  private isValidAppointmentTime(appointment: Partial<Appointment>): boolean {
    if (!appointment.date || !appointment.startTime || !appointment.endTime) {
      return false;
    }

    const start = parseISO(`${appointment.date}T${appointment.startTime}`);
    const end = parseISO(`${appointment.date}T${appointment.endTime}`);
    const now = new Date();

    return start > now && end > start;
  }

  private async checkForConflicts(appointment: Partial<Appointment>): Promise<boolean> {
    if (!appointment.dentistId || !appointment.date) return true;

    const { data: conflicts, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('dentist_id', appointment.dentistId)
      .eq('date', appointment.date)
      .overlaps('start_time', [appointment.startTime, appointment.endTime]);

    if (error) throw error;
    return conflicts.length > 0;
  }
}

export const appointmentService = new AppointmentService();

// Helper function to validate UUID format
function validateUUID(id: string): string | null {
  // UUID regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // Check if the ID is a valid UUID
  if (id && uuidPattern.test(id)) {
    return id;
  }
  
  // For development environment, use default UUID for specific known short IDs
  if (id === 'd1') {
    return "00000000-0000-4000-a000-000000000000";
  } else if (id === 's1' || id === 's2' || id === 's3') {
    return "00000000-0000-4000-a000-000000000001";
  }
  
  console.error('Invalid UUID format:', id);
  return null;
}

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
