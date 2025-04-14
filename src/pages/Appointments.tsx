
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CalendarComponent from '@/components/CalendarComponent';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dentists, services } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarClock, Filter } from 'lucide-react';

const Appointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDentist, setSelectedDentist] = useState<string>(searchParams.get('dentistId') || 'all');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('serviceId') || 'all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Update URL search params when selections change
    const params = new URLSearchParams();
    if (selectedDentist && selectedDentist !== 'all') params.append('dentistId', selectedDentist);
    if (selectedService && selectedService !== 'all') params.append('serviceId', selectedService);
    setSearchParams(params);
    
    // This is where you would fetch data from your backend if needed
    // Example: fetchDentistsOrServices();
  }, [selectedDentist, selectedService, setSearchParams]);

  // This function could be used to fetch data from your C# .NET backend
  const fetchDentistsOrServices = async () => {
    try {
      setIsLoading(true);
      
      // Example API call to your .NET backend
      /*
      const response = await fetch('https://your-api-url/api/dentists', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Process your data here
      } else {
        throw new Error('Failed to fetch data');
      }
      */
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDentistChange = (value: string) => {
    setSelectedDentist(value);
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const handleAppointmentSelected = async (appointmentId: string) => {
    console.log('Appointment selected:', appointmentId);
    
    // In a real application with a .NET backend, you might make an API call here
    // For example:
    /*
    try {
      const response = await fetch(`https://your-api-url/api/appointments/${appointmentId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: currentUserId,
          serviceId: selectedService !== 'all' ? selectedService : undefined
        })
      });
      
      if (response.ok) {
        const confirmationData = await response.json();
        // Handle successful booking, maybe redirect to a confirmation page
      } else {
        // Handle error state
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
    */
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Запазване на час</h1>
            <p className="text-gray-600">
              Изберете предпочитан зъболекар, услуга и свободна дата и час за вашето посещение.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Card */}
            <Card className="shadow-md lg:col-span-1 h-fit">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Filter className="h-5 w-5 text-dental-teal" />
                <h2 className="text-xl font-semibold text-gray-800">Филтри</h2>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
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

                <div className="space-y-2">
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
                {(selectedDentist !== 'all' || selectedService !== 'all') && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Избрани филтри:</h3>
                    {selectedDentist !== 'all' && (
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Зъболекар:</span> {dentists.find(d => d.id === selectedDentist)?.name}
                      </p>
                    )}
                    {selectedService !== 'all' && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Услуга:</span> {services.find(s => s.id === selectedService)?.name} - {services.find(s => s.id === selectedService)?.price} лв.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar View */}
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-md h-full">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <CalendarClock className="h-5 w-5 text-dental-teal" />
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
