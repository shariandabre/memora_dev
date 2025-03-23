import { useMutation, useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { fetchContentFromId, saveContent } from '~/db/ideas';
import RichEditor from '~/components/RichEditor';

export default function Content() {
  const { id, editable, title } = useLocalSearchParams();
  const { isDarkColorScheme } = useColorScheme();
  const db = useSQLiteContext();
  console.log(id, editable, title);
  const mutation = useMutation({
    mutationFn: (content: string) => saveContent(db, content, id.toString()),
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentFromId(db, id.toString()),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator className="text-foreground" size="large" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: title.toString() }} />
      <RichEditor data={data} mutation={mutation} />
    </>
  );
}
