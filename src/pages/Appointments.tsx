
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CalendarComponent from '@/components/CalendarComponent';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dentists, services } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

const Appointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDentist, setSelectedDentist] = useState<string>(searchParams.get('dentistId') || 'all');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('serviceId') || 'all');

  useEffect(() => {
    // Update URL search params when selections change
    const params = new URLSearchParams();
    if (selectedDentist && selectedDentist !== 'all') params.append('dentistId', selectedDentist);
    if (selectedService && selectedService !== 'all') params.append('serviceId', selectedService);
    setSearchParams(params);
  }, [selectedDentist, selectedService, setSearchParams]);

  const handleDentistChange = (value: string) => {
    setSelectedDentist(value);
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const handleAppointmentSelected = (appointmentId: string) => {
    console.log('Appointment selected:', appointmentId);
    // In a real app, this would navigate to a confirmation page or show more details
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Запазване на час</h1>
            <p className="text-gray-600">
              Изберете предпочитан зъболекар, услуга и свободна дата и час за вашето посещение.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filters Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-800">Филтри</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="dentist" className="text-sm font-medium">Изберете зъболекар</Label>
                  <Select value={selectedDentist} onValueChange={handleDentistChange}>
                    <SelectTrigger id="dentist" className="w-full">
                      <SelectValue placeholder="Всички зъболекари" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Всички зъболекари</SelectItem>
                      {dentists.map(dentist => (
                        <SelectItem key={dentist.id} value={dentist.id}>
                          {dentist.name} - {dentist.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="service" className="text-sm font-medium">Изберете услуга</Label>
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger id="service" className="w-full">
                      <SelectValue placeholder="Всички услуги" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Всички услуги</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price} лв.
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected filters display */}
                {selectedDentist && selectedDentist !== 'all' && (
                  <div className="mt-4 p-3 bg-dental-lightGray rounded-md">
                    <p className="text-sm text-gray-700">
                      Зъболекар: {dentists.find(d => d.id === selectedDentist)?.name}
                    </p>
                  </div>
                )}

                {selectedService && selectedService !== 'all' && (
                  <div className="p-3 bg-dental-lightGray rounded-md">
                    <p className="text-sm text-gray-700">
                      Услуга: {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price} лв.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-md h-full">
                <CardHeader className="pb-0 flex flex-row items-center gap-3">
                  <CalendarClock className="h-6 w-6 text-dental-teal" />
                  <h2 className="text-xl font-semibold">Изберете дата и час</h2>
                </CardHeader>
                <CardContent>
                  <CalendarComponent 
                    dentistId={selectedDentist !== 'all' ? selectedDentist : undefined}
                    onAppointmentSelected={handleAppointmentSelected} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info Card */}
          <Card className="bg-white shadow-md border-t-4 border-dental-teal mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Информация за записване на час</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Часовете могат да бъдат отказани или променени до 24 часа преди посещението.</li>
                <li>Моля, пристигнете 10 минути преди уговорения час.</li>
                <li>При закъснение с повече от 15 минути, часът може да бъде пренасрочен.</li>
                <li>Ще получите напомняне 24 часа преди вашето посещение.</li>
                <li>За спешни случаи, моля, свържете се директно с клиниката на тел: +359 888 123 456.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Appointments;
