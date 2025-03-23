import * as React from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function SetNotificationDialog({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onSave?: (date: Date, recurrence: RecurrenceType) => void;
}) {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = React.useState(false);
  const [recurrence, setRecurrence] = React.useState<RecurrenceType>('none');

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
    setMode('date');
  };

  const showTimepicker = () => {
    setShowPicker(true);
    setMode('time');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(date, recurrence);
    }
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Notification</DialogTitle>
          <DialogDescription>Choose when and how often you want to be notified.</DialogDescription>
        </DialogHeader>
        <View className="space-y-4 py-4">
          <View className="mb-2 flex flex-row items-center justify-between">
            <Text className="text-base font-medium">Date:</Text>
            <Button variant="outline" onPress={showDatepicker}>
              <Text>{formatDate(date)}</Text>
            </Button>
          </View>

          <View className="flex flex-row items-center justify-between">
            <Text className="text-base font-medium">Time:</Text>
            <Button variant="outline" onPress={showTimepicker}>
              <Text> {formatTime(date)}</Text>
            </Button>
          </View>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <View className="pt-4">
            <Text className="mb-2 text-base font-medium">Recurrence</Text>
            <RadioGroup
              value={recurrence}
              onValueChange={(value) => setRecurrence(value as RecurrenceType)}>
              <View className="flex flex-row items-center gap-2 space-x-2 py-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No recurrence</Label>
              </View>
              <View className="flex flex-row items-center gap-2 space-x-2 py-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Every day</Label>
              </View>
              <View className="flex flex-row items-center  gap-2 space-x-2 py-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Every week</Label>
              </View>
              <View className="flex flex-row items-center  gap-2 space-x-2 py-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Every month</Label>
              </View>
              <View className="flex flex-row items-center  gap-2 space-x-2 py-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Every year</Label>
              </View>
            </RadioGroup>
          </View>
        </View>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={handleSave}>
            <Text>Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
