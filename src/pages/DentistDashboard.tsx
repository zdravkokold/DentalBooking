
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Users,
  CalendarDays,
  CalendarCheck,
  Clock,
  CheckCircle,
  User,
  FileText,
  MessageSquare,
  AlertCircle,
  Calendar,
  ClipboardEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DentistDashboard = () => {
  const today = new Date().toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-dental-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-2 border-white">
              <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Д-р Мария Иванова" />
              <AvatarFallback>МИ</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">Добре дошли, д-р Иванова</h1>
              <p className="text-dental-mint">{today}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Navigation Tabs */}
          <Tabs defaultValue="today" className="mb-6">
            <TabsList className="bg-white">
              <TabsTrigger value="today">Днешни часове</TabsTrigger>
              <TabsTrigger value="schedule">График</TabsTrigger>
              <TabsTrigger value="patients">Моите пациенти</TabsTrigger>
              <TabsTrigger value="records">Медицински записи</TabsTrigger>
            </TabsList>
            
            {/* Today's Appointments Tab */}
            <TabsContent value="today" className="mt-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <CalendarDays className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Часове днес</p>
                      <h3 className="text-2xl font-bold">8</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <Clock className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Следващ час</p>
                      <h3 className="text-2xl font-bold">13:30</h3>
                      <p className="text-xs">Иван Петров</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <CheckCircle className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Завършени</p>
                      <h3 className="text-2xl font-bold">3</h3>
                      <p className="text-xs">от 8 планирани</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <AlertCircle className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Спешни случаи</p>
                      <h3 className="text-2xl font-bold">1</h3>
                      <p className="text-xs text-red-500">14:45</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Schedule */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Днешен график</CardTitle>
                  <CardDescription>Всички записани часове за днес</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">09:00</p>
                        <p className="text-xs">30 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Петър Димитров</p>
                        <p className="text-sm text-gray-500">Профилактичен преглед</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Завършен
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">10:00</p>
                        <p className="text-xs">60 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Мария Стоянова</p>
                        <p className="text-sm text-gray-500">Лечение на кариес</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Завършен
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">11:30</p>
                        <p className="text-xs">45 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Георги Николов</p>
                        <p className="text-sm text-gray-500">Професионално почистване</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Завършен
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">13:30</p>
                        <p className="text-xs">45 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Иван Петров</p>
                        <p className="text-sm text-gray-500">Лечение на кариес</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Предстои
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">14:45</p>
                        <p className="text-xs">30 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Стоян Тодоров</p>
                        <p className="text-sm text-gray-500">Спешен преглед - зъбна болка</p>
                      </div>
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Спешен
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <div className="mr-4">
                        <p className="font-bold">15:30</p>
                        <p className="text-xs">60 мин</p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Елена Тодорова</p>
                        <p className="text-sm text-gray-500">Поставяне на имплант</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Предстои
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <ClipboardEdit className="h-4 w-4" />
                  <span>Добави медицински запис</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <Calendar className="h-4 w-4" />
                  <span>Промени график</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>Изпрати съобщение</span>
                </Button>
              </div>
            </TabsContent>
            
            {/* Placeholder for other tabs */}
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Моят график</CardTitle>
                  <CardDescription>Седмичен и месечен календар</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
                    <Calendar className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде календарът</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Моите пациенти</CardTitle>
                  <CardDescription>Списък с всички пациенти под ваши грижи</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
                    <Users className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде таблицата с пациенти</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Медицински записи</CardTitle>
                  <CardDescription>История на пациентите и медицински бележки</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
                    <FileText className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъдат медицинските записи</span>
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

export default DentistDashboard;
