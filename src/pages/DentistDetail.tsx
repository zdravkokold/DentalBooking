
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { dentists } from '@/data/mockData';
import { CalendarCheck, Calendar, Clock, GraduationCap, Globe, Star, ArrowLeft } from 'lucide-react';
import CalendarComponent from '@/components/CalendarComponent';

const DentistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const dentist = dentists.find(d => d.id === id);
  
  if (!dentist) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-dental-lightGray">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Зъболекарят не е намерен</h1>
            <Button onClick={() => navigate('/dentists')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Обратно към зъболекари
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => navigate('/dentists')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Всички зъболекари
            </Button>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="h-full">
                    <img 
                      src={dentist.imageUrl} 
                      alt={dentist.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{dentist.name}</h1>
                  <p className="text-lg text-dental-teal font-medium mb-4">{dentist.specialization}</p>
                  
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(dentist.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-gray-700 ml-2">{dentist.rating.toFixed(1)} / 5</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-dental-lightGray border-none">
                      <CardContent className="p-4 flex items-center">
                        <Clock className="h-5 w-5 text-dental-teal mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Опит</p>
                          <p className="font-medium">{dentist.yearsOfExperience} години</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dental-lightGray border-none">
                      <CardContent className="p-4 flex items-center">
                        <GraduationCap className="h-5 w-5 text-dental-teal mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Образование</p>
                          <p className="font-medium">{dentist.education}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dental-lightGray border-none sm:col-span-2">
                      <CardContent className="p-4 flex items-center">
                        <Globe className="h-5 w-5 text-dental-teal mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Езици</p>
                          <p className="font-medium">{dentist.languages.join(', ')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      className="bg-dental-teal hover:bg-dental-teal/90" 
                      onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <CalendarCheck className="h-5 w-5 mr-2" />
                      Запази час
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-8">
            <TabsList className="mb-6 bg-white">
              <TabsTrigger value="about">За мен</TabsTrigger>
              <TabsTrigger value="booking" onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Запази час
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="bg-white rounded-lg shadow-md p-6 mt-0">
              <h2 className="text-2xl font-semibold mb-4">Биография</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{dentist.bio}</p>
              
              <h3 className="text-xl font-semibold mb-3">Специализация</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Като {dentist.specialization.toLowerCase()}, д-р {dentist.name.split(' ')[1]} се фокусира върху предоставянето на висококачествени дентални услуги с индивидуален подход към всеки пациент. С {dentist.yearsOfExperience} години опит, д-р {dentist.name.split(' ')[1]} е изградил репутация на доверен професионалист, който комбинира клинични умения със съпричастност към нуждите на пациентите.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Образование и квалификации</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Магистър по дентална медицина - {dentist.education}</li>
                    <li>Сертификат по съвременна дентална медицина</li>
                    <li>Специализация по {dentist.specialization.toLowerCase()}</li>
                    <li>Член на Български зъболекарски съюз</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Професионални интереси</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Минимално инвазивна дентална медицина</li>
                    <li>Естетична дентална медицина</li>
                    <li>Дентална профилактика</li>
                    <li>Съвременни дентални технологии</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="booking" id="booking-section" className="bg-white rounded-lg shadow-md p-6 mt-0">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-dental-teal" />
                Запазете час при {dentist.name}
              </h2>
              
              <CalendarComponent dentistId={dentist.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DentistDetail;
