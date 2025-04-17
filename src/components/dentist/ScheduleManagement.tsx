import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TimeRange } from '@/components/TimeRange';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format, addMinutes, parseISO, isEqual, isBefore, isAfter } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CheckIcon, CalendarIcon, Clock, UserPlus, ArrowRight, Edit, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { availabilityService } from '@/services/availabilityService';
import { patientService } from '@/services/patientService';
import { appointmentService } from '@/services/appointmentService';
import { DentistAvailability, Patient } from '@/data/models';
import { toast } from 'sonner';

const daysOfWeek = [
  { value: 0, label: 'Неделя' },
  { value: 1, label: 'Понеделник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Сряда' },
  { value: 4, label: 'Четвъртък' },
  { value: 5, label: 'Петък' },
  { value: 6, label: 'Събота' }
];

const ScheduleManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAvailability, setSelectedAvailability] = useState<DentistAvailability | null>(null);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [availabilityPattern, setAvailabilityPattern] = useState<'specific' | 'recurring'>('recurring');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const dentistId = 'd1';

  const { data: availabilities = [], isLoading: isLoadingAvailabilities, refetch: refetchAvailabilities } = 
    useQuery({
      queryKey: ['dentistAvailability', dentistId],
      queryFn: () => availabilityService.getDentistAvailability(dentistId)
    });

  const { data: patients = [], isLoading: isLoadingPatients } = 
    useQuery({
      queryKey: ['patients'],
      queryFn: () => patientService.getAllPatients()
    });

  const { data: appointments = [], isLoading: isLoadingAppointments } = 
    useQuery({
      queryKey: ['dentistAppointments', dentistId, selectedDate?.toISOString().split('T')[0]],
      queryFn: () => appointmentService.getDentistAppointments(dentistId),
      enabled: !!selectedDate
    });

  const services = [
    { id: 's1', name: 'Преглед', price: 50, duration: 30 },
    { id: 's2', name: 'Почистване на зъбен камък', price: 80, duration: 45 },
    { id: 's3', name: 'Избелване', price: 150, duration: 60 }
  ];

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    const dayOfWeekIndex = selectedDate.getDay();
    const availabilityForDay = availabilities.filter(a => a.dayOfWeek === dayOfWeekIndex && a.isAvailable);

    if (!availabilityForDay.length) return [];

    const slots: { time: string, available: boolean }[] = [];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const appointmentsForDay = appointments.filter(a => a.date.startsWith(selectedDateStr));

    availabilityForDay.forEach(availability => {
      const startMinutes = getMinutesFromTimeString(availability.startTime);
      const endMinutes = getMinutesFromTimeString(availability.endTime);
      const slotDuration = 30;

      for (let m = startMinutes; m < endMinutes; m += slotDuration) {
        const slotTime = getTimeStringFromMinutes(m);
        const slotEndTime = getTimeStringFromMinutes(m + slotDuration);
        
        const isSlotAvailable = !appointmentsForDay.some(appointment => {
          const apptStart = getMinutesFromTimeString(appointment.startTime);
          const apptEnd = getMinutesFromTimeString(appointment.endTime);
          return (m >= apptStart && m < apptEnd) || (m + slotDuration > apptStart && m < apptEnd);
        });

        slots.push({
          time: slotTime,
          available: isSlotAvailable
        });
      }
    });

    return slots;
  };

  const getMinutesFromTimeString = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getTimeStringFromMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleAddAvailability = () => {
    setSelectedAvailability(null);
    setDayOfWeek(1);
    setStartTime("09:00");
    setEndTime("17:00");
    setIsAvailable(true);
    setAvailabilityPattern('recurring');
    setIsAvailabilityDialogOpen(true);
  };

  const handleEditAvailability = (availability: DentistAvailability) => {
    setSelectedAvailability(availability);
    setDayOfWeek(availability.dayOfWeek);
    setStartTime(availability.startTime);
    setEndTime(availability.endTime);
    setIsAvailable(availability.isAvailable);
    setAvailabilityPattern('recurring');
    setIsAvailabilityDialogOpen(true);
  };

  const handleSaveAvailability = async () => {
    try {
      if (startTime >= endTime) {
        toast.error('Крайният час трябва да е след началния час');
        return;
      }

      if (selectedAvailability) {
        await availabilityService.updateAvailability({
          ...selectedAvailability,
          dayOfWeek,
          startTime,
          endTime,
          isAvailable
        });
        toast.success('Работното време е обновено успешно');
      } else {
        await availabilityService.setDentistAvailability({
          dentistId,
          dayOfWeek,
          startTime,
          endTime,
          isAvailable
        });
        toast.success('Работното време е добавено успешно');
      }
      
      setIsAvailabilityDialogOpen(false);
      refetchAvailabilities();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error('Възникна грешка при записване на работното време');
    }
  };

  const handleDeleteAvailability = async () => {
    if (!selectedAvailability) return;
    
    try {
      await availabilityService.deleteAvailability(selectedAvailability.id);
      setIsAvailabilityDialogOpen(false);
      refetchAvailabilities();
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const handleBookingDialogOpen = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedPatientId('');
    setSelectedServiceId('');
    setIsBookingDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>График</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Календар</TabsTrigger>
              <TabsTrigger value="availability">Работно време</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: bg }) : 'Изберете дата'}
                  </h3>
                  
                  {isLoadingAppointments ? (
                    <div className="flex justify-center p-4">Зареждане...</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {getAvailableTimeSlots().map((slot) => (
                          <Button
                            key={slot.time}
                            variant={slot.available ? "outline" : "ghost"}
                            disabled={!slot.available}
                            className={cn(
                              "h-12",
                              slot.available ? "hover:bg-primary/10" : "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => handleBookingDialogOpen(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      
                      {getAvailableTimeSlots().length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Няма зададено работно време за избрания ден.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Работно време</h3>
                  <Button onClick={handleAddAvailability}>
                    Добави работно време
                  </Button>
                </div>
                
                {isLoadingAvailabilities ? (
                  <div className="flex justify-center p-4">Зареждане...</div>
                ) : (
                  availabilities.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ден</TableHead>
                          <TableHead>Начален час</TableHead>
                          <TableHead>Краен час</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availabilities.map((availability) => (
                          <TableRow key={availability.id}>
                            <TableCell>
                              {daysOfWeek.find(d => d.value === availability.dayOfWeek)?.label}
                            </TableCell>
                            <TableCell>{availability.startTime}</TableCell>
                            <TableCell>{availability.endTime}</TableCell>
                            <TableCell>
                              {availability.isAvailable ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check size={16} />
                                  <span>Свободен</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X size={16} />
                                  <span>Зает</span>
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAvailability(availability)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Редактирай
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Няма зададено работно време.
                    </div>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAvailability ? 'Редактиране на работно време' : 'Добавяне на работно време'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Тип на работното време</Label>
              <RadioGroup
                value={availabilityPattern}
                onValueChange={(value) => setAvailabilityPattern(value as 'specific' | 'recurring')}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Седмично (повтарящо се)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" disabled />
                  <Label htmlFor="specific">Конкретна дата (еднократно)</Label>
                </div>
              </RadioGroup>
            </div>
            
            {availabilityPattern === 'recurring' && (
              <div className="space-y-2">
                <Label htmlFor="day">Ден от седмицата</Label>
                <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете ден" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Часови диапазон</Label>
              <TimeRange 
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="isAvailable">Свободен за записване</Label>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            {selectedAvailability && (
              <Button
                variant="destructive"
                onClick={handleDeleteAvailability}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                ��зтрий
              </Button>
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAvailabilityDialogOpen(false)}
              >
                Отказ
              </Button>
              <Button onClick={handleSaveAvailability}>
                Запази
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Записване на час</DialogTitle>
            {selectedDate && selectedTimeSlot && (
              <DialogDescription>
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: bg })} в {selectedTimeSlot}ч.
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Пациент</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Изберете пациент" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Услуга</Label>
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Изберете услуга" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration} мин.) - {service.price} лв.
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingDialogOpen(false)}
            >
              Отказ
            </Button>
            <Button
              disabled={!selectedPatientId || !selectedServiceId}
              onClick={() => {
                toast.success('Часът е записан успешно!');
                setIsBookingDialogOpen(false);
              }}
            >
              Запази час
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
