
import { toast } from "sonner";
import { Appointment } from "@/data/models";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { bg } from "date-fns/locale";

// Function to check upcoming appointments and show notifications
export const checkUpcomingAppointments = (appointments: Appointment[] = []) => {
  if (!appointments || appointments.length === 0) return;
  
  const now = new Date();
  const threeDaysFromNow = addDays(now, 3);
  
  // Filter appointments in the next 3 days
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate <= threeDaysFromNow && appointmentDate >= now;
  });
  
  // Show notifications for upcoming appointments
  upcomingAppointments.forEach(appointment => {
    const appointmentDate = new Date(appointment.date);
    let dayText = "";
    
    if (isToday(appointmentDate)) {
      dayText = "днес";
    } else if (isTomorrow(appointmentDate)) {
      dayText = "утре";
    } else {
      dayText = format(appointmentDate, "dd.MM.yyyy", { locale: bg });
    }
    
    // Show a toast notification
    toast.info(`Предстоящ преглед ${dayText}`, {
      description: `Имате час в ${appointment.startTime}ч.`,
      duration: 5000,
      action: {
        label: "Преглед",
        onClick: () => window.location.href = '/appointments'
      },
    });
  });
};

// Function to show a specific notification
export const showAppointmentNotification = (message: string, description: string) => {
  toast.info(message, {
    description,
    duration: 5000,
    action: {
      label: "Преглед",
      onClick: () => window.location.href = '/appointments'
    },
  });
};
