
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    toast.success("Съобщението беше изпратено!", {
      description: "Ще се свържем с вас възможно най-скоро."
    });
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Свържете се с нас</h1>
          <p className="text-gray-600 mb-8">
            Имате въпроси или искате да запазите час? Свържете се с нас по един от следните начини или използвайте формата за контакт.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Dental Clinic" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-dental-teal">Информация за контакт</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-dental-teal mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Адрес</p>
                        <p className="text-gray-600">ул. Шипка 34, София 1000</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-dental-teal mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Телефон</p>
                        <p className="text-gray-600">+359 888 123 456</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-dental-teal mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Имейл</p>
                        <p className="text-gray-600">info@dentalbooking.bg</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-dental-teal mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Работно време</p>
                        <p className="text-gray-600">Понеделник - Петък: 8:00 - 19:00</p>
                        <p className="text-gray-600">Събота: 9:00 - 14:00</p>
                        <p className="text-gray-600">Неделя: Затворено</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-dental-teal">Местоположение</h2>
                  <div className="aspect-square rounded-md overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.8886262039186!2d23.32862797576302!3d42.69390701442686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8571acb81e0b%3A0x5cd2de6fbb09a32a!2sul.%20%22Shipka%22%2034%2C%201504%20Sofia%2C%20Bulgaria!5e0!3m2!1sen!2sde!4v1712609067793!5m2!1sen!2sde"
                      width="100%" 
                      height="100%" 
                      className="border-0" 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-dental-teal">Изпратете запитване</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Име</Label>
                        <Input id="name" placeholder="Вашето име" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" placeholder="Вашият телефон" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Имейл</Label>
                      <Input id="email" type="email" placeholder="вашият@имейл.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Тема</Label>
                      <Input id="subject" placeholder="Тема на запитването" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Съобщение</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Опишете вашето запитване..." 
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-dental-teal hover:bg-dental-teal/90">
                      <Send className="h-4 w-4 mr-2" />
                      Изпрати съобщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6 border-t-4 border-dental-teal">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Спешни случаи</h2>
                  <p className="text-gray-700 mb-4">
                    За спешни случаи извън работно време, моля, свържете се с нашата специална линия за спешни случаи.
                  </p>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-red-500 mr-3" />
                    <span className="font-medium text-lg">+359 888 987 654</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
