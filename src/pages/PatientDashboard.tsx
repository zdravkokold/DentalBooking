
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const PatientDashboard = () => {
  const today = new Date().toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const featuredServices = services.slice(0, 3);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Функции за обработка на бутоните
  const handleCancelAppointment = (appointmentId) => {
    toast.success('Часът е отказан успешно', {
      description: 'Вашият час беше отказан успешно.'
    });
    // В реалния случай бихме изпратили заявка към API за отмяна на часа
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
  
  const handleViewAppointmentDetails = (appointmentId) => {
    toast.info('Преглед на детайли за час', {
      description: `Преглеждане на информация за час #${appointmentId}`
    });
    // Тук бихме отворили модален прозорец с детайли или пренасочили към страница с детайли
  };
  
  const handleEditProfile = () => {
    setActiveTab('profile');
    toast.info('Редактиране на профил', {
      description: 'Сега можете да редактирате вашия профил.'
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-dental-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-2 border-white">
              <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Мария Георгиева" />
              <AvatarFallback>МГ</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">Здравейте, {user?.name || 'Мария'}!</h1>
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
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Предстоящ час</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          <Clock className="h-3 w-3 mr-1" /> След 3 дни
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="bg-dental-lightGray p-3 rounded-full mr-4">
                          <Calendar className="h-8 w-8 text-dental-teal" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Петък, 19 април 2025</p>
                          <p className="text-gray-600">14:30 - 15:15</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 bg-gray-50">Д-р Мария Иванова</Badge>
                            <Badge variant="outline" className="bg-gray-50">Профилактичен преглед</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleCancelAppointment('upcoming-1')}>
                        <X className="h-4 w-4 mr-1" /> Откажи
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRescheduleAppointment('upcoming-1')}>
                        <CalendarRange className="h-4 w-4 mr-1" /> Промени
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Моят план за лечение</CardTitle>
                      <CardDescription>Предстоящи процедури и лечение</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">Профилактичен преглед</p>
                            <p className="text-sm text-gray-500">19 април 2025, 14:30</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Насрочен</Badge>
                        </li>
                        <li className="flex items-center">
                          <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                            <Circle className="h-5 w-5 text-gray-600" />
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
                            <Circle className="h-5 w-5 text-gray-600" />
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
                        <span className="text-gray-700">Мария Георгиева</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">15.06.1990</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">+359 888 123 456</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">maria@example.com</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={handleEditProfile}>
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
                            <p className="text-xs text-gray-500">Имате час след 3 дни</p>
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
                      <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <div className="mr-4">
                          <p className="font-bold">19 Апр</p>
                          <p className="text-xs">14:30</p>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">Профилактичен преглед</p>
                          <p className="text-sm text-gray-500">Д-р Мария Иванова</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" onClick={() => handleCancelAppointment('appointment-1')}>
                            <X className="h-4 w-4 mr-1" /> Откажи
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <div className="mr-4">
                          <p className="font-bold">15 Май</p>
                          <p className="text-xs">10:00</p>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">Професионално почистване</p>
                          <p className="text-sm text-gray-500">Д-р Петър Димитров</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" onClick={() => handleCancelAppointment('appointment-2')}>
                            <X className="h-4 w-4 mr-1" /> Откажи
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>История на посещенията</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">10 Дек 2024</p>
                        <p className="text-xs">11:30</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Профилактичен преглед</p>
                        <p className="text-sm text-gray-500">Д-р Мария Иванова</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => handleViewAppointmentDetails('history-1')}>
                          <FileText className="h-4 w-4 mr-1" /> Детайли
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">5 Юни 2024</p>
                        <p className="text-xs">15:00</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Лечение на кариес</p>
                        <p className="text-sm text-gray-500">Д-р Мария Иванова</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => handleViewAppointmentDetails('history-2')}>
                          <FileText className="h-4 w-4 mr-1" /> Детайли
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">20 Дек 2023</p>
                        <p className="text-xs">10:00</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Професионално почистване</p>
                        <p className="text-sm text-gray-500">Д-р Петър Димитров</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => handleViewAppointmentDetails('history-3')}>
                          <FileText className="h-4 w-4 mr-1" /> Детайли
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Моят профил</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Име</label>
                        <input type="text" defaultValue="Мария Георгиева" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Дата на раждане</label>
                        <input type="date" defaultValue="1990-06-15" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Телефон</label>
                        <input type="tel" defaultValue="+359 888 123 456" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Имейл</label>
                        <input type="email" defaultValue="maria@example.com" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => toast.success('Профилът е обновен успешно')}>Запази промените</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const CheckCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Circle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Phone = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Mail = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default PatientDashboard;
