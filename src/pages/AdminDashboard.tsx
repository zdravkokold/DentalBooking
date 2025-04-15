import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartPie,
  Users,
  CalendarDays,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  User,
  Settings,
  FileText,
  MessageSquare,
  PlusCircle,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-dental-teal py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Административен Панел</h1>
          <p className="text-dental-mint">Управление на дентална клиника</p>
        </div>
      </div>

      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="bg-white">
              <TabsTrigger value="overview">Обща информация</TabsTrigger>
              <TabsTrigger value="patients">Пациенти</TabsTrigger>
              <TabsTrigger value="dentists">Зъболекари</TabsTrigger>
              <TabsTrigger value="appointments">Часове</TabsTrigger>
              <TabsTrigger value="services">Услуги</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <Users className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Общо пациенти</p>
                      <h3 className="text-2xl font-bold">1,248</h3>
                      <p className="text-xs text-green-500">+12% този месец</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <CalendarDays className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Часове днес</p>
                      <h3 className="text-2xl font-bold">24</h3>
                      <p className="text-xs text-amber-500">-3% спрямо вчера</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <Stethoscope className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Общо услуги</p>
                      <h3 className="text-2xl font-bold">14</h3>
                      <p className="text-xs text-green-500">+2 нови услуги</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="bg-dental-teal/10 p-3 rounded-full mr-4">
                      <AlertTriangle className="h-8 w-8 text-dental-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Спешни случаи</p>
                      <h3 className="text-2xl font-bold">3</h3>
                      <p className="text-xs text-red-500">Изисква внимание</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>Месечна натовареност</div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardTitle>
                    <CardDescription>Брой пациенти и процедури по месеци</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                      <ChartPie className="h-16 w-16 text-gray-300" />
                      <span className="ml-2 text-gray-400">Тук ще бъде графиката</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Последна активност</CardTitle>
                    <CardDescription>Последни действия в системата</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Нов пациент регистриран</p>
                          <p className="text-xs text-gray-500">Преди 14 минути</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <CalendarCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Потвърден час за д-р Иванов</p>
                          <p className="text-xs text-gray-500">Преди 32 минути</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Отменен час за днес</p>
                          <p className="text-xs text-gray-500">Преди 1 час</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <Settings className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Обновени настройки за система</p>
                          <p className="text-xs text-gray-500">Преди 3 часа</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <PlusCircle className="h-4 w-4" />
                  <span>Нов пациент</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <CalendarDays className="h-4 w-4" />
                  <span>Запази час</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <FileText className="h-4 w-4" />
                  <span>Нова фактура</span>
                </Button>
                <Button className="flex items-center justify-center gap-2 h-auto py-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>Изпрати съобщение</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="patients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на пациенти</CardTitle>
                  <CardDescription>Списък с всички регистрирани пациенти</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                    <Users className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде таблицата с пациенти</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dentists" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на зъболекари</CardTitle>
                  <CardDescription>Списък с всички зъболекари в клиниката</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                    <Users className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде таблицата със зъболекари</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на часове</CardTitle>
                  <CardDescription>Всички запазени часове</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                    <CalendarDays className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде календарът с часове</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на услуги</CardTitle>
                  <CardDescription>Списък с всички предлагани услуги</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                    <Stethoscope className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъде таблицата с услуги</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки на системата</CardTitle>
                  <CardDescription>Общи настройки на приложението</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                    <Settings className="h-16 w-16 text-gray-300" />
                    <span className="ml-2 text-gray-400">Тук ще бъдат настройките</span>
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

export default AdminDashboard;
