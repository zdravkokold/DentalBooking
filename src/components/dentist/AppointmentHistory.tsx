
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { bg } from 'date-fns/locale';
import { appointmentService } from '@/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Calendar, Calendar as CalendarIcon, Filter, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AppointmentHistory, Report } from '@/data/models';

const AppointmentHistoryComponent = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentHistory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  const [reportData, setReportData] = useState<Report | null>(null);

  // Query for appointment history
  const { data: appointmentHistory, isLoading } = useQuery({
    queryKey: ['appointmentHistory', period],
    queryFn: () => appointmentService.getAppointmentHistory(period),
  });

  // Generate report
  const generateReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Моля, изберете период за справката');
      return;
    }

    try {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      const report = await appointmentService.generateReport(startDate, endDate);
      setReportData(report);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Грешка при генериране на справка');
    }
  };

  // Export report as CSV
  const exportReportCsv = () => {
    if (!appointmentHistory || appointmentHistory.length === 0) {
      toast.error('Няма данни за експорт');
      return;
    }

    const headers = ['Дата', 'Час', 'Пациент', 'Услуга', 'Статус'];
    const csvData = appointmentHistory.map(item => [
      format(parseISO(item.appointment.date), 'dd.MM.yyyy'),
      `${item.appointment.startTime} - ${item.appointment.endTime}`,
      item.patient.name,
      item.service.name,
      getStatusText(item.appointment.status)
    ]);
    
    // Add headers to CSV data
    csvData.unshift(headers);
    
    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `appointment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Предстоящ';
      case 'completed': return 'Приключен';
      case 'cancelled': return 'Отказан';
      default: return status;
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // View appointment details
  const viewAppointmentDetails = (appointment: AppointmentHistory) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>История на записванията</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FileText className="h-4 w-4" /> Справка
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={exportReportCsv}
              disabled={!appointmentHistory || appointmentHistory.length === 0}
            >
              <Download className="h-4 w-4" /> Експорт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'all')}>
            <TabsList>
              <TabsTrigger value="week">Тази седмица</TabsTrigger>
              <TabsTrigger value="month">Този месец</TabsTrigger>
              <TabsTrigger value="all">Всички</TabsTrigger>
            </TabsList>

            {['week', 'month', 'all'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div>Зареждане...</div>
                  </div>
                ) : appointmentHistory && appointmentHistory.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Час</TableHead>
                          <TableHead>Пациент</TableHead>
                          <TableHead>Услуга</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointmentHistory.map((item) => (
                          <TableRow key={item.appointment.id}>
                            <TableCell>
                              {format(parseISO(item.appointment.date), 'dd.MM.yyyy')}
                            </TableCell>
                            <TableCell>
                              {`${item.appointment.startTime} - ${item.appointment.endTime}`}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.patient.name}
                            </TableCell>
                            <TableCell>{item.service.name}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(item.appointment.status)}`}>
                                {getStatusText(item.appointment.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewAppointmentDetails(item)}
                              >
                                Детайли
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Няма записвания за избрания период
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Детайли за записването</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Дата</p>
                  <p>{format(parseISO(selectedAppointment.appointment.date), 'dd.MM.yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Час</p>
                  <p>{`${selectedAppointment.appointment.startTime} - ${selectedAppointment.appointment.endTime}`}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Пациент</p>
                  <p>{selectedAppointment.patient.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Телефон</p>
                  <p>{selectedAppointment.patient.phone || 'Няма'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium text-gray-500">Здравен статус</p>
                  <p>{selectedAppointment.patient.healthStatus || 'Няма информация'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium text-gray-500">Услуга</p>
                  <p>{selectedAppointment.service.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Цена</p>
                  <p>{selectedAppointment.service.price} лв.</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Продължителност</p>
                  <p>{selectedAppointment.service.duration} минути</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Статус</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(selectedAppointment.appointment.status)}`}>
                    {getStatusText(selectedAppointment.appointment.status)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Създаден на</p>
                  <p>{format(parseISO(selectedAppointment.appointment.createdAt), 'dd.MM.yyyy HH:mm')}</p>
                </div>
                {selectedAppointment.appointment.notes && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium text-gray-500">Бележки</p>
                    <p className="text-sm">{selectedAppointment.appointment.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)}>
                  Затвори
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Генериране на справка</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Изберете период</label>
              <div>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={generateReport}
            >
              Генерирай справка
            </Button>

            {reportData && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Резултати от {format(parseISO(reportData.startDate), 'dd.MM.yyyy')} до {format(parseISO(reportData.endDate), 'dd.MM.yyyy')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-500">Общо записвания</p>
                    <p className="text-2xl font-bold">{reportData.totalAppointments}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-green-500">Приключени</p>
                    <p className="text-2xl font-bold">{reportData.completedAppointments}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-sm text-red-500">Отказани</p>
                    <p className="text-2xl font-bold">{reportData.cancelledAppointments}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-purple-500">Уникални пациенти</p>
                    <p className="text-2xl font-bold">{reportData.patientCount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentHistoryComponent;
