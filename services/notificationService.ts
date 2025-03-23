import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export type NotificationSchedule = {
  id: string;
  taskId: string;
  title: string;
  body: string;
  time: number; // timestamp
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
};

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleNotification(schedule: NotificationSchedule) {
  const { id, title, body, time, recurrenceType } = schedule;

  const scheduledDate = new Date(time);
  let trigger: any;

  // Set up the appropriate trigger based on recurrence type
  if (recurrenceType === 'none') {
    // For one-time notifications, use the exact date
    trigger = scheduledDate;
  } else {
    // Extract time components
    const hour = scheduledDate.getHours();
    const minute = scheduledDate.getMinutes();

    switch (recurrenceType) {
      case 'daily':
        trigger = {
          hour,
          minute,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        };
        break;

      case 'weekly':
        trigger = {
          weekday: scheduledDate.getDay() + 1, // 1-7, where 1 is Sunday
          hour,
          minute,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        };
        break;

      case 'monthly':
        trigger = {
          day: scheduledDate.getDate(), // 1-31
          hour,
          minute,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        };
        break;

      case 'yearly':
        trigger = {
          month: scheduledDate.getMonth(), // 0-11
          day: scheduledDate.getDate(), // 1-31
          hour,
          minute,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.YEARLY,
        };
        break;
    }
  }

  // For debugging
  console.log('Scheduling notification with trigger:', JSON.stringify(trigger));

  // Schedule the notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { taskId: schedule.taskId },
    },
    trigger,
  });

  // Store notification mapping
  await AsyncStorage.setItem(
    `notification_${id}`,
    JSON.stringify({
      ...schedule,
      notificationId,
    })
  );

  return notificationId;
}

export async function cancelNotification(id: string) {
  const storedNotification = await AsyncStorage.getItem(`notification_${id}`);
  if (storedNotification) {
    const { notificationId } = JSON.parse(storedNotification);
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await AsyncStorage.removeItem(`notification_${id}`);
  }
}

export async function getAllScheduledNotification() {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  return notifications;
}
