
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
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}
