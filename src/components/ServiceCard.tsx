
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar } from 'lucide-react';
import { Service } from '@/data/models';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img 
          src={service.imageUrl} 
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
