
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DentistCard from '@/components/DentistCard';
import ServiceCard from '@/components/ServiceCard';
import { dentists, services } from '@/data/mockData';
import { Smile, CalendarCheck, User, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const featuredDentists = dentists.slice(0, 4);
  const featuredServices = services.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-dental-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Модерно решение за <br />
                <span className="text-dental-mint">зъболекарски часове</span>
              </h1>
              <p className="text-lg">
                DentalBooking е уеб базирано приложение, създадено да улесни процеса по записване на часове в зъболекарска клиника чрез интелигентен календар и персонализирани напомняния.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-white text-dental-teal hover:bg-dental-mint hover:text-dental-teal"
                  size="lg"
                  onClick={() => navigate('/appointments')}
                >
                  Запази час сега
                </Button>
                <Button 
                  className="bg-white text-dental-teal hover:bg-dental-mint hover:text-dental-teal"
                  size="lg"
                  onClick={() => navigate('/dentists')}
                >
                  Нашите зъболекари
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Dental Clinic" 
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Защо да изберете нас?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Нашата платформа предлага бърз и удобен начин за записване на часове при различни специалисти с персонализирани напомняния и удобна навигация.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dental-lightGray rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-dental-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Лесно записване</h3>
              <p className="text-gray-600">Бързо и лесно запазване на час с няколко клика - където и когато ви е удобно.</p>
            </div>
            
            <div className="bg-dental-lightGray rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-dental-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Специализирани дентисти</h3>
              <p className="text-gray-600">Екип от висококвалифицирани специалисти с опит в различни дентални области.</p>
            </div>
            
            <div className="bg-dental-lightGray rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-dental-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Персонализирана грижа</h3>
              <p className="text-gray-600">Индивидуален подход и внимание към детайла за всеки пациент според неговите нужди.</p>
            </div>
            
            <div className="bg-dental-lightGray rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-dental-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Съвременно оборудване</h3>
              <p className="text-gray-600">Използване на най-модерните технологии и материали за дентално лечение.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dentists */}
      <section className="py-16 bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Нашите специалисти</h2>
            <Button 
              variant="outline" 
              className="text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
              onClick={() => navigate('/dentists')}
            >
              Виж всички <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDentists.map(dentist => (
              <DentistCard key={dentist.id} dentist={dentist} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Нашите услуги</h2>
            <Button 
              variant="outline" 
              className="text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
              onClick={() => navigate('/services')}
            >
              Виж всички <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dental-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готови сте да запазите час?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Присъединете се към нашите доволни пациенти и се насладете на професионална дентална грижа с персонално отношение.
          </p>
          <Button 
            className="bg-white text-dental-teal hover:bg-dental-mint hover:text-dental-teal"
            size="lg"
            onClick={() => navigate('/appointments')}
          >
            Запази час сега <CalendarCheck className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
