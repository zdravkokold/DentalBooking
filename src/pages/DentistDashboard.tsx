
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, Clock, CheckCircle, AlertCircle, ClipboardEdit, MessageSquare } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/data/models';

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

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // For demo purposes, we'll use a hardcoded dentist ID
        const dentistId = "d1"; // Replace with actual dentist ID when available
        const appointmentsData = await appointmentService.getDentistAppointments(dentistId);
        setAppointments(appointmentsData);
        
        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        setStats({
          upcoming: appointmentsData.filter(a => a.date > today && a.status === 'scheduled').length,
          today: appointmentsData.filter(a => a.date === today && a.status === 'scheduled').length,
          completed: appointmentsData.filter(a => a.status === 'completed').length,
          cancelled: appointmentsData.filter(a => a.status === 'cancelled').length
        });
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // For demo purposes, we'll use a hardcoded dentist name
  const dentistName = user?.name || "Д-р Иванов";

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
                  {appointments.slice(0, 5).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">Пациент #{appointment.patientId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString('bg-BG')}, {appointment.startTime}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ClipboardEdit className="h-4 w-4 mr-1" />
                          Детайли
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Пренасрочи
                        </Button>
                        <Button variant="outline" size="sm">
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
