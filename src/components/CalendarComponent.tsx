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

const CalendarComponent = ({ dentistId, serviceId, onAppointmentSelected }: CalendarComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch available time slots when date is selected
  const { data: timeSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['availableTimeSlots', dentistId, serviceId, selectedDate?.toISOString()],
    queryFn: () => selectedDate 
      ? appointmentService.getAvailableTimeSlots(
          dentistId || '',
          format(selectedDate, 'yyyy-MM-dd'),
          serviceId
        )
      : Promise.resolve([]),
    enabled: !!selectedDate && !!dentistId
  });

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!user) {
      toast.error("Моля, влезте в акаунта си за да запазите час.", { 
        description: "Пренасочване към вход..." 
      });
      navigate('/login');
      return;
    }

    if (!selectedSlot || !selectedDate) {
      toast.error("Моля, изберете дата и час.");
      return;
    }

    setIsBooking(true);
    try {
      const appointmentId = await appointmentService.createAppointment({
        patientId: user.id,
        dentistId: selectedSlot.dentistId,
        serviceId: serviceId || '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'scheduled',
        notes: ''
      });

      toast.success("Часът е запазен успешно!", {
        description: `Записахте час за ${format(selectedDate, 'dd.MM.yyyy')} в ${selectedSlot.startTime} ч.`
      });

      if (onAppointmentSelected) {
        onAppointmentSelected(appointmentId);
      }

      // Redirect to appointments page after successful booking
      setTimeout(() => navigate('/patient?tab=appointments'), 800);
    } catch (error: any) {
      toast.error("Грешка при запазване на час.", {
        description: error.message || "Моля, опитайте отново или се свържете с нас."
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Group time slots by hour for better UI
  const groupTimeSlotsByHour = () => {
    const groupedSlots: Record<string, TimeSlot[]> = {};
    timeSlots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      const hourKey = `${hour.toString().padStart(2, '0')}:00 - ${(hour+1).toString().padStart(2, '0')}:00`;
      if (!groupedSlots[hourKey]) groupedSlots[hourKey] = [];
      groupedSlots[hourKey].push(slot);
    });
    return Object.entries(groupedSlots).sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  return (
    <div className="grid md:grid-cols-12 gap-6">
      <Card className="md:col-span-5 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Изберете дата</h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              locale={bg}
              className="mx-auto"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  date < today ||
                  date.getDay() === 0 ||
                  date.getDay() === 6
                );
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 justify-center">
            <div className="w-3 h-3 rounded-full bg-dental-teal"></div>
            <span>Налични часове</span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-7 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate
              ? `Налични часове за ${format(selectedDate, 'dd MMMM yyyy', { locale: bg })}`
              : 'Изберете дата, за да видите наличните часове'}
          </h3>

          {isLoadingSlots ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-dental-teal" />
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              {selectedDate && timeSlots.length === 0 && (
                <p className="text-gray-500 text-center">
                  Няма налични часове за избраната дата.
                </p>
              )}
              
              {selectedDate && timeSlots.length > 0 && (
                <div className="space-y-6">
                  {groupTimeSlotsByHour().map(([hourRange, slots]) => (
                    <div key={hourRange} className="animate-fade-in">
                      <div className="flex items-center mb-2 text-md font-medium text-gray-700">
                        <Clock className="h-4 w-4 mr-1 text-dental-teal" />
                        <h4>{hourRange}</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {slots.map(slot => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            className={`
                              ${selectedSlot?.id === slot.id
                                ? 'bg-dental-teal hover:bg-dental-teal/90'
                                : 'hover:border-dental-teal hover:text-dental-teal'
                              }
                              transition-all
                            `}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {selectedSlot?.id === slot.id && (
                              <Check className="mr-1 h-4 w-4" />
                            )}
                            {slot.startTime}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
          
          {selectedSlot && (
            <div className="mt-6 flex justify-end animate-fade-in">
              <Button
                className="bg-dental-teal hover:bg-dental-teal/90"
                onClick={handleBookAppointment}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обработване...
                  </>
                ) : (
                  <>
                    Запази час
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarComponent;
