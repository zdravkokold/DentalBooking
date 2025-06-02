
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/UserManagement';
import DentistManagement from '@/components/admin/DentistManagement';
import PatientManagement from '@/components/admin/PatientManagement';
import AppointmentManagement from '@/components/admin/AppointmentManagement';
import ReportsAndAnalytics from '@/components/admin/ReportsAndAnalytics';
import { Users, UserCog, Calendar, BarChart3, User } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-dental-lightGray p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Административен панел</h1>
            <p className="text-gray-600">Управление на зъболекарска практика</p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Потребители
              </TabsTrigger>
              <TabsTrigger value="dentists" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Зъболекари
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Пациенти
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Часове
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Отчети
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="dentists">
              <DentistManagement />
            </TabsContent>

            <TabsContent value="patients">
              <PatientManagement />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentManagement />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsAndAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
