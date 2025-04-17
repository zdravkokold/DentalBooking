
// Types and interfaces for the application

export interface Dentist {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  bio: string;
  rating: number;
  yearsOfExperience: number;
  education: string;
  languages: string[];
}

export interface AppointmentSlot {
  id: string;
  dentistId: string;
  date: string; // ISO date string
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Duration in minutes
  imageUrl: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  healthStatus?: string;
  address?: string;
  birthDate?: string;
}

export interface DentistAvailability {
  id: string;
  dentistId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AppointmentHistory {
  appointment: Appointment;
  patient: Patient;
  dentist: Dentist;
  service: Service;
}

export interface Report {
  startDate: string;
  endDate: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  patientCount: number;
}
