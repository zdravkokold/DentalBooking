
import { WorkingHours } from '@/types';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';

class ScheduleService {
  async getDentistWorkingHours(dentistId: string): Promise<WorkingHours[]> {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .eq('dentist_id', dentistId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching working hours:', error);
      throw new Error(error.message || 'Failed to fetch working hours');
    }
  }

  async setWorkingHours(workingHours: Omit<WorkingHours, 'id'>): Promise<string> {
    try {
      // Validate working hours
      this.validateWorkingHours(workingHours);

      // Check for overlapping schedules
      const hasOverlap = await this.checkForOverlap(workingHours);
      if (hasOverlap) {
        throw new Error('Working hours overlap with existing schedule');
      }

      const { data, error } = await supabase
        .from('working_hours')
        .insert([workingHours])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error: any) {
      console.error('Error setting working hours:', error);
      throw new Error(error.message || 'Failed to set working hours');
    }
  }

  async updateWorkingHours(id: string, workingHours: Partial<WorkingHours>): Promise<void> {
    try {
      // Validate working hours if time is being updated
      if (workingHours.startTime || workingHours.endTime) {
        const existingHours = await this.getWorkingHoursById(id);
        this.validateWorkingHours({
          ...existingHours,
          ...workingHours
        } as WorkingHours);
      }

      const { error } = await supabase
        .from('working_hours')
        .update(workingHours)
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating working hours:', error);
      throw new Error(error.message || 'Failed to update working hours');
    }
  }

  async deleteWorkingHours(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('working_hours')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting working hours:', error);
      throw new Error(error.message || 'Failed to delete working hours');
    }
  }

  private async getWorkingHoursById(id: string): Promise<WorkingHours> {
    const { data, error } = await supabase
      .from('working_hours')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  private validateWorkingHours(workingHours: Omit<WorkingHours, 'id'> | WorkingHours): void {
    const { startTime, endTime } = workingHours;

    // Check if times are in valid format
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(startTime) ||
        !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
      throw new Error('Invalid time format. Use HH:mm format');
    }

    // Check if end time is after start time
    const start = parseISO(`2000-01-01T${startTime}`);
    const end = parseISO(`2000-01-01T${endTime}`);
    if (end <= start) {
      throw new Error('End time must be after start time');
    }

    // Check if day of week is valid
    if (workingHours.dayOfWeek < 0 || workingHours.dayOfWeek > 6) {
      throw new Error('Invalid day of week. Must be between 0 (Sunday) and 6 (Saturday)');
    }
  }

  private async checkForOverlap(newHours: Omit<WorkingHours, 'id'>): Promise<boolean> {
    const { data: existingHours, error } = await supabase
      .from('working_hours')
      .select('*')
      .eq('dentist_id', newHours.dentistId)
      .eq('day_of_week', newHours.dayOfWeek);

    if (error) throw error;

    return existingHours.some(existing => {
      const newStart = parseISO(`2000-01-01T${newHours.startTime}`);
      const newEnd = parseISO(`2000-01-01T${newHours.endTime}`);
      const existingStart = parseISO(`2000-01-01T${existing.startTime}`);
      const existingEnd = parseISO(`2000-01-01T${existing.endTime}`);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }
}

export const scheduleService = new ScheduleService();
