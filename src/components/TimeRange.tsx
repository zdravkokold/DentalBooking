
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeRangeProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export const TimeRange: React.FC<TimeRangeProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  // Generate time options in 30-minute increments
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  });

  return (
    <div className="flex items-center space-x-2">
      <div className="w-1/2">
        <Label htmlFor="startTime" className="sr-only">Начален час</Label>
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Начален час" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>до</div>
      <div className="w-1/2">
        <Label htmlFor="endTime" className="sr-only">Краен час</Label>
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Краен час" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
