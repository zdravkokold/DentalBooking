
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Edit, Trash2, User, Eye } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const patientSchema = z.object({
  firstName: z.string().min(2, 'Името трябва да бъде поне 2 символа'),
  lastName: z.string().min(2, 'Фамилията трябва да бъде поне 2 символа'),
  email: z.string().email('Невалиден имейл адрес'),
  phone: z.string().min(8, 'Телефонът трябва да бъде поне 8 цифри'),
  address: z.string().optional(),
  healthStatus: z.string().optional(),
  birthDate: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  healthStatus: string;
  birthDate: string;
}

const PatientManagement = () => {
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isViewingPatient, setIsViewingPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      healthStatus: '',
      birthDate: '',
    },
  });

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');

      if (error) throw error;

      const patientsData = data?.map(profile => ({
        id: profile.id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        healthStatus: profile.health_status || '',
        birthDate: profile.birth_date || '',
      })) || [];

      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Грешка при зареждане на пациентите');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onSubmit = async (data: PatientFormValues) => {
    if (!selectedPatient) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address || null,
          health_status: data.healthStatus || null,
          birth_date: data.birthDate || null,
        })
        .eq('id', selectedPatient.id);

      if (error) throw error;

      toast.success('Пациентът беше обновен успешно');
      setIsEditingPatient(false);
      setSelectedPatient(null);
      form.reset();
      fetchPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Грешка при обновяване на пациента');
    }
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue('firstName', patient.firstName);
    form.setValue('lastName', patient.lastName);
    form.setValue('email', patient.email);
    form.setValue('phone', patient.phone);
    form.setValue('address', patient.address);
    form.setValue('healthStatus', patient.healthStatus);
    form.setValue('birthDate', patient.birthDate);
    setIsEditingPatient(true);
  };

  const openViewDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewingPatient(true);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този пациент?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      toast.success('Пациентът беше изтрит успешно');
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Грешка при изтриване на пациента');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Зареждане...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Управление на пациенти</CardTitle>
            <CardDescription>Преглед и редактиране на информацията за пациентите</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Имейл</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Дата на раждане</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.birthDate || 'Не е указана'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openViewDialog(patient)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(patient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
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

        {/* View patient dialog */}
        <Dialog open={isViewingPatient} onOpenChange={setIsViewingPatient}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Информация за пациент</DialogTitle>
              <DialogDescription>
                Детайли за {selectedPatient?.firstName} {selectedPatient?.lastName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPatient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Име:</label>
                    <p className="text-gray-900">{selectedPatient.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Фамилия:</label>
                    <p className="text-gray-900">{selectedPatient.lastName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Имейл:</label>
                    <p className="text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Телефон:</label>
                    <p className="text-gray-900">{selectedPatient.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Дата на раждане:</label>
                    <p className="text-gray-900">{selectedPatient.birthDate || 'Не е указана'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Адрес:</label>
                    <p className="text-gray-900">{selectedPatient.address || 'Не е указан'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Здравословно състояние:</label>
                  <p className="text-gray-900">{selectedPatient.healthStatus || 'Не е указано'}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewingPatient(false)}>Затвори</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit patient dialog */}
        <Dialog open={isEditingPatient} onOpenChange={setIsEditingPatient}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактиране на пациент</DialogTitle>
              <DialogDescription>
                Актуализирайте информацията за {selectedPatient?.firstName} {selectedPatient?.lastName}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Име</FormLabel>
                        <FormControl>
                          <Input placeholder="Мария" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input placeholder="Иванова" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имейл адрес</FormLabel>
                        <FormControl>
                          <Input placeholder="maria@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="0888123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата на раждане</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Адрес</FormLabel>
                        <FormControl>
                          <Input placeholder="ул. Витоша 15, София" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Здравословно състояние</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Информация за здравословното състояние..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditingPatient(false)}
                  >
                    Отказ
                  </Button>
                  <Button type="submit">Запази промените</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientManagement;
