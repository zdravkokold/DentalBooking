
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да бъде поне 6 символа'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User is logged in with role:", user.role);
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'dentist':
          navigate('/dentist');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, navigate]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log("Login attempt with:", data.email);
      await login(data.email, data.password);
      // Navigation will happen in the useEffect above once the user state is updated
    } catch (error) {
      console.error('Login submission error:', error);
      toast.error('Възникна грешка при вход. Моля, опитайте отново.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-dental-lightGray py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-dental-teal">Вход в системата</CardTitle>
            <CardDescription>Въведете вашите данни, за да продължите</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имейл адрес</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input placeholder="вашият@имейл.com" className="pl-10" {...field} />
                        </div>
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-dental-teal"
                    onClick={() => navigate('/register')}
                    type="button"
                  >
                    Създаване на акаунт
                  </Button>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-dental-teal"
                    type="button"
                  >
                    Забравена парола?
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-dental-teal hover:bg-opacity-90" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Вход...' : 'Вход'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
