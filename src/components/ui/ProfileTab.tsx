
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileTabProps {
  profileData?: {
    name?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    healthStatus?: string;
    address?: string;
  };
}

const ProfileTab = ({ profileData }: ProfileTabProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    healthStatus: '',
    address: ''
  });
  
  // Load initial data
  useEffect(() => {
    if (profileData) {
      const nameParts = (profileData.name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        birthDate: profileData.birthDate || '',
        healthStatus: profileData.healthStatus || '',
        address: profileData.address || ''
      });
    } else if (user) {
      loadUserProfile();
    }
  }, [profileData, user]);
  
  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (profile) {
        setFormData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          birthDate: profile.birth_date || '',
          healthStatus: profile.health_status || '',
          address: profile.address || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Трябва да сте влезли в профила си');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the user profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          birth_date: formData.birthDate || null,
          health_status: formData.healthStatus,
          address: formData.address,
          email: formData.email
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Грешка при обновяване на профила', {
          description: error.message
        });
        return;
      }
      
      toast.success('Профилът е обновен успешно');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Грешка при обновяване на профила', {
        description: error.message || 'Моля, опитайте отново'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Моят профил</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Име</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Въведете вашето име"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Въведете вашата фамилия"
              />
            </div>
            <div>
              <Label htmlFor="email">Имейл адрес</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                readOnly={!!user?.email} // Make readonly if email comes from auth
                className={user?.email ? "bg-gray-100" : ""}
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+359 88 888 8888"
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Дата на раждане</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ул. Пример 123, София"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="healthStatus">Здравен статус</Label>
            <Textarea
              id="healthStatus"
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              placeholder="Алергии, заболявания и друга важна информация"
              rows={3}
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Запазване...' : 'Запази промените'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
