
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, BookOpen } from 'lucide-react';
import { Dentist } from '@/data/models';
import { useNavigate } from 'react-router-dom';

interface DentistCardProps {
  dentist: Dentist;
}

const DentistCard = ({ dentist }: DentistCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img 
          src={dentist.imageUrl} 
          alt={`Д-р ${dentist.name}`} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-1">{dentist.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{dentist.specialization}</p>
        
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(dentist.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">{dentist.rating.toFixed(1)}</span>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2">
          {dentist.bio.substring(0, 100)}...
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-dental-teal text-dental-teal hover:bg-dental-teal hover:text-white"
          onClick={() => navigate(`/dentists/${dentist.id}`)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Профил
        </Button>
        <Button 
          className="flex-1 bg-dental-teal hover:bg-dental-teal/90"
          onClick={() => navigate(`/appointments?dentistId=${dentist.id}`)}
        >
          Запази час
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DentistCard;
