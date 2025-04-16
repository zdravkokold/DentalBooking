
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
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Users, UserCog, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Mock users data - in a real app, this would come from your API
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "2", name: "Doctor Smith", email: "doctor@example.com", role: "dentist" },
  { id: "3", name: "Patient Johnson", email: "patient@example.com", role: "patient" },
  { id: "4", name: "Jane Doe", email: "jane@example.com", role: "patient" },
  { id: "5", name: "Doctor Brown", email: "brown@example.com", role: "dentist" },
];

const userSchema = z.object({
  name: z.string().min(2, 'Името трябва да бъде поне 2 символа'),
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да бъде поне 6 символа'),
});

const roleChangeSchema = z.object({
  role: z.enum(['admin', 'dentist', 'patient'], {
    required_error: 'Моля, изберете роля',
  }),
});

type UserFormValues = z.infer<typeof userSchema>;
type RoleFormValues = z.infer<typeof roleChangeSchema>;

const UserManagement = () => {
  const { register } = useAuth();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string, email: string, role: string} | null>(null);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleChangeSchema),
    defaultValues: {
      role: 'patient',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'patient' as 'admin' | 'dentist' | 'patient' // Fixed type issue here
      };
      
      await register(userData);
      toast.success('Потребителят е регистриран успешно');
      form.reset();
      setIsAddingUser(false);
      
      // In a real app, you would refresh your user list here
      // For now, we'll simulate adding the new user to our mock data
      setUsers([...users, {
        id: (users.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role
      }]);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Регистрацията не беше успешна. Моля, опитайте отново.');
    }
  };

  const openRoleDialog = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    roleForm.setValue('role', user.role as 'admin' | 'dentist' | 'patient');
    setIsEditingRole(true);
  };

  const handleRoleChange = async (data: RoleFormValues) => {
    if (!selectedUser) return;
    
    try {
      // In a real app with Supabase, we would update the profile here
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ role: data.role })
      //   .eq('id', selectedUser.id);
      
      // if (error) throw error;
      
      // For now, we'll update our mock data
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, role: data.role } : user
      );
      
      setUsers(updatedUsers);
      toast.success(`Ролята на ${selectedUser.name} беше променена на ${data.role === 'admin' ? 'администратор' : data.role === 'dentist' ? 'зъболекар' : 'пациент'}`);
      setIsEditingRole(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Промяната на ролята не беше успешна.');
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
              
              <Button type="submit" className="w-full">Регистрирай</Button>
            </form>
          </Form>
        ) : (
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Име</TableHead>
                  <TableHead>Имейл</TableHead>
                  <TableHead>Роля</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? 'Администратор' : 
                       user.role === 'dentist' ? 'Зъболекар' : 'Пациент'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openRoleDialog(user)}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Промяна на роля
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Role editing dialog */}
        <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Промяна на роля</DialogTitle>
              <DialogDescription>
                Актуализирайте ролята на {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...roleForm}>
              <form onSubmit={roleForm.handleSubmit(handleRoleChange)}>
                <FormField
                  control={roleForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Роля</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditingRole(false)}
                  >
                    Отказ
                  </Button>
                  <Button type="submit">Запази</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
