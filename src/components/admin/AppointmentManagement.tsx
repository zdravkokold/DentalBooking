
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Eye, Edit, Trash2, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface AppointmentWithDetails {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  patientName: string;
  dentistName: string;
  serviceName: string;
  servicePrice: number;
}

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [isViewingAppointment, setIsViewingAppointment] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          start_time,
          end_time,
          status,
          notes,
          profiles:patient_id (
            first_name,
            last_name
          ),
          dentists:dentist_id (
            profiles:profile_id (
              first_name,
              last_name
            )
          ),
          services:service_id (
            name,
            price
          )
        `)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;

      const appointmentsWithDetails = data?.map(appt => ({
        id: appt.id,
        date: appt.date,
        startTime: appt.start_time,
        endTime: appt.end_time,
        status: appt.status || 'pending',
        notes: appt.notes || '',
        patientName: appt.profiles && typeof appt.profiles === 'object' && !Array.isArray(appt.profiles) && appt.profiles.first_name && appt.profiles.last_name 
          ? `${appt.profiles.first_name} ${appt.profiles.last_name}`
          : 'Неизвестен пациент',
        dentistName: appt.dentists && typeof appt.dentists === 'object' && !Array.isArray(appt.dentists) && appt.dentists.profiles && typeof appt.dentists.profiles === 'object' && !Array.isArray(appt.dentists.profiles) && appt.dentists.profiles.first_name && appt.dentists.profiles.last_name 
          ? `${appt.dentists.profiles.first_name} ${appt.dentists.profiles.last_name}`
          : 'Неизвестен зъболекар',
        serviceName: appt.services && typeof appt.services === 'object' && !Array.isArray(appt.services) && appt.services.name || 'Неизвестна услуга',
        servicePrice: appt.services && typeof appt.services === 'object' && !Array.isArray(appt.services) && appt.services.price || 0,
      })) || [];

      setAppointments(appointmentsWithDetails);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Грешка при зареждане на часовете');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Статусът на часа беше обновен успешно');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Грешка при обновяване на статуса');
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този час?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Часът беше изтрит успешно');
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Грешка при изтриване на часа');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'В очакване';
      case 'confirmed': return 'Потвърден';
      case 'scheduled': return 'Насрочен';
      case 'completed': return 'Завършен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    statusFilter === 'all' || appointment.status === statusFilter
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Зареждане...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Управление на часове</CardTitle>
            <CardDescription>Преглед и управление на всички насрочени часове</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Филтър по статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички статуси</SelectItem>
                <SelectItem value="pending">В очакване</SelectItem>
                <SelectItem value="confirmed">Потвърдени</SelectItem>
                <SelectItem value="scheduled">Насрочени</SelectItem>
                <SelectItem value="completed">Завършени</SelectItem>
                <SelectItem value="cancelled">Отменени</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата и час</TableHead>
                <TableHead>Пациент</TableHead>
                <TableHead>Зъболекар</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div>{format(new Date(appointment.date), 'dd.MM.yyyy', { locale: bg })}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {appointment.patientName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-gray-500" />
                      {appointment.dentistName}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.serviceName}</TableCell>
                  <TableCell>
                    <Select 
                      value={appointment.status} 
                      onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}
                    >
                      <SelectTrigger className={`w-32 ${getStatusColor(appointment.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">В очакване</SelectItem>
                        <SelectItem value="confirmed">Потвърден</SelectItem>
                        <SelectItem value="scheduled">Насрочен</SelectItem>
                        <SelectItem value="completed">Завършен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.servicePrice} лв.
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsViewingAppointment(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View appointment dialog */}
        <Dialog open={isViewingAppointment} onOpenChange={setIsViewingAppointment}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Детайли за час</DialogTitle>
              <DialogDescription>
                Пълна информация за насрочения час
              </DialogDescription>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Дата:</label>
                    <p className="text-gray-900">
                      {format(new Date(selectedAppointment.date), 'dd.MM.yyyy, EEEE', { locale: bg })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Час:</label>
                    <p className="text-gray-900">
                      {selectedAppointment.startTime} - {selectedAppointment.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Пациент:</label>
                    <p className="text-gray-900">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Зъболекар:</label>
                    <p className="text-gray-900">{selectedAppointment.dentistName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Услуга:</label>
                    <p className="text-gray-900">{selectedAppointment.serviceName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Цена:</label>
                    <p className="text-gray-900 font-medium">{selectedAppointment.servicePrice} лв.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Статус:</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                      {getStatusText(selectedAppointment.status)}
                    </span>
                  </div>
                </div>
                
                {selectedAppointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Бележки:</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewingAppointment(false)}>Затвори</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagement;
