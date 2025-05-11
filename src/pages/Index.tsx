
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Clock, ChevronRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with updated dentist working image */}
        <section className="relative bg-dental-teal text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1606811851772-12ec85381a70?q=80&w=1480&auto=format&fit=crop" 
              alt="Дентален кабинет" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dental-teal/90 to-dental-teal/60"></div>
          </div>
          
          <div className="relative z-10 py-24 px-6 md:px-12 lg:px-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Грижа за вашите зъби с усмивка
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Намерете най-добрите зъболекари и запазете час бързо и лесно.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-dental-teal hover:bg-gray-100" onClick={() => navigate('/appointments')}>
                <Calendar className="h-5 w-5 mr-2" />
                Запази час
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-dental-teal bg-transparent" onClick={() => navigate('/dentists')}>
                Намери зъболекар
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Защо да изберете нас?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <Clock className="h-10 w-10 text-dental-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Бързо и лесно запазване на час
                </h3>
                <p className="text-gray-600">
                  Интуитивен процес за намиране на свободни часове и запазване на час онлайн.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="text-center">
                <Phone className="h-10 w-10 text-dental-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Поддръжка на клиенти 24/7
                </h3>
                <p className="text-gray-600">
                  Нашият екип е на разположение да отговори на вашите въпроси по всяко време.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="text-center">
                <Calendar className="h-10 w-10 text-dental-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Напомняния за предстоящи часове
                </h3>
                <p className="text-gray-600">
                  Получавайте навременни напомняния, за да не пропуснете важните си прегледи.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Как работи?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-dental-teal text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Намерете зъболекар
                </h3>
                <p className="text-gray-600">
                  Разгледайте нашия списък със зъболекари и изберете този, който най-добре отговаря на вашите нужди.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-dental-teal text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Изберете услуга и час
                </h3>
                <p className="text-gray-600">
                  Изберете желаната от вас услуга и прегледайте наличните часове.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-dental-teal text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Запазете час
                </h3>
                <p className="text-gray-600">
                  Потвърдете вашия час и получете напомняне преди посещението.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-24 bg-dental-teal text-white">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Готови ли сте да се погрижите за вашата усмивка?
            </h2>
            <p className="text-lg mb-8">
              Запазете час при най-добрите зъболекари в града още днес!
            </p>
            <Button size="lg" className="bg-white text-dental-teal hover:bg-gray-100" onClick={() => navigate('/appointments')}>
              Запази час сега
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
