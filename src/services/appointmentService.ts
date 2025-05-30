
import { supabase } from '@/lib/supabase';
import { AppointmentHistory, Report } from '@/data/models';
import { toast } from 'sonner';
import { format, addMinutes, parseISO, isSameDay } from 'date-fns';
import { TimeSlot, WorkingHours } from '@/types';

// Define the type of appointment status for type safety
type AppointmentStatus = 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt?: string;
  dentistName?: string;
  serviceName?: string;
  servicePrice?: number;
}

// Helper function to map database fields to our model interface
const mapAppointmentFromDB = (dbAppointment: any): Appointment => {
  return {
    id: dbAppointment.id,
    patientId: dbAppointment.patient_id,
    dentistId: dbAppointment.dentist_id,
    serviceId: dbAppointment.service_id,
    date: dbAppointment.date,
    startTime: dbAppointment.start_time,
    endTime: dbAppointment.end_time,
    status: dbAppointment.status || 'pending',
    notes: dbAppointment.notes || '',
    createdAt: dbAppointment.created_at,
    updatedAt: dbAppointment.updated_at
  };
};

class AppointmentService {
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      console.log('Creating appointment with data:', appointment);

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
          notes: appointment.notes || ''
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created successfully:', data);
      return mapAppointmentFromDB(data);
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
      
