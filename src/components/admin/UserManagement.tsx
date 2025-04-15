import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Users } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(2, 'Името трябва да бъде поне 2 символа'),
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да бъде поне 6 символа'),
  role: z.enum(['admin', 'dentist', 'patient'], {
    required_error: 'Моля, изберете роля',
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserManagement = () => {
  const { register } = useAuth();
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      };
      
      await register(userData);
      toast.success(`${data.role === 'dentist' ? 'Зъболекарят' : 'Потребителят'} е регистриран успешно`);
      form.reset();
      setIsAddingUser(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Регистрацията не беше успешна. Моля, опитайте отново.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Управление на потребители</CardTitle>
            <CardDescription>Добавяне и управление на потребители в системата</CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingUser(!isAddingUser)} 
            className="bg-dental-teal hover:bg-opacity-90"
          >
            {isAddingUser ? 'Отказ' : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Нов потребител
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingUser ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Име</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Парола</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Роля</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете роля" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="dentist">Зъболекар</SelectItem>
                        <SelectItem value="patient">Пациент</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Регистрирай</Button>
            </form>
          </Form>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <Users className="h-16 w-16 text-gray-300" />
            <span className="ml-2 text-gray-400">Тук ще бъде таблицата с потребители</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
