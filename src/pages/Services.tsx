
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Services = () => {
  // Group services by price range for the tabs
  const basicServices = services.filter(service => service.price < 100);
  const standardServices = services.filter(service => service.price >= 100 && service.price < 500);
  const advancedServices = services.filter(service => service.price >= 500);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Нашите услуги</h1>
          <p className="text-gray-600 mb-8">
            Предлагаме пълна гама от дентални услуги, от рутинни прегледи до сложни процедури, всички с фокус върху вашия комфорт и здраве.
          </p>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-white space-x-2">
              <TabsTrigger value="all">Всички услуги</TabsTrigger>
              <TabsTrigger value="basic">Базови услуги</TabsTrigger>
              <TabsTrigger value="standard">Стандартни услуги</TabsTrigger>
              <TabsTrigger value="advanced">Специализирани услуги</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="basic" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {basicServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {basicServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Няма налични услуги в тази категория.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="standard" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standardServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {standardServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Няма налични услуги в тази категория.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {advancedServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Няма налични услуги в тази категория.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 border-t-4 border-dental-teal">
            <h2 className="text-2xl font-semibold mb-4">Често задавани въпроси</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Как се провежда първоначалната консултация?</h3>
                <p className="text-gray-700">
                  Първоначалната консултация включва цялостен преглед на устната кухина, оценка на състоянието на зъбите и венците, рентгенови снимки при необходимост и подробна дискусия за вашите дентални нужди и опции за лечение.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Колко често трябва да посещавам зъболекар?</h3>
                <p className="text-gray-700">
                  Препоръчително е да посещавате зъболекар на всеки 6 месеца за рутинен преглед и почистване. В някои случаи, в зависимост от вашето орално здраве, може да бъдат препоръчани по-чести посещения.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Какви методи за плащане приемате?</h3>
                <p className="text-gray-700">
                  Приемаме плащания в брой, с кредитни/дебитни карти, както и чрез банков превод. За по-скъпи процедури предлагаме и възможност за разсрочено плащане.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Имате ли процедури за спешни случаи?</h3>
                <p className="text-gray-700">
                  Да, имаме определени часове всеки ден за спешни случаи. При силна болка или травма се свържете с нас незабавно и ще направим всичко възможно да ви приемем в същия ден.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
