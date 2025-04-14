
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DentistCard from '@/components/DentistCard';
import { dentists } from '@/data/mockData';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

const Dentists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('all');

  // Extract unique specializations for the filter
  const specializations = Array.from(new Set(dentists.map(dentist => dentist.specialization)));

  // Filter dentists based on search and specialization
  const filteredDentists = dentists.filter(dentist => {
    const matchesSearch = dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dentist.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specialization === 'all' || dentist.specialization === specialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-dental-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Нашите зъболекари
          </h1>
          <p className="text-gray-600 mb-8">
            Запознайте се с нашия екип от висококвалифицирани специалисти, готови да се погрижат за вашето дентално здраве.
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Търсене по име или информация..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Филтър по специалност" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички специалности</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {filteredDentists.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl text-gray-700 mb-2">Няма намерени зъболекари</h3>
              <p className="text-gray-500">Моля, променете критериите за търсене.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDentists.map(dentist => (
                <DentistCard key={dentist.id} dentist={dentist} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dentists;
