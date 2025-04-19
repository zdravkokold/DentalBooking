import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  href: string;
}

const DashboardCard = ({ title, children, icon, href }: DashboardCardProps) => (
  <Link to={href}>
    <Card className="h-full transition-all hover:shadow-lg hover:border-dental-teal">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="w-10 h-10 bg-dental-teal rounded-full flex items-center justify-center text-white">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{children}</p>
      </CardContent>
    </Card>
  </Link>
);

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-dental-lightGray p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <DashboardCard 
              title="Управление на зъболекари" 
              icon={<User className="h-6 w-6" />}
              href="/admin/dentists"
            >
              Преглед и управление на всички зъболекари в системата.
            </DashboardCard>
            
            <DashboardCard 
              title="Управление на пациенти" 
              icon={<Users className="h-6 w-6" />}
              href="/admin/patients"
            >
              Преглед и управление на всички пациенти в системата.
            </DashboardCard>
            
            <DashboardCard 
              title="Управление на часове" 
              icon={<Calendar className="h-6 w-6" />}
              href="/admin/appointments"
            >
              Преглед и управление на всички часове в системата.
            </DashboardCard>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Последна активност</h2>
            {/* Activity list or table here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
