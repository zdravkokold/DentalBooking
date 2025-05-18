import { supabase } from '@/lib/supabase';
import { User, Patient } from '@/types';
import { toast } from 'sonner';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'patient';
  dateOfBirth: Date;
  phone: string;
  address: string;
  medicalHistory?: string;
  insuranceDetails?: string;
}

class UserService {
  async register(data: RegisterData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      // Create patient profile
      const { error: patientError } = await supabase
        .from('patients')
        .insert([{
          user_id: authData.user.id,
          date_of_birth: data.dateOfBirth.toISOString(),
          phone: data.phone,
          address: data.address,
          medical_history: data.medicalHistory || '',
          insurance_details: data.insuranceDetails || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (patientError) throw patientError;

      return authData.user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register user');
    }
  }

  async getProfile(userId: string): Promise<{ user: User; patient?: Patient }> {
    try {
      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get patient profile if role is patient
      let patientData = null;
      if (userData.role === 'patient') {
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (patientError) throw patientError;
        patientData = {
          ...patient,
          dateOfBirth: new Date(patient.date_of_birth),
          medicalHistory: patient.medical_history,
          insuranceDetails: patient.insurance_details,
          createdAt: new Date(patient.created_at),
          updatedAt: new Date(patient.updated_at)
        };
      }

      return {
        user: {
          ...userData,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at)
        },
        patient: patientData
      };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(
    userId: string,
    data: Partial<User> & Partial<Patient>
  ): Promise<void> {
    try {
      // Update user profile
      if (data.name || data.email) {
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: data.name,
            email: data.email,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (userError) throw userError;
      }

      // Update patient profile
      const patientData: any = {};
      if (data.dateOfBirth) patientData.date_of_birth = data.dateOfBirth.toISOString();
      if (data.phone) patientData.phone = data.phone;
      if (data.address) patientData.address = data.address;
      if (data.medicalHistory) patientData.medical_history = data.medicalHistory;
      if (data.insuranceDetails) patientData.insurance_details = data.insuranceDetails;

      if (Object.keys(patientData).length > 0) {
        patientData.updated_at = new Date().toISOString();
        const { error: patientError } = await supabase
          .from('patients')
          .update(patientData)
          .eq('user_id', userId);

        if (patientError) throw patientError;
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export const userService = new UserService(); 