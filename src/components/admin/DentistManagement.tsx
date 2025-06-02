
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
import { PlusCircle, Edit, Trash2, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const dentistSchema = z.object({
  firstName: z.string().min(2, 'Името трябва да бъде поне 2 символа'),
  lastName: z.string().min(2, 'Фамилията трябва да бъде поне 2 символа'),
  email: z.string().email('Невалиден имейл адрес'),
  phone: z.string().min(8, 'Телефонът трябва да бъде поне 8 цифри'),
  specialization: z.string().min(2, 'Специализацията е задължителна'),
  yearsOfExperience: z.number().min(0, 'Годините опит не могат да бъдат отрицателни'),
  bio: z.string().optional(),
});

type DentistFormValues = z.infer<typeof dentistSchema>;

interface DentistWithProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  bio: string;
}

const DentistManagement = () => {
  const [isAddingDentist, setIsAddingDentist] = useState(false);
  const [isEditingDentist, setIsEditingDentist] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<DentistWithProfile | null>(null);
  const [dentists, setDentists] = useState<DentistWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<DentistFormValues>({
    resolver: zodResolver(dentistSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      yearsOfExperience: 0,
      bio: '',
    },
  });

  const fetchDentists = async () => {
    try {
      const { data, error } = await supabase
        .from('dentists')
        .select(`
          id,
          specialization,
          years_of_experience,
          bio,
          profiles:profile_id (
            first_name,
            last_name,
            email,
            phone
          )
        `);

      if (error) throw error;

      const dentistsWithProfiles = data?.map(dentist => ({
        id: dentist.id,
        firstName: dentist.profiles && typeof dentist.profiles === 'object' && !Array.isArray(dentist.profiles) && dentist.profiles.first_name || '',
        lastName: dentist.profiles && typeof dentist.profiles === 'object' && !Array.isArray(dentist.profiles) && dentist.profiles.last_name || '',
        email: dentist.profiles && typeof dentist.profiles === 'object' && !Array.isArray(dentist.profiles) && dentist.profiles.email || '',
        phone: dentist.profiles && typeof dentist.profiles === 'object' && !Array.isArray(dentist.profiles) && dentist.profiles.phone || '',
        specialization: dentist.specialization || '',
        yearsOfExperience: dentist.years_of_experience || 0,
        bio: dentist.bio || '',
      })) || [];

      setDentists(dentistsWithProfiles);
    } catch (error) {
      console.error('Error fetching dentists:', error);
      toast.error('Грешка при зареждане на зъболекарите');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  const onSubmit = async (data: DentistFormValues) => {
    try {
      if (isEditingDentist && selectedDentist) {
        // Update existing dentist
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
          })
          .eq('id', selectedDentist.id);

        if (profileError) throw profileError;

        const { error: dentistError } = await supabase
          .from('dentists')
          .update({
            specialization: data.specialization,
            years_of_experience: data.yearsOfExperience,
            bio: data.bio,
          })
          .eq('id', selectedDentist.id);

        if (dentistError) throw dentistError;

        toast.success('Зъболекарят беше обновен успешно');
        setIsEditingDentist(false);
        setSelectedDentist(null);
      } else {
        // Create new dentist - this would require creating a profile first
        toast.info('Създаването на нови зъболекари се извършва чрез регистрация');
      }

      form.reset();
      fetchDentists();
    } catch (error) {
      console.error('Error saving dentist:', error);
      toast.error('Грешка при запазване на зъболекаря');
    }
  };

  const openEditDialog = (dentist: DentistWithProfile) => {
    setSelectedDentist(dentist);
    form.setValue('firstName', dentist.firstName);
    form.setValue('lastName', dentist.lastName);
    form.setValue('email', dentist.email);
    form.setValue('phone', dentist.phone);
    form.setValue('specialization', dentist.specialization);
    form.setValue('yearsOfExperience', dentist.yearsOfExperience);
    form.setValue('bio', dentist.bio);
    setIsEditingDentist(true);
  };

  const handleDeleteDentist = async (dentistId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този зъболекар?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dentists')
        .delete()
        .eq('id', dentistId);

      if (error) throw error;

      toast.success('Зъболекарят беше изтрит успешно');
      fetchDentists();
    } catch (error) {
      console.error('Error deleting dentist:', error);
      toast.error('Грешка при изтриване на зъболекаря');
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
            <CardTitle>Управление на зъболекари</CardTitle>
            <CardDescription>Преглед и редактиране на информацията за зъболекарите</CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingDentist(!isAddingDentist)} 
            className="bg-dental-teal hover:bg-opacity-90"
          >
            {isAddingDentist ? 'Отказ' : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добави зъболекар
              </>
            )}
          </Button>
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
                <TableHead>Специализация</TableHead>
                <TableHead>Опит (години)</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dentists.map((dentist) => (
                <TableRow key={dentist.id}>
                  <TableCell className="font-medium">
                    {dentist.firstName} {dentist.lastName}
                  </TableCell>
                  <TableCell>{dentist.email}</TableCell>
                  <TableCell>{dentist.phone}</TableCell>
                  <TableCell>{dentist.specialization}</TableCell>
                  <TableCell>{dentist.yearsOfExperience}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(dentist)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteDentist(dentist.id)}
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

        {/* Edit dentist dialog */}
        <Dialog open={isEditingDentist} onOpenChange={setIsEditingDentist}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактиране на зъболекар</DialogTitle>
              <DialogDescription>
                Актуализирайте информацията за {selectedDentist?.firstName} {selectedDentist?.lastName}
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
                          <Input placeholder="Иван" {...field} />
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
                          <Input placeholder="Иванов" {...field} />
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
                          <Input placeholder="ivan@example.com" {...field} />
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
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Специализация</FormLabel>
                        <FormControl>
                          <Input placeholder="Общ зъболекар" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Години опит</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Биография</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Кратка биография на зъболекаря..."
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
                    onClick={() => setIsEditingDentist(false)}
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

export default DentistManagement;
