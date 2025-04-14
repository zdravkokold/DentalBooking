
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentSlots } from '@/data/mockData';
import { format, isSameDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface CalendarComponentProps {
  dentistId?: string;
  onAppointmentSelected?: (appointmentId: string) => void;
}

const CalendarComponent = ({ dentistId, onAppointmentSelected }: CalendarComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  // Get available dates (dates that have at least one available slot)
  const availableDates = Array.from(
    new Set(
      appointmentSlots
        .filter(slot => slot.isAvailable && (!dentistId || slot.dentistId === dentistId))
        .map(slot => slot.date)
    )
  );

  // Function to highlight available dates in the calendar
  const isDayAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      isSameDay(new Date(availableDate), date)
    );
  };

  // Get time slots for selected date and dentist
  const getTimeSlotsForDay = (date: Date): TimeSlot[] => {
    if (!date) return [];
    
    const dateString = format(date, 'yyyy-MM-dd');
    return appointmentSlots
      .filter(slot => 
        slot.date === dateString && 
        slot.isAvailable && 
        (!dentistId || slot.dentistId === dentistId)
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(({ id, startTime, endTime, isAvailable }) => ({
        id,
        startTime,
        endTime,
        isAvailable
      }));
  };

  const timeSlots = selectedDate ? getTimeSlotsForDay(selectedDate) : [];

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null); // Reset selected slot when date changes
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  const handleBookAppointment = () => {
    if (selectedSlotId) {
      // In a real app, this would make an API call to book the appointment
      toast.success("Часът е запазен успешно!", {
        description: `Вашият час беше успешно запазен за ${format(selectedDate!, 'dd MMMM yyyy', { locale: bg })} в ${appointmentSlots.find(slot => slot.id === selectedSlotId)?.startTime} ч.`
      });
      if (onAppointmentSelected) {
        onAppointmentSelected(selectedSlotId);
      }
    }
  };

  // Group time slots by hour for better UI organization
  const groupedTimeSlots: { [hour: string]: TimeSlot[] } = {};
  timeSlots.forEach(slot => {
    const hour = slot.startTime.split(':')[0];
    if (!groupedTimeSlots[hour]) {
      groupedTimeSlots[hour] = [];
    }
    groupedTimeSlots[hour].push(slot);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 shadow-md">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Изберете дата</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            locale={bg}
            className="pointer-events-auto"
            modifiers={{
              available: isDayAvailable
            }}
            modifiersStyles={{
              available: { fontWeight: 'bold', color: '#008080' }
            }}
            disabled={(date) => {
              // Disable dates in the past, weekends, or dates without available slots
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                date < today ||
                date.getDay() === 0 ||
                date.getDay() === 6 ||
                !isDayAvailable(date)
              );
            }}
          />
          <p className="text-sm text-gray-500 mt-4 flex items-center">
            <Badge className="bg-dental-teal mr-2" />
            <span>Налични часове</span>
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-md">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate 
              ? `Налични часове за ${format(selectedDate, 'dd MMMM yyyy', { locale: bg })}` 
              : 'Изберете дата, за да видите наличните часове'}
          </h3>

          {selectedDate && timeSlots.length === 0 && (
            <p className="text-gray-500">Няма налични часове за избраната дата.</p>
          )}

          <div className="space-y-6">
            {Object.entries(groupedTimeSlots).map(([hour, slots]) => (
              <div key={hour} className="animate-fade-in">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  {hour}:00 - {parseInt(hour) + 1}:00
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlotId === slot.id ? "default" : "outline"}
                      className={`
                        ${selectedSlotId === slot.id 
                          ? 'bg-dental-teal hover:bg-dental-teal/90' 
                          : 'hover:border-dental-teal hover:text-dental-teal'
                        }
                        transition-all
                      `}
                      onClick={() => handleSlotSelect(slot.id)}
                    >
                      {selectedSlotId === slot.id && <Check className="mr-1 h-4 w-4" />}
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedSlotId && (
            <div className="mt-8 flex justify-end animate-fade-in">
              <Button 
                className="bg-dental-teal hover:bg-dental-teal/90"
                onClick={handleBookAppointment}
              >
                Запази час <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarComponent;
