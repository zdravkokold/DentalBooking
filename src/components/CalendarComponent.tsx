
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appointmentSlots } from '@/data/mockData';
import { format, isSameDay, parseISO } from 'date-fns';
import { bg } from 'date-fns/locale';
import { ChevronRight, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointmentService';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface CalendarComponentProps {
  dentistId?: string;
  serviceId?: string;
  onAppointmentSelected?: (appointmentId: string) => void;
}

const CalendarComponent = ({ dentistId, serviceId, onAppointmentSelected }: CalendarComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Филтрирани налични дати САМО за избрания зъболекар
  const availableDates = Array.from(
    new Set(
      appointmentSlots
        .filter(slot => slot.isAvailable && (!dentistId || slot.dentistId === dentistId))
        .map(slot => slot.date)
    )
  );

  // Дали даден ден е наличен за резервация
  const isDayAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      isSameDay(new Date(availableDate), date)
    );
  };

  // Взимане на свободните слотове за дата и зъболекар
  const getTimeSlotsForDay = (date: Date): TimeSlot[] => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    const uniqueSlots = new Map();
    appointmentSlots
      .filter(slot =>
        slot.date === dateString &&
        slot.isAvailable &&
        (!dentistId || slot.dentistId === dentistId)
      )
      .sort((a, b) => {
        const aTime = a.startTime.split(':').map(Number);
        const bTime = b.startTime.split(':').map(Number);
        return aTime[0] - bTime[0] || aTime[1] - bTime[1];
      })
      .forEach(slot => {
        if (!uniqueSlots.has(slot.startTime)) {
          uniqueSlots.set(slot.startTime, {
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable
          });
        }
      });
    return Array.from(uniqueSlots.values());
  };

  const timeSlots = selectedDate ? getTimeSlotsForDay(selectedDate) : [];

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setSelectedSlot(null);
    setError(null);
    if (date) console.log("[КАЛЕНДАР] Избрана дата:", date);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlotId(slot.id);
    setSelectedSlot(slot);
    setError(null);
    console.log("[КАЛЕНДАР] Избран слот:", slot);
  };

  // Helper function to validate UUID (тест вариант, за back на dev)
  const validateUUID = (id?: string): string => {
    if (!id) return "00000000-0000-4000-a000-000000000000";
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;
    if (id === 'd1' || id === 'd2' || id === 'd3' || id === 'd4') return "00000000-0000-4000-a000-000000000000";
    if (id.startsWith('s')) return "00000000-0000-4000-a000-000000000001";
    return "00000000-0000-4000-a000-000000000000";
  };

  const handleBookAppointment = async () => {
    setError(null);
    if (!user) {
      toast.error("Моля, влезте в акаунта си за да запазите час.", { description: "Пренасочване към вход..." });
      navigate('/login');
      return;
    }
    if (!selectedSlotId || !selectedDate || !selectedSlot) {
      setError("Моля, изберете дата и час.");
      toast.error("Моля, изберете дата и час.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const finalDentistId = validateUUID(dentistId);
      const finalServiceId = validateUUID(serviceId);
      console.log("[КАЛЕНДАР] Изпращам заявка за резервация", {
        patientId: user.id,
        dentistId: finalDentistId,
        serviceId: finalServiceId,
        date: formattedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      const appointmentId = await appointmentService.createAppointment({
        patientId: user.id,
        dentistId: finalDentistId,
        serviceId: finalServiceId,
        date: formattedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'scheduled',
        notes: ''
      });

      if (appointmentId && String(appointmentId).length === 36) {
        toast.success("Часът е запазен успешно!", {
          description: `Записахте час за ${format(selectedDate, 'dd.MM.yyyy')} в ${selectedSlot.startTime} ч.`
        });
        if (onAppointmentSelected) onAppointmentSelected(appointmentId);
        setTimeout(() => navigate('/patient?tab=appointments'), 800);
      } else {
        throw new Error("Неуспешно запазване на час. Моля, опитайте отново.");
      }
    } catch (error: any) {
      setError(error.message || "Възникна грешка.");
      toast.error("Грешка при запазване на час.", {
        description: error.message || "Моля, опитайте отново или се свържете с нас."
      });
      console.error("[КАЛЕНДАР] Грешка при запис на час:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Групиране на часовете по часове за по-добър UI
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
  const groupedTimeSlots = groupTimeSlotsByHour();

  // === НАЙ-ВАЖНО: Календарът вече е с pointer-events-auto ===
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
              className="mx-auto pointer-events-auto"
              modifiers={{
                available: isDayAvailable
              }}
              modifiersStyles={{
                available: { fontWeight: 'bold', color: '#008080' }
              }}
              disabled={(date) => {
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
          {selectedDate && getTimeSlotsForDay(selectedDate).length === 0 && (
            <p className="text-gray-500">Няма налични часове за избраната дата.</p>
          )}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {groupedTimeSlots.map(([hourRange, slots]) => (
                <div key={hourRange} className="animate-fade-in">
                  <div className="flex items-center mb-2 text-md font-medium text-gray-700">
                    <Clock className="h-4 w-4 mr-1 text-dental-teal" />
                    <h4>{hourRange}</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {selectedSlotId === slot.id && <Check className="mr-1 h-4 w-4" />}
                        {slot.startTime}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {selectedSlotId && (
            <div className="mt-6 flex justify-end animate-fade-in">
              <Button 
                className="bg-dental-teal hover:bg-dental-teal/90"
                onClick={handleBookAppointment}
                disabled={isLoading}
                data-testid="book-appointment-button"
              >
                {isLoading ? 'Обработване...' : 'Запази час'} {!isLoading && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-4">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarComponent;

