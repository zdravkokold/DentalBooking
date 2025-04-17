
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/data/models';
import { patientService } from '@/services/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Search, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PatientManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    email: '',
    phone: '',
    healthStatus: '',
    address: '',
    birthDate: '',
  });

  // Query to get patients
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients,
  });

  // Mutation to create patient
  const createPatientMutation = useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        healthStatus: '',
        address: '',
        birthDate: '',
      });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  // Mutation to update patient
  const updatePatientMutation = useMutation({
    mutationFn: patientService.updatePatient,
    onSuccess: () => {
      setIsEditDialogOpen(false);
      setSelectedPatient(null);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  // Filter patients based on search term
  const filteredPatients = patients?.filter(patient => {
    const searchValue = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchValue) ||
      patient.email.toLowerCase().includes(searchValue) ||
      patient.phone.toLowerCase().includes(searchValue)
    );
  });

  // Handle opening the edit dialog
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  // Handle form submission for new patient
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name) {
      toast.error('Моля, въведете име на пациента');
      return;
    }
    createPatientMutation.mutate(newPatient);
  };

  // Handle form submission for editing patient
  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient?.name) {
      toast.error('Моля, въведете име на пациента');
      return;
    }
    updatePatientMutation.mutate(selectedPatient);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Управление на пациенти</CardTitle>
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Добави пациент
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Търси по име, имейл или телефон..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div>Зареждане...</div>
            </div>
          ) : filteredPatients && filteredPatients.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Здравен статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {patient.healthStatus ? (
                          <span className="text-sm">{patient.healthStatus.substring(0, 30)}...</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Няма данни</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPatient(patient)} 
                          title="Редактирай"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Няма намерени пациенти' : 'Няма пациенти'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Patient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавяне на нов пациент</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPatient}>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Име</label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="Име Фамилия"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Имейл</label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Телефон</label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  placeholder="+359 888 123456"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium mb-1">Дата на раждане</label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newPatient.birthDate}
                  onChange={(e) => setNewPatient({...newPatient, birthDate: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Адрес</label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  placeholder="ул. Примерна 1, гр. София"
                />
              </div>
              <div>
                <label htmlFor="healthStatus" className="block text-sm font-medium mb-1">Здравен статус</label>
                <Textarea
                  id="healthStatus"
                  value={newPatient.healthStatus}
                  onChange={(e) => setNewPatient({...newPatient, healthStatus: e.target.value})}
                  placeholder="Алергии, хронични заболявания, текущи медикаменти..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Отказ
              </Button>
              <Button 
                type="submit" 
                disabled={createPatientMutation.isPending}
              >
                {createPatientMutation.isPending ? 'Запазване...' : 'Запази'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактиране на пациент</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <form onSubmit={handleUpdatePatient}>
              <div className="grid gap-4 py-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-1">Име</label>
                  <Input
                    id="edit-name"
                    value={selectedPatient.name}
                    onChange={(e) => setSelectedPatient({...selectedPatient, name: e.target.value})}
                    placeholder="Име Фамилия"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium mb-1">Имейл</label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedPatient.email}
                    onChange={(e) => setSelectedPatient({...selectedPatient, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium mb-1">Телефон</label>
                  <Input
                    id="edit-phone"
                    value={selectedPatient.phone}
                    onChange={(e) => setSelectedPatient({...selectedPatient, phone: e.target.value})}
                    placeholder="+359 888 123456"
                  />
                </div>
                <div>
                  <label htmlFor="edit-birthDate" className="block text-sm font-medium mb-1">Дата на раждане</label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={selectedPatient.birthDate}
                    onChange={(e) => setSelectedPatient({...selectedPatient, birthDate: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="edit-address" className="block text-sm font-medium mb-1">Адрес</label>
                  <Input
                    id="edit-address"
                    value={selectedPatient.address}
                    onChange={(e) => setSelectedPatient({...selectedPatient, address: e.target.value})}
                    placeholder="ул. Примерна 1, гр. София"
                  />
                </div>
                <div>
                  <label htmlFor="edit-healthStatus" className="block text-sm font-medium mb-1">Здравен статус</label>
                  <Textarea
                    id="edit-healthStatus"
                    value={selectedPatient.healthStatus}
                    onChange={(e) => setSelectedPatient({...selectedPatient, healthStatus: e.target.value})}
                    placeholder="Алергии, хронични заболявания, текущи медикаменти..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Отказ
                </Button>
                <Button 
                  type="submit" 
                  disabled={updatePatientMutation.isPending}
                >
                  {updatePatientMutation.isPending ? 'Обновяване...' : 'Обнови'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;
