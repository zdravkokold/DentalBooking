export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dentist' | 'patient';
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  medicalHistory: string;
  insuranceDetails: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dentist {
  id: string;
  userId: string;
  specializations: string[];
  workingHours: WorkingHours[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  id: string;
  dentistId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status: AppointmentStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DentalService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface TimeSlot {
  id: string;
  dentistId: string;
  serviceId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
} 