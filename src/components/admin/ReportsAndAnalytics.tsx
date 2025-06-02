
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';
import { Calendar, Users, TrendingUp, DollarSign, Download, BarChart3 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { bg } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface ReportData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  uniquePatients: number;
  averageRevenuePerAppointment: number;
}

interface ChartData {
  name: string;
  appointments: number;
  revenue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsAndAnalytics = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    uniquePatients: 0,
    averageRevenuePerAppointment: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const generateReport = async () => {
    setLoading(true);
    try {
      let reportStartDate = startDate;
      let reportEndDate = endDate;

      if (period === 'week') {
        reportStartDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        reportEndDate = format(endOfWeek(new Date()), 'yyyy-MM-dd');
      } else if (period === 'month') {
        reportStartDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        reportEndDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      }

      // Fetch appointments with related data
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services:service_id (
            price
          )
        `)
        .gte('date', reportStartDate)
        .lte('date', reportEndDate);

      if (error) throw error;

      const appointmentsData = appointments || [];
      
      // Calculate report data
      const totalAppointments = appointmentsData.length;
      const completedAppointments = appointmentsData.filter(a => a.status === 'completed').length;
      const cancelledAppointments = appointmentsData.filter(a => a.status === 'cancelled').length;
      const pendingAppointments = appointmentsData.filter(a => a.status === 'pending').length;
      
      const totalRevenue = appointmentsData
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.services?.price || 0), 0);
      
      const uniquePatients = new Set(appointmentsData.map(a => a.patient_id)).size;
      const averageRevenuePerAppointment = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

      setReportData({
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
        totalRevenue,
        uniquePatients,
        averageRevenuePerAppointment,
      });

      // Generate chart data (daily breakdown)
      const dailyData: { [key: string]: { appointments: number; revenue: number } } = {};
      
      appointmentsData.forEach(appointment => {
        const date = appointment.date;
        if (!dailyData[date]) {
          dailyData[date] = { appointments: 0, revenue: 0 };
        }
        dailyData[date].appointments++;
        if (appointment.status === 'completed') {
          dailyData[date].revenue += appointment.services?.price || 0;
        }
      });

      const chartDataArray = Object.entries(dailyData)
        .map(([date, data]) => ({
          name: format(new Date(date), 'dd.MM', { locale: bg }),
          appointments: data.appointments,
          revenue: data.revenue,
        }))
        .sort((a, b) => new Date(a.name.split('.').reverse().join('-')).getTime() - new Date(b.name.split('.').reverse().join('-')).getTime());

      setChartData(chartDataArray);

      // Status distribution for pie chart
      const statusDistribution = [
        { name: 'Завършени', value: completedAppointments, color: '#00C49F' },
        { name: 'В очакване', value: pendingAppointments, color: '#FFBB28' },
        { name: 'Отменени', value: cancelledAppointments, color: '#FF8042' },
      ].filter(item => item.value > 0);

      setStatusData(statusDistribution);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Грешка при генериране на отчета');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [period]);

  const handleCustomPeriodGenerate = () => {
    if (!startDate || !endDate) {
      toast.error('Моля въведете начална и крайна дата');
      return;
    }
    generateReport();
  };

  const exportReport = () => {
    const reportContent = `
Отчет за зъболекарска практика
Период: ${format(new Date(startDate), 'dd.MM.yyyy', { locale: bg })} - ${format(new Date(endDate), 'dd.MM.yyyy', { locale: bg })}

Общи статистики:
- Общо часове: ${reportData.totalAppointments}
- Завършени часове: ${reportData.completedAppointments}
- Отменени часове: ${reportData.cancelledAppointments}
- В очакване: ${reportData.pendingAppointments}
- Общи приходи: ${reportData.totalRevenue.toFixed(2)} лв.
- Уникални пациенти: ${reportData.uniquePatients}
- Среден приход на час: ${reportData.averageRevenuePerAppointment.toFixed(2)} лв.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${startDate}-${endDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Отчетът беше експортиран успешно');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Генериране на отчет...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Генериране на отчети</CardTitle>
          <CardDescription>Изберете период за генериране на подробен отчет</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod as any}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Изберете период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Тази седмица</SelectItem>
                <SelectItem value="month">Този месец</SelectItem>
                <SelectItem value="custom">Персонализиран период</SelectItem>
              </SelectContent>
            </Select>

            {period === 'custom' && (
              <>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
                <span>до</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
                <Button onClick={handleCustomPeriodGenerate}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Генерирай
                </Button>
              </>
            )}

            <Button onClick={exportReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Експортирай
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общо часове</p>
                <p className="text-3xl font-bold text-dental-teal">{reportData.totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-dental-teal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Уникални пациенти</p>
                <p className="text-3xl font-bold text-blue-600">{reportData.uniquePatients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общи приходи</p>
                <p className="text-3xl font-bold text-green-600">{reportData.totalRevenue.toFixed(2)} лв.</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Среден приход/час</p>
                <p className="text-3xl font-bold text-purple-600">{reportData.averageRevenuePerAppointment.toFixed(2)} лв.</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments and Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Дневни часове и приходи</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="appointments" fill="#3b82f6" name="Часове" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Приходи (лв.)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Разпределение по статус</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Подробна статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Завършени часове</h3>
              <p className="text-3xl font-bold text-green-600">{reportData.completedAppointments}</p>
              <p className="text-sm text-green-600">
                {reportData.totalAppointments > 0 
                  ? `${((reportData.completedAppointments / reportData.totalAppointments) * 100).toFixed(1)}%`
                  : '0%'
                } от общо часове
              </p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">В очакване</h3>
              <p className="text-3xl font-bold text-yellow-600">{reportData.pendingAppointments}</p>
              <p className="text-sm text-yellow-600">
                {reportData.totalAppointments > 0 
                  ? `${((reportData.pendingAppointments / reportData.totalAppointments) * 100).toFixed(1)}%`
                  : '0%'
                } от общо часове
              </p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Отменени часове</h3>
              <p className="text-3xl font-bold text-red-600">{reportData.cancelledAppointments}</p>
              <p className="text-sm text-red-600">
                {reportData.totalAppointments > 0 
                  ? `${((reportData.cancelledAppointments / reportData.totalAppointments) * 100).toFixed(1)}%`
                  : '0%'
                } от общо часове
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAndAnalytics;
