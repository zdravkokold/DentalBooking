import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  CalendarDays,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  User,
  Bell,
  Stethoscope,
  BadgeDollarSign,
  CalendarRange,
  History,
  PlusCircle,
  X,
  Circle as CircleIcon,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfileTab from '@/components/ui/ProfileTab';

const PatientDashboard = () => {
  const today = new Date().toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const featuredServices = services.slice(0, 3);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get tab from URL
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  useEffect(() => {
    // Set active tab from URL if present
    if (tabFromUrl && ['overview', 'appointments', 'history', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (profile) {
          console.log('Fetched user profile:', profile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user?.id]);
  
  // Fetch user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch appointments with service details using a join
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
          .eq('patient_id', user.id)
          .order('date', { ascending: true });
          
        if (error) {
          console.error('Error fetching appointments:', error);
        } else if (data) {
          console.log('Fetched appointments:', data);
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error in fetchAppointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user?.id]);
  
  // Функции за обработка на бутоните
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
        
      if (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Грешка при отказване на часа');
        return;
      }
      
      // Update local state to reflect the cancelled appointment
      setAppointments(appointments.map(a => {
        if (a.id === appointmentId) {
          return { ...a, status: 'cancelled' };
        }
        return a;
      }));
      
      toast.success('Часът е отказан успешно', {
        description: 'Вашият час беше отказан успешно.'
      });
    } catch (error) {
      console.error('Error in handleCancelAppointment:', error);
      toast.error('Грешка при отказване на часа');
    }
  };
  
  const handleRescheduleAppointment = (appointmentId) => {
    navigate('/appointments');
    toast.success('Пренасочване към промяна на час', {
      description: 'Изберете ново време за вашия час.'
    });
  };
  
  const handleBookAppointment = () => {
    navigate('/appointments');
    toast.success('Пренасочване към запазване на час', {
      description: 'Изберете зъболекар и време за вашия нов час.'
    });
  };
  
  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  // Format user name from profile
  const getUserName = () => {
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || user?.name || 'Пациент';
    }
    return user?.name || 'Пациент';
  };
  
  // Get user's birth date
  const getBirthDate = () => {
    if (userProfile && userProfile.birth_date) {
      return userProfile.birth_date;
    }
    return '';
  };
  
  // Get user's phone
  const getPhone = () => {
    if (userProfile && userProfile.phone) {
      return userProfile.phone;
    }
    return '';
  };
  
  // Get user's email
  const getEmail = () => {
    if (userProfile && userProfile.email) {
      return user?.email || '';
    }
    return '';
  };
  
  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today && appointment.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Get past appointments
  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate < today || appointment.status === 'completed';
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by descending date
  };
  
  // Calculate days until appointment
  const getDaysUntilAppointment = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Convert time difference to days and return as number
    const diffTime = appointmentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('bg-BG', options);
  };
  
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-dental-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Здравейте, {getUserName()}!</h1>
              <p className="text-dental-mint">{today}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-white">
              <TabsTrigger value="overview">Начало</TabsTrigger>
              <TabsTrigger value="appointments">Моите часове</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
              <TabsTrigger value="profile">Профил</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              {/* Overview Tab Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {upcomingAppointments.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Предстоящ час</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <Clock className="h-3 w-3 mr-1" /> След {getDaysUntilAppointment(upcomingAppointments[0].date)} дни
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="bg-dental-lightGray p-3 rounded-full mr-4">
                            <Calendar className="h-8 w-8 text-dental-teal" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{formatDate(upcomingAppointments[0].date)}</p>
                            <p className="text-gray-600">{upcomingAppointments[0].time}</p>
                            <div className="mt-2">
                              <Badge variant="outline" className="mr-2 bg-gray-50">Д-р Мария Иванова</Badge>
                              <Badge variant="outline" className="bg-gray-50">
                                {upcomingAppointments[0].services?.name || 'Преглед'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCancelAppointment(upcomingAppointments[0].id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Откажи
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRescheduleAppointment(upcomingAppointments[0].id)}
                        >
                          <CalendarRange className="h-4 w-4 mr-1" /> Промени
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Нямате предстоящи часове</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          Все още не сте запазили час. Можете да запазите нов час, като кликнете на бутона по-долу.
                        </p>
                        <Button className="bg-dental-teal hover:bg-dental-teal/90" onClick={handleBookAppointment}>
                          <CalendarDays className="h-4 w-4 mr-1" /> Запазете час сега
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Моят план за лечение</CardTitle>
                      <CardDescription>Предстоящи процедури и лечение</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {upcomingAppointments.length > 0 ? (
                          <li className="flex items-center">
                            <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{upcomingAppointments[0].services?.name || 'Преглед'}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(upcomingAppointments[0].date)}, {upcomingAppointments[0].time}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Насрочен</Badge>
                          </li>
                        ) : null}
                        <li className="flex items-center">
                          <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                            <CircleIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">Лечение на кариес (горе вляво)</p>
                            <p className="text-sm text-gray-500">Препоръчано от д-р Иванова</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleBookAppointment()}>
                            <CalendarDays className="h-4 w-4 mr-1" /> Запази час
                          </Button>
                        </li>
                        <li className="flex items-center">
                          <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                            <CircleIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">Професионално почистване</p>
                            <p className="text-sm text-gray-500">Препоръчано от д-р Иванова</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleBookAppointment()}>
                            <CalendarDays className="h-4 w-4 mr-1" /> Запази час
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Информация за пациента</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{getUserName()}</span>
                      </div>
                      {getBirthDate() && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{getBirthDate()}</span>
                        </div>
                      )}
                      {getPhone() && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{getPhone()}</span>
                        </div>
                      )}
                      {getEmail() && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{getEmail()}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('profile')}>
                        Редактирай профила
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Известия</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Напомняне за час</p>
                            <p className="text-xs text-gray-500">Имате час след {upcomingAppointments.length > 0 ? getDaysUntilAppointment(upcomingAppointments[0].date) : '3'} дни</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <BadgeDollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Промоция</p>
                            <p className="text-xs text-gray-500">20% отстъпка за избелване през април</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Stethoscope className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Напомняне</p>
                            <p className="text-xs text-gray-500">Време е за вашия 6-месечен преглед</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Препоръчани услуги</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Appointments Tab */}
            <TabsContent value="appointments" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Запази нов час</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => handleBookAppointment()}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Нов час
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Предстоящи часове</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <p className="text-center py-4">Зареждане...</p>
                      ) : upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <div className="mr-4">
                              <p className="font-bold">{formatDate(appointment.date).split(' ').slice(0, 2).join(' ')}</p>
                              <p className="text-xs">{appointment.time}</p>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{appointment.services?.name || 'Преглед'}</p>
                              <p className="text-sm text-gray-500">Д-р Мария Иванова</p>
                            </div>
                            <div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <X className="h-4 w-4 mr-1" /> Откажи
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-gray-500">Нямате предстоящи часове</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>История на посещенията</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-center py-4">Зареждане...</p>
                    ) : pastAppointments.length > 0 ? (
                      pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                          <div className="mr-4">
                            <p className="font-bold">{formatDate(appointment.date).split(' ').slice(0, 2).join(' ')}</p>
                            <p className="text-xs">{appointment.time}</p>
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">{appointment.services?.name || 'Преглед'}</p>
                            <p className="text-sm text-gray-500">Д-р Мария Иванова</p>
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewAppointmentDetails(appointment)}
                            >
                              <FileText className="h-4 w-4 mr-1" /> Детайли
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">Нямате история на посещения</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <ProfileTab 
                profileData={{
                  name: getUserName(),
                  email: getEmail(),
                  phone: getPhone(),
                  birthDate: getBirthDate(),
                  healthStatus: userProfile?.health_status || '',
                  address: userProfile?.address || ''
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Details Dialog */}
      {selectedAppointment && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Детайли за посещението</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Дата:</p>
                  <p className="font-medium">{formatDate(selectedAppointment.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Час:</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Услуга:</p>
                  <p className="font-medium">{selectedAppointment.services?.name || 'Преглед'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Статус:</p>
                  <Badge className={
                    selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {selectedAppointment.status === 'completed' ? 'Приключен' :
                     selectedAppointment.status === 'cancelled' ? 'Отказан' :
                     'Предстоящ'}
                  </Badge>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-500">Бележки:</p>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Затвори
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

// Helper components
const CheckCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default PatientDashboard;
