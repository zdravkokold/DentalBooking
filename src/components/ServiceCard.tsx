import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, BadgeDollarSign } from 'lucide-react';
import { Service } from '@/data/models';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();
  
  // Define a mapping of service images based on service names
  const serviceImages = {
    "Профилактичен преглед": "https://images.unsplash.com/photo-1588776814546-daab30f310ce?q=80&w=1374&auto=format&fit=crop",
    "Поставяне на имплант": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3",
    "Лечение на кариес": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3",
    "Професионално избелване": "https://s16736.pcdn.co/wp-content/uploads/sites/418/2017/02/Teeth-Whitening.jpg.optimal.jpg",
    "Ортодонтско лечение": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    "Професионално почистване": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3"
  };
  
  // Use the mapped image or fall back to the original imageUrl
  const imageUrl = serviceImages[service.name] || service.imageUrl || "https://images.unsplash.com/photo-1588776814546-daab30f310ce?q=80&w=1374&auto=format&fit=crop";
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={service.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{service.duration} мин.</span>
          <span className="mx-2">•</span>
          <BadgeDollarSign className="h-4 w-4 mr-1" />
          <span>{service.price.toLocaleString()} лв.</span>
        </div>
        
        <p className="text-sm text-gray-700">
          {service.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-dental-teal hover:bg-dental-teal/90"
          onClick={() => navigate(`/appointments?serviceId=${service.id}`)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Запази час
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