      return data ? data.map(mapAppointmentFromDB) : [];
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
            profiles:profile_id (
              first_name,
              last_name
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

      return data ? data.map(appt => ({
        ...mapAppointmentFromDB(appt),
        dentistName: appt.dentists?.profiles?.first_name && appt.dentists?.profiles?.last_name 
          ? `${appt.dentists.profiles.first_name} ${appt.dentists.profiles.last_name}`
          : undefined,
        serviceName: appt.services?.name,
        servicePrice: appt.services?.price
      })) : [];
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
      console.log('Fetching time slots for:', { dentistId, date, serviceId });

      // Convert short IDs to UUIDs if needed
      const validDentistId = validateUUID(dentistId);
      if (!validDentistId) {
        console.error('Invalid dentist ID:', dentistId);
        throw new Error('Invalid dentist ID');
      }
      
      // Get dentist's working hours from dentist_availabilities table
      let { data: workingHours, error: whError } = await supabase
        .from('dentist_availabilities')
        .select('*')
        .eq('dentist_id', validDentistId)
        .eq('day_of_week', new Date(date).getDay());

      if (whError) {
        console.error('Error fetching working hours:', whError);
        workingHours = null;
      }

      // If no working hours found, use default ones (9 AM to 5 PM)
      if (!workingHours || workingHours.length === 0) {
        console.log('No working hours found, using default schedule');
        workingHours = [{
          dentist_id: validDentistId,
          day_of_week: new Date(date).getDay(),
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        }];
      }

      console.log('Working hours:', workingHours);

      // Get existing appointments
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('dentist_id', validDentistId)
        .eq('date', date)
        .not('status', 'eq', 'cancelled');

      if (apptError) {
        console.error('Error fetching appointments:', apptError);
        throw apptError;
      }

      console.log('Existing appointments:', appointments);

      // Get service duration
      let duration = 30; // default duration
      if (serviceId) {
        const validServiceId = validateUUID(serviceId);
        if (validServiceId) {
          const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('duration')
            .eq('id', validServiceId)
            .single();

          if (serviceError) {
            console.error('Error fetching service:', serviceError);
          } else if (service) {
            duration = service.duration;
          }
        } else {
          console.warn('Invalid service ID:', serviceId);
        }
      }

      console.log('Service duration:', duration);

      const mappedAppointments = appointments ? appointments.map(mapAppointmentFromDB) : [];
      const slots = this.generateTimeSlots(workingHours, mappedAppointments, date, duration);
      console.log('Generated slots:', slots);
      
      return slots;
    } catch (error: any) {
      console.error('Error fetching available time slots:', error);
      throw new Error(error.message || 'Failed to fetch available time slots');
    }
  }

  private generateTimeSlots(
    workingHours: any[],
    appointments: Appointment[],
    date: string,
    duration: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dateObj = new Date(date);
    
    console.log('Generating slots with:', {
      workingHours,
      appointments,
      date,
      duration,
      dayOfWeek: dateObj.getDay()
    });

    workingHours.forEach(wh => {
      if (!wh.is_available) {
        console.log('Skipping unavailable working hours:', wh);
        return;
      }

      try {
        let currentTime = parseISO(`${date}T${wh.start_time}`);
        const endTime = parseISO(`${date}T${wh.end_time}`);

        console.log('Generating slots between:', {
          start: wh.start_time,
          end: wh.end_time,
          currentTime: format(currentTime, 'HH:mm'),
          endTime: format(endTime, 'HH:mm')
        });

        while (currentTime < endTime) {
          const slotEndTime = addMinutes(currentTime, duration);
          
          // Don't create slots that would end after working hours
          if (slotEndTime > endTime) {
            console.log('Skipping slot that would end after working hours:', {
              slotEnd: format(slotEndTime, 'HH:mm'),
              workingHoursEnd: format(endTime, 'HH:mm')
            });
            break;
          }

          const isAvailable = !this.isTimeSlotConflicting(
            currentTime,
            slotEndTime,
            appointments
          );

          const slot = {
            id: `${date}-${format(currentTime, 'HH:mm')}-${wh.dentist_id}`,
            dentistId: wh.dentist_id,
            date: date,
            startTime: format(currentTime, 'HH:mm'),
            endTime: format(slotEndTime, 'HH:mm'),
            isAvailable: isAvailable
          };

          console.log('Adding slot:', {
            ...slot,
            isAvailable,
            currentTime: format(currentTime, 'HH:mm'),
            slotEndTime: format(slotEndTime, 'HH:mm')
          });
          
          slots.push(slot);
          currentTime = slotEndTime;
        }
      } catch (error) {
        console.error('Error generating slots for working hours:', wh, error);
      }
    });

    console.log('Final slots generated:', slots.length);
    return slots;
  }

  private isTimeSlotConflicting(
    start: Date,
    end: Date,
    appointments: Appointment[]
  ): boolean {
    return appointments.some(appt => {
      try {
        const apptStart = parseISO(`${appt.date}T${appt.startTime}`);
        const apptEnd = parseISO(`${appt.date}T${appt.endTime}`);
        
        const hasConflict = (
          (start >= apptStart && start < apptEnd) ||
          (end > apptStart && end <= apptEnd) ||
          (start <= apptStart && end >= apptEnd)
        );

        if (hasConflict) {
          console.log('Found conflict with appointment:', {
            apptStart: format(apptStart, 'HH:mm'),
            apptEnd: format(apptEnd, 'HH:mm'),
            slotStart: format(start, 'HH:mm'),
            slotEnd: format(end, 'HH:mm')
          });
        }

        return hasConflict;
      } catch (error) {
        console.error('Error checking appointment conflict:', error);
        return false;
      }
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
    if (!appointment.dentistId || !appointment.date || !appointment.startTime || !appointment.endTime) {
      return true;
    }

    const { data: conflicts, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('dentist_id', appointment.dentistId)
      .eq('date', appointment.date)
      .or(`and(start_time.lt.${appointment.endTime},end_time.gt.${appointment.startTime})`);

    if (error) {
      console.error('Error checking conflicts:', error);
      throw error;
    }
    
    return conflicts && conflicts.length > 0;
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
    return "00000000-0000-4000-a000-000000000001";
  } else if (id === 'd2') {
    return "00000000-0000-4000-a000-000000000002";
  } else if (id === 'd3') {
    return "00000000-0000-4000-a000-000000000003";
  } else if (id === 'd4') {
    return "00000000-0000-4000-a000-000000000004";
  } else if (id === 's1') {
    return "00000000-0000-4000-b000-000000000001";
  } else if (id === 's2') {
    return "00000000-0000-4000-b000-000000000002";
  } else if (id === 's3') {
    return "00000000-0000-4000-b000-000000000003";
  } else if (id === 's4') {
    return "00000000-0000-4000-b000-000000000004";
  } else if (id === 's5') {
    return "00000000-0000-4000-b000-000000000005";
  } else if (id === 's6') {
    return "00000000-0000-4000-b000-000000000006";
  }
  
  console.error('Invalid UUID format:', id);
  return null;
}
