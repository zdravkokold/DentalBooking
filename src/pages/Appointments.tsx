
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CalendarComponent from '@/components/CalendarComponent';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dentists, services } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

const Appointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDentist, setSelectedDentist] = useState<string>(searchParams.get('dentistId') || '');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('serviceId') || '');

  useEffect(() => {
    // Update URL search params when selections change
    const params = new URLSearchParams();
    if (selectedDentist) params.append('dentistId', selectedDentist);
    if (selectedService) params.append('serviceId', selectedService);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="dentist">Изберете зъболекар</Label>
                    <Select value={selectedDentist} onValueChange={handleDentistChange}>
                      <SelectTrigger id="dentist" className="w-full">
                        <SelectValue placeholder="Всички зъболекари" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Всички зъболекари</SelectItem>
                        {dentists.map(dentist => (
                          <SelectItem key={dentist.id} value={dentist.id}>
                            {dentist.name} - {dentist.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Изберете услуга</Label>
                    <Select value={selectedService} onValueChange={handleServiceChange}>
                      <SelectTrigger id="service" className="w-full">
                        <SelectValue placeholder="Всички услуги" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Всички услуги</SelectItem>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.price} лв.
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Card className="bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-dental-teal">
                  <CalendarClock className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Изберете дата и час</h2>
                </div>

                {selectedDentist && (
                  <div className="mb-4 p-3 bg-dental-lightGray rounded-md">
                    <p className="text-sm text-gray-700">
                      Зъболекар: {dentists.find(d => d.id === selectedDentist)?.name}
                    </p>
                  </div>
                )}

                {selectedService && (
                  <div className="mb-4 p-3 bg-dental-lightGray rounded-md">
                    <p className="text-sm text-gray-700">
                      Услуга: {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price} лв.
                    </p>
                  </div>
                )}

                <CalendarComponent 
                  dentistId={selectedDentist || undefined}
                  onAppointmentSelected={handleAppointmentSelected} 
                />
              </Card>
            </div>
          </div>

          <Card className="bg-white shadow-sm p-6 border-t-4 border-dental-teal mt-4">
            <h3 className="text-lg font-semibold mb-3">Информация за записване на час</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Часовете могат да бъдат отказани или променени до 24 часа преди посещението.</li>
              <li>Моля, пристигнете 10 минути преди уговорения час.</li>
              <li>При закъснение с повече от 15 минути, часът може да бъде пренасрочен.</li>
              <li>Ще получите напомняне 24 часа преди вашето посещение.</li>
              <li>За спешни случаи, моля, свържете се директно с клиниката на тел: +359 888 123 456.</li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Appointments;
