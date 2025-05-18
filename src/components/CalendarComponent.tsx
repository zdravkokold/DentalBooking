import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// !!! Директно добавям примерни налични слотове ако са празни
import { appointmentSlots as originalAppointmentSlots } from '@/data/mockData';
import { format, isSameDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { ChevronRight, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointmentService';

// Примерни слотове, за да се вижда функционалността, ако няма в mockData
const fallbackSlots = [
  {
    id: "slot1",
    dentistId: "d1",
    serviceId: "s1",
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: "09:30",
    endTime: "10:00",
    isAvailable: true,
  },
  {
    id: "slot2",
    dentistId: "d1",
    serviceId: "s1",
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: "10:00",
    endTime: "10:30",
    isAvailable: true,
  },
];

// Fallback demo slots: always create 14 bookable dates starting from today (weekdays only)
function getFallbackSlots() {
  const slots: any[] = [];
  let dayCount = 0;
  let date = new Date();
  while (slots.length < 14 && dayCount < 31) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const dateStr = format(date, 'yyyy-MM-dd');
      slots.push({
        id: `fallback-${dateStr}-am`,
        dentistId: "d1",
        serviceId: "s1",
        date: dateStr,
        startTime: "09:00",
        endTime: "09:30",
        isAvailable: true,
      });
      slots.push({
        id: `fallback-${dateStr}-pm`,
        dentistId: "d1",
        serviceId: "s1",
        date: dateStr,
        startTime: "10:00",
        endTime: "10:30",
        isAvailable: true,
      });
    }
    date.setDate(date.getDate() + 1);
    dayCount++;
  }
  return slots;
}

// Replace fallback logic entirely:
const appointmentSlots =
  (originalAppointmentSlots && originalAppointmentSlots.length > 0)
    ? originalAppointmentSlots
    : getFallbackSlots();

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  dentistId?: string;
  serviceId?: string;
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

  // Достъпни дати само за избрания зъболекар/услуга
  const realAvailableDates = Array.from(
    new Set(
      appointmentSlots
        .filter(slot =>
          slot.isAvailable &&
          (!dentistId || slot.dentistId === dentistId) &&
          (!serviceId || (slot as any).serviceId === undefined || (slot as any).serviceId === serviceId)
        ).map(slot => slot.date)
    )
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let availableDates: string[] = realAvailableDates;
  if (realAvailableDates.length === 0) {
    // Demo fallback: next 14 weekdays starting from today
    availableDates = [];
    let d = new Date();
    while (availableDates.length < 14) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        availableDates.push(format(d, 'yyyy-MM-dd'));
      }
      d.setDate(d.getDate() + 1);
    }
  }

  // Проверка дали дадена дата е налична
  const isDayAvailable = (date: Date) => {
    const check = availableDates.some(availableDate =>
      isSameDay(new Date(availableDate), date)
    );
    // Диагностика:
    if (!check) {
      console.log(`[КАЛЕНДАР] Дата ${format(date, 'yyyy-MM-dd')} не е налична според филтъра dentistId=${dentistId}, serviceId=${serviceId} (налични: ${JSON.stringify(availableDates)})`);
    }
    return check;
  };

  // Слотове за конкретен ден, зъболекар, услуга
  const getTimeSlotsForDay = (date: Date): TimeSlot[] => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    const uniqueSlots = new Map();
    appointmentSlots
      .filter(slot =>
        slot.date === dateString &&
        slot.isAvailable &&
        (!dentistId || slot.dentistId === dentistId) &&
        (!serviceId || (slot as any).serviceId === undefined || (slot as any).serviceId === serviceId)
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
            isAvailable: slot.isAvailable,
            dentistId: slot.dentistId,
            serviceId: (slot as any).serviceId, // optional or undefined
          });
        }
      });
    return Array.from(uniqueSlots.values());
  };

  const timeSlots = selectedDate ? getTimeSlotsForDay(selectedDate) : [];

  // Key diagnostics for developer/testing
  React.useEffect(() => {
    console.log("[КАЛЕНДАР] FILTERS: dentistId =", dentistId, "serviceId =", serviceId);
    console.log("[КАЛЕНДАР] Достъпни дати:", availableDates);
    if (selectedDate) {
      console.log("[КАЛЕНДАР] Слотове за избраната дата:", getTimeSlotsForDay(selectedDate));
    }
  }, [dentistId, serviceId, selectedDate]);

  // Обработка на избора на дата
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setSelectedSlot(null);
    setError(null);
    console.log("[КАЛЕНДАР] Избрана дата:", date);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlotId(slot.id);
    setSelectedSlot(slot);
    setError(null);
    console.log("[КАЛЕНДАР] Избран слот:", slot);
  };

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

  // Групиране на часовете за по-добър UI
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
          {availableDates.length === 0 && (
            <div className="text-red-500 mt-4 text-center">
              Липсват налични часове за избрания зъболекар и услуга.<br />
              <span className="text-xs text-gray-600">* Добави тестови слотове в mockData или избери без филтри.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-7 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate
              ? `Налични часове за ${format(selectedDate, 'dd MMMM yyyy', { locale: bg })}`
              : 'Изберете дата, за да видите наличните часове'}
          </h3>
          {selectedDate && timeSlots.length === 0 && (
            <p className="text-gray-500">Няма налични часове за избранат�� дата.</p>
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
