import { View, ScrollView } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Large, Muted, P, Title } from '~/components/ui/typography';

export default function NotificationsScreen() {
  const headerHeight = useHeaderHeight();

  // Static astrology-related notifications
  const notifications = [
    {
      id: 1,
      type: 'horoscope',
      title: 'Daily Horoscope Update',
      message: 'Your daily horoscope is ready! Check what the stars have in store for you today.',
      date: '2024-03-20',
      status: 'info',
    },
    {
      id: 2,
      type: 'transit',
      title: 'Planetary Transit Alert',
      message:
        'Mercury is entering Pisces. Expect clarity in communication and emotional insights.',
      date: '2024-03-19',
      status: 'warning',
    },
    {
      id: 3,
      type: 'event',
      title: 'Upcoming Astrological Event',
      message: 'A full moon in Libra is approaching. It’s a great time for balance and harmony.',
      date: '2024-03-18',
      status: 'urgent',
    },
  ];

  // Get the appropriate icon for the notification type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'horoscope':
        return 'star';
      case 'transit':
        return 'globe';
      case 'event':
        return 'moon';
      default:
        return 'bell';
    }
  };

  // Get the status color for the notification
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'bg-yellow-500';
      case 'urgent':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const GITHUB_AVATAR_URI =
    'https://images.pexels.com/photos/3405808/pexels-photo-3405808.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView style={{ flex: 1, marginTop: headerHeight / 2 }} className="flex-1">
        <View className="flex-1 gap-4 p-6 pt-8">
          {/* Profile Completion Status */}
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 space-x-3">
                  <Avatar className=" border-2 border-primary">
                    <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                    <AvatarFallback>
                      <Feather name="user" size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <View>
                    <Large className="text-lg font-bold">Astrology Profile</Large>
                    <P className="text-sm text-muted-foreground">Your zodiac sign: Capricorn</P>
                  </View>
                </View>
                <Button variant="outline" size="sm" className="border-primary">
                  <Text className="text-primary">Update Profile</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Notifications List */}
          {notifications.map((notification) => (
            <Card key={notification.id} className="shadow-sm">
              <CardContent className="p-4">
                <View className="flex-row items-start space-x-3">
                  <View className={`rounded-full p-3 ${getStatusColor(notification.status)}`}>
                    <Feather name={getIconForType(notification.type)} size={20} color="white" />
                  </View>
                  <View className="flex-1 gap-2">
                    <Large className="text-lg font-semibold">{notification.title}</Large>
                    <P className="text-sm text-muted-foreground">{notification.message}</P>
                    <View className="mt-2 flex-row items-center space-x-2">
                      <Feather name="calendar" size={14} color="#6b7280" />
                      <Muted className="text-xs text-muted-foreground">
                        {new Date(notification.date).toLocaleDateString()}
                      </Muted>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
