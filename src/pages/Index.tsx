
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Clock, ChevronRight, Star, Users, ThumbsUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { dentists, services } from '@/data/mockData';

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
        
        {/* Services Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Нашите Услуги
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Предлагаме пълен спектър от дентални услуги за цялото семейство
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <Card key={service.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img 
                      src={service.imageUrl || "https://images.unsplash.com/photo-1588776814546-daab30f310ce?q=80&w=1374&auto=format&fit=crop"} 
                      alt={service.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{service.duration} мин.</span>
                    </div>
                    <Button 
                      variant="link" 
                      className="px-0 text-dental-teal"
                      onClick={() => navigate('/services')}
                    >
                      Научете повече
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/services')}
                className="bg-dental-teal hover:bg-dental-teal/90"
              >
                Вижте всички услуги
              </Button>
            </div>
          </div>
        </section>
        
        {/* Dentists Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Нашите Зъболекари
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Запознайте се с нашия екип от висококвалифицирани дентални специалисти
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dentists.slice(0, 3).map((dentist) => (
                <Card key={dentist.id} className="overflow-hidden transition-transform hover:scale-105">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={dentist.imageUrl} 
                      alt={dentist.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardContent className="p-5 text-center">
                    <h3 className="font-bold text-xl mb-1">{dentist.name}</h3>
                    <p className="text-dental-teal mb-3">{dentist.specialization}</p>
                    <div className="flex items-center justify-center text-amber-400 mb-4">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-700">({dentist.rating})</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/dentists/${dentist.id}`)}
                      variant="outline"
                      className="border-dental-teal text-dental-teal hover:bg-dental-teal hover:text-white"
                    >
                      Виж профила
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/dentists')}
                variant="outline"
                className="border-dental-teal text-dental-teal hover:bg-dental-teal hover:text-white"
              >
                Вижте всички зъболекари
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Какво казват нашите пациенти
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Мнения от хора, които са се доверили на нашите услуги
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex text-amber-400 mb-4">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="italic text-gray-700 mb-4">
                    "Най-добрите зъболекари, на които съм попадал. Изключително професионално отношение и безболезнено лечение."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">Иван Петров</p>
                      <p className="text-sm text-gray-500">Пациент от 2 години</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex text-amber-400 mb-4">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="italic text-gray-700 mb-4">
                    "Удобното онлайн записване за час спестява много време. Персоналът е изключително внимателен и услужлив."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">Мария Иванова</p>
                      <p className="text-sm text-gray-500">Пациент от 1 година</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex text-amber-400 mb-4">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <p className="italic text-gray-700 mb-4">
                    "Детето ми обожава да ходи на зъболекар тук! Страхът от зъболекарския стол вече е в миналото."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">Петър Стоянов</p>
                      <p className="text-sm text-gray-500">Пациент от 3 години</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="py-16 bg-dental-teal text-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <p>Доволни пациенти</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">12+</div>
                <p>Години опит</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <p>Квалифицирани специалисти</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">20+</div>
                <p>Дентални услуги</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
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
