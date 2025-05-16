import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronRight, Phone, MapPin, Star, Users, Award, Clock, Calendar } from 'lucide-react';
import { services, dentists } from '@/data/mockData';
import ServiceCard from '@/components/ServiceCard';

const Index = () => {
  const featuredServices = services.slice(0, 3); // Get first 3 services
  const featuredDentists = dentists.slice(0, 3); // Get first 3 dentists

  // Testimonials data with profile images
  const testimonials = [
    {
      id: 1,
      name: "Мария Петрова",
      role: "Пациент",
      content: "Невероятно обслужване! Процедурата беше безболезнена и резултатът е впечатляващ. Ще препоръчам на всички мои приятели.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Георги Иванов",
      role: "Пациент",
      content: "Много професионален екип, приятна атмосфера и модерна техника. Определено най-доброто място за зъболечение в града!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Лилия Димитрова",
      role: "Пациент",
      content: "Страхотна клиника с внимателни и грижовни зъболекари. Процесът на запазване на час е изключително удобен!",
      rating: 4,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  // Statistics for the stats section
  const statistics = [
    { icon: <Users className="h-8 w-8 text-dental-teal" />, value: "5000+", label: "Доволни пациенти" },
    { icon: <Award className="h-8 w-8 text-dental-teal" />, value: "10+", label: "Години опит" },
    { icon: <Calendar className="h-8 w-8 text-dental-teal" />, value: "20,000+", label: "Процедури" },
    { icon: <Star className="h-8 w-8 text-dental-teal" />, value: "4.9", label: "Среден рейтинг" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-dental-lightGray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Професионални <span className="text-dental-teal">дентални услуги</span> за цялото семейство
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Запазете час при нашите опитни зъболекари за по-здрави зъби и красива усмивка. Използваме модерна техника и предлагаме комфортно изживяване.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-dental-teal hover:bg-dental-teal/90 px-6 py-6 text-lg" asChild>
                    <Link to="/appointments">Запази час <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-6 py-6 text-lg" asChild>
                    <Link to="/services">Нашите услуги</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://www.turkeydentalclinic.com/wp-content/uploads/2024/11/dentist-turkey-antalya.jpg"
                  alt="Дентални услуги" 
                  className="rounded-lg shadow-xl w-full h-auto" 
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Защо да изберете нас</h2>
              <p className="mt-4 text-lg text-gray-600">Предоставяме висококачествено обслужване и най-добрите грижи за вашите зъби</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-dental-lightGray border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-dental-teal p-3 mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Висококвалифицирани специалисти</h3>
                    <p className="text-gray-600">Нашият екип от зъболекари има богат опит и постоянно се обучава с най-новите техники</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dental-lightGray border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-dental-teal p-3 mb-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Удобно работно време</h3>
                    <p className="text-gray-600">Предлагаме гъвкаво работно време, включително вечерни часове и съботни дни</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dental-lightGray border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-dental-teal p-3 mb-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Лесно запазване на час</h3>
                    <p className="text-gray-600">Бързо и лесно запазване на час онлайн в удобно за вас време</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Нашите услуги</h2>
              <p className="mt-4 text-lg text-gray-600">Предлагаме широк спектър от дентални процедури за всички възрасти</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">Вижте всички услуги <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Dentists Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Нашите зъболекари</h2>
              <p className="mt-4 text-lg text-gray-600">Запознайте се с нашите висококвалифицирани специалисти</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDentists.map((dentist) => (
                <Card key={dentist.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[3/4] w-full">
                    <img
                      src={dentist.imageUrl || "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"}
                      alt={dentist.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold">{dentist.name}</h3>
                    <p className="text-dental-teal mb-2">{dentist.specialization}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span>{dentist.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{dentist.yearsOfExperience} години опит</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/dentists">Запознайте се с всички зъболекари <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Какво казват нашите пациенти</h2>
              <p className="mt-4 text-lg text-gray-600">Вижте отзивите на нашите доволни пациенти</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="py-16 bg-dental-teal text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {statistics.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="mb-3 bg-white/10 p-3 rounded-full">
                    {stat.icon}
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-lg text-dental-mint">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-dental-lightGray rounded-lg shadow-sm p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Готови ли сте за здрави зъби?</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Запазете час при нашите опитни зъболекари и се погрижете за вашето дентално здраве още днес.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-dental-teal hover:bg-dental-teal/90" size="lg" asChild>
                      <Link to="/appointments">Запази час</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="flex items-center justify-center gap-2">
                      <Phone className="h-5 w-5" />
                      <span>+359 2 456 7890</span>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg" 
                    alt="Дентален екип" 
                    className="rounded-lg shadow-lg w-full h-auto" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Info Section */}
        <section className="py-16 bg-dental-lightGray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-dental-teal p-4 mb-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Адрес</h3>
                  <p className="text-gray-600">ул. Витоша 89, София 1000, България</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-dental-teal p-4 mb-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Телефон</h3>
                  <p className="text-gray-600">+359 2 456 7890</p>
                  <p className="text-gray-600">+359 888 123 456</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-dental-teal p-4 mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Работно време</h3>
                  <p className="text-gray-600">Понеделник - Петък: 9:00 - 19:00</p>
                  <p className="text-gray-600">Събота: 9:00 - 14:00</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
