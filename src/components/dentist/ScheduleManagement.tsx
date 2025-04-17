
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DentistAvailability } from '@/data/models';
import { availabilityService } from '@/services/availabilityService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Add missing supabase import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const dayNames = [
  'Неделя',
  'Понеделник',
  'Вторник',
  'Сряда',
  'Четвъртък',
  'Петък',
  'Събота'
];

const ScheduleManagement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [availability, setAvailability] = useState<Omit<DentistAvailability, 'id'>>({
    dentistId: '',
    dayOfWeek: 1, // Monday by default
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string>('');

  // Get current dentist ID
  const { data: dentistData, isLoading: isDentistLoading } = useQuery({
    queryKey: ['dentistId', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('dentists')
        .select('id')
        .eq('profile_id', user.id)
        .single();
      
      if (error) {
        toast.error('Error fetching dentist info: ' + error.message);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Query to get dentist availability
  const { data: availabilities, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ['availability', dentistData?.id],
    queryFn: () => availabilityService.getDentistAvailability(dentistData?.id || ''),
    enabled: !!dentistData?.id
  });

  // Mutation to add availability
  const addAvailabilityMutation = useMutation({
    mutationFn: availabilityService.setDentistAvailability,
    onSuccess: () => {
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });

  // Mutation to update availability
  const updateAvailabilityMutation = useMutation({
    mutationFn: availabilityService.updateAvailability,
    onSuccess: () => {
      setIsDialogOpen(false);
      setIsEditing(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });

  // Mutation to delete availability
  const deleteAvailabilityMutation = useMutation({
    mutationFn: availabilityService.deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });

  // Reset form
  const resetForm = () => {
    setAvailability({
      dentistId: dentistData?.id || '',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    });
    setCurrentId('');
  };

  // Handle dialog opening
  const handleOpenDialog = () => {
    if (dentistData?.id) {
      setAvailability(prev => ({ ...prev, dentistId: dentistData.id }));
      setIsDialogOpen(true);
    } else {
      toast.error('Не е намерена информация за зъболекаря');
    }
  };

  // Handle editing
  const handleEditAvailability = (item: DentistAvailability) => {
    setAvailability({
      dentistId: item.dentistId,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      isAvailable: item.isAvailable
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handle deletion
  const handleDeleteAvailability = (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този запис?')) {
      deleteAvailabilityMutation.mutate(id);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!availability.dentistId) {
      toast.error('Липсва информация за зъболекаря');
      return;
    }

    if (availability.startTime >= availability.endTime) {
      toast.error('Началният час трябва да е преди крайния час');
      return;
    }

    if (isEditing && currentId) {
      updateAvailabilityMutation.mutate({ ...availability, id: currentId });
    } else {
      addAvailabilityMutation.mutate(availability);
    }
  };

  const isLoading = isDentistLoading || isAvailabilityLoading;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Управление на графика</CardTitle>
          <Button 
            onClick={handleOpenDialog}
            disabled={!dentistData?.id}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Добави наличност
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div>Зареждане...</div>
            </div>
          ) : availabilities && availabilities.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ден</TableHead>
                    <TableHead>Начало</TableHead>
                    <TableHead>Край</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availabilities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{dayNames[item.dayOfWeek]}</TableCell>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>{item.endTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.isAvailable ? 'Активен' : 'Неактивен'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditAvailability(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteAvailability(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {dentistData?.id ? 'Няма записани часове на наличност' : 'Не е намерена информация за зъболекаря'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Availability Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Редактиране на наличност' : 'Добавяне на наличност'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="day" className="block text-sm font-medium mb-1">Ден от седмицата</Label>
                <Select
                  value={availability.dayOfWeek.toString()}
                  onValueChange={(value) => setAvailability({...availability, dayOfWeek: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете ден" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayNames.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startTime" className="block text-sm font-medium mb-1">Начален час</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="startTime"
                    type="time"
                    value={availability.startTime}
                    onChange={(e) => setAvailability({...availability, startTime: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endTime" className="block text-sm font-medium mb-1">Краен час</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="endTime"
                    type="time"
                    value={availability.endTime}
                    onChange={(e) => setAvailability({...availability, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={availability.isAvailable}
                  onCheckedChange={(checked) => setAvailability({...availability, isAvailable: checked})}
                />
                <Label htmlFor="isAvailable">Активна наличност</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsEditing(false);
                  resetForm();
                }}
              >
                Отказ
              </Button>
              <Button 
                type="submit"
                disabled={addAvailabilityMutation.isPending || updateAvailabilityMutation.isPending}
              >
                {isEditing 
                  ? (updateAvailabilityMutation.isPending ? 'Обновяване...' : 'Обнови') 
                  : (addAvailabilityMutation.isPending ? 'Запазване...' : 'Запази')
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
