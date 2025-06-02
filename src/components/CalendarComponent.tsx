
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { ChevronRight, Check, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointmentService';
import { TimeSlot } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface CalendarComponentProps {
  dentistId?: string;
  serviceId?: string;
  onAppointmentSelected?: (appointmentId: string) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  dentistId,
  serviceId,
  onAppointmentSelected
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch available time slots
  const { data: timeSlots, isLoading, error, refetch } = useQuery({
    queryKey: ['timeSlots', dentistId, date, serviceId],
    queryFn: async () => {
      if (!dentistId) {
        console.error('No dentist selected');
        return [];
      }
      try {
        const slots = await appointmentService.getAvailableTimeSlots(
          dentistId,
          format(date, 'yyyy-MM-dd'),
          serviceId
        );
        console.log('Fetched time slots:', slots);
        return slots;
      } catch (error) {
        console.error('Error fetching time slots:', error);
        throw error;
      }
    },
    enabled: !!dentistId && !!date
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error('Моля, влезте в профила си, за да запазите час.');
      navigate('/login');
      return;
    }

    if (!selectedSlot || !dentistId || !serviceId) {
      toast.error('Моля, изберете час и услуга.');
      return;
    }

    setIsBooking(true);

    try {
      console.log('Booking appointment with:', {
        patientId: user.id,
        dentistId: dentistId,
        serviceId: serviceId,
        date: format(date, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });

      const appointment = await appointmentService.createAppointment({
        patientId: user.id,
        dentistId: dentistId,
        serviceId: serviceId,
        date: format(date, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'pending',
        notes: ''
      });

      toast.success('Часът е запазен успешно!');
      onAppointmentSelected?.(appointment.id);
      setSelectedSlot(null);
      refetch();
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error(error.message || 'Възникна грешка при запазването на час.');
    } finally {
      setIsBooking(false);
    }
  };

  if (error) {
    console.error('Error in CalendarComponent:', error);
    return (
      <div className="text-center text-red-500 p-4">
        Възникна грешка при зареждането на свободните часове.
        <br />
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          className="mt-2"
        >
          Опитай отново
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={bg}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Свободни часове за {format(date, 'dd.MM.yyyy', { locale: bg })}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-dental-teal" />
            </div>
          ) : timeSlots && timeSlots.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                    className={`w-full justify-start gap-2 ${
                      !slot.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => slot.isAvailable && handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                  >
                    <Clock className="h-4 w-4" />
                    <span>{slot.startTime}</span>
                    {selectedSlot?.id === slot.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Няма налични часове за избраната дата.
            </p>
          )}

          {selectedSlot && (
            <div className="mt-6">
              <Button
                className="w-full gap-2"
                onClick={handleBookAppointment}
                disabled={isBooking}
              >
                {isBooking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Запази час
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarComponent;
