
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { availabilityService } from '@/services/availabilityService';
import { DentistAvailability } from '@/data/models';
import { supabase } from '@/integrations/supabase/client';

// Helper function to get day name
const getDayName = (dayOfWeek: number): string => {
  const days = ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];
  return days[dayOfWeek];
};

const ScheduleManagement = () => {
  // For demo purposes, using a hardcoded dentist ID
  const dentistId = "d1";
  
  const [availabilities, setAvailabilities] = useState<DentistAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState<string>("1"); // Monday by default
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await availabilityService.getDentistAvailability(dentistId);
        setAvailabilities(data);
      } catch (error) {
        console.error('Failed to fetch dentist availability:', error);
        toast.error('Грешка при зареждане на график');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [dentistId]);

  const handleAddAvailability = async () => {
    if (parseInt(startTime.replace(':', '')) >= parseInt(endTime.replace(':', ''))) {
      toast.error('Началният час трябва да е преди крайния');
      return;
    }

    setIsSubmitting(true);
    try {
      await availabilityService.setDentistAvailability({
        dentistId,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        isAvailable: true
      });
      
      // Fetch updated data
      const updatedData = await availabilityService.getDentistAvailability(dentistId);
      setAvailabilities(updatedData);
      
      // Reset form
      setStartTime('09:00');
      setEndTime('17:00');
    } catch (error) {
      console.error('Failed to add availability:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      await availabilityService.deleteAvailability(id);
      setAvailabilities(availabilities.filter(a => a.id !== id));
      toast.success('Наличността е изтрита успешно');
    } catch (error) {
      console.error('Failed to delete availability:', error);
      toast.error('Грешка при изтриване на наличност');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Задайте работно време</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                Ден от седмицата
              </label>
              <Select
                value={dayOfWeek}
                onValueChange={setDayOfWeek}
              >
                <SelectTrigger id="dayOfWeek">
                  <SelectValue placeholder="Изберете ден" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Понеделник</SelectItem>
                  <SelectItem value="2">Вторник</SelectItem>
                  <SelectItem value="3">Сряда</SelectItem>
                  <SelectItem value="4">Четвъртък</SelectItem>
                  <SelectItem value="5">Петък</SelectItem>
                  <SelectItem value="6">Събота</SelectItem>
                  <SelectItem value="0">Неделя</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Начален час
              </label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                Краен час
              </label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleAddAvailability} 
                className="w-full bg-dental-teal hover:bg-dental-teal/90"
                disabled={isSubmitting}
              >
                Добави
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Текуща наличност</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Зареждане...</p>
          ) : availabilities.length > 0 ? (
            <div className="space-y-4">
              {availabilities.map((availability) => (
                <div 
                  key={availability.id} 
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium">{getDayName(availability.dayOfWeek)}</p>
                    <p className="text-sm text-gray-500">
                      {availability.startTime} - {availability.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAvailability(availability.id)}
                    >
                      Изтрий
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              Все още не сте задали наличност. Използвайте формата по-горе, за да добавите работно време.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagement;
