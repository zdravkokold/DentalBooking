
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, Clock, CheckCircle, AlertCircle, ClipboardEdit, MessageSquare } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/data/models';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Import dentist-specific components
import AppointmentHistory from '@/components/dentist/AppointmentHistory';
import PatientManagement from '@/components/dentist/PatientManagement';
import ScheduleManagement from '@/components/dentist/ScheduleManagement';

const DentistDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    upcoming: 0,
    today: 0,
    completed: 0,
    cancelled: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // For demo purposes, we'll use the logged-in dentist's ID
        // In a real scenario, this would come from the user object
        const dentistId = user?.id || "d1";
        
        // Fetch appointments from Supabase with services details
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            services:service_id (
              name,
              description,
              price,
              duration
            )
          `)
          .eq('dentist_id', dentistId)
          .order('date', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Map the appointments to our app model
        const mappedAppointments = data ? data.map(appointment => ({
          id: appointment.id,
          patientId: appointment.patient_id,
          dentistId: appointment.dentist_id,
          serviceId: appointment.service_id,
          date: appointment.date,
          startTime: appointment.time,
          endTime: calculateEndTime(appointment.time, appointment.services?.duration || 60),
          status: appointment.status || 'pending',
          notes: appointment.notes || '',
          createdAt: appointment.created_at,
          service: appointment.services
        })) : [];
        
        setAppointments(mappedAppointments);
        
        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        setStats({
          upcoming: mappedAppointments.filter(a => a.date > today && a.status === 'scheduled').length,
          today: mappedAppointments.filter(a => a.date === today && a.status === 'scheduled').length,
          completed: mappedAppointments.filter(a => a.status === 'completed').length,
          cancelled: mappedAppointments.filter(a => a.status === 'cancelled').length
        });
      } catch (error) {
        console.error('Failed to load appointments:', error);
        toast.error('Неуспешно зареждане на часове');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [user?.id]);

  // Helper function to calculate end time
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + durationMinutes);
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  };

  // Функции за обработка на бутоните
  const handleViewDetails = (appointmentId) => {
    toast.info('Преглед на детайли', {
      description: `Преглеждане на детайли за час #${appointmentId}`
    });
    // Тук бихме отворили модален прозорец с детайли или пренасочили към страница с детайли
  };
  
  const handleReschedule = (appointmentId) => {
    toast.info('Пренасрочване', {
      description: `Пренасрочване на час #${appointmentId}`
    });
    // Тук бихме отворили модален прозорец за пренасрочване или пренасочили към страница за пренасрочване
  };
  
  const handleRemind = (appointmentId) => {
    toast.success('Изпратено напомняне', {
      description: `Напомняне беше изпратено на пациент #${appointmentId}`
    });
    // Тук бихме изпратили напомняне на пациента
  };

  // For demo purposes, we'll try to get dentist name from user profile
  const [dentistName, setDentistName] = useState("Д-р Иванов");
  
  useEffect(() => {
    const fetchDentistName = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching dentist profile:', error);
        } else if (profile) {
          const name = `Д-р ${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          if (name !== 'Д-р') {
            setDentistName(name);
          }
        }
      } catch (error) {
        console.error('Error in fetchDentistName:', error);
      }
    };
    
    fetchDentistName();
  }, [user?.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Здравейте, {dentistName}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stats Cards */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Предстоящи часове</p>
                    <p className="text-2xl font-bold">{stats.upcoming}</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-dental-teal" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Часове днес</p>
                    <p className="text-2xl font-bold">{stats.today}</p>
                  </div>
                  <Clock className="h-8 w-8 text-dental-teal" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Завършени</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-dental-teal" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Отменени</p>
                    <p className="text-2xl font-bold">{stats.cancelled}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-dental-teal" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Предстоящи часове</CardTitle>
              <CardDescription>Прегледайте насрочените часове за следващите дни</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Зареждане...</p>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments
                    .filter(appointment => appointment.status === 'scheduled' || appointment.status === 'pending')
                    .slice(0, 5)
                    .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">Пациент #{appointment.patientId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString('bg-BG')}, {appointment.startTime}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.service?.name || 'Преглед'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment.id)}>
                          <ClipboardEdit className="h-4 w-4 mr-1" />
                          Детайли
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Пренасрочи
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRemind(appointment.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Напомни
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">Няма предстоящи часове.</p>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="schedule">
            <TabsList className="mb-6">
              <TabsTrigger value="schedule">График</TabsTrigger>
              <TabsTrigger value="patients">Пациенти</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule">
              <ScheduleManagement />
            </TabsContent>
            
            <TabsContent value="patients">
              <PatientManagement />
            </TabsContent>
            
            <TabsContent value="history">
              <AppointmentHistory />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DentistDashboard;
