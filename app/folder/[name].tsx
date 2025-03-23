import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ideas, ideasToTags, tags } from '~/store/schema'; // Adjust the import to your schema file
import { drizzle } from 'drizzle-orm/expo-sqlite';
import Card from '~/components/Notes';
import { useEffect, useState, useRef } from 'react';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { MasonryFlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have this package installed

export default function FolderContent() {
  const { name, id } = useLocalSearchParams();
  const [ideasData, setIdeasData] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch folders from the database
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const result = await drizzleDb
          .select()
          .from(ideas)
          .leftJoin(ideasToTags, eq(ideas.id, ideasToTags.ideaId))
          .leftJoin(tags, eq(tags.id, ideasToTags.tagId))
          .where(eq(ideas.folderId, id.toString()));

        // Group the results by idea
        const groupedIdeas = result.reduce((acc, row) => {
          const ideaId = row.ideas.id;
          if (!acc[ideaId]) {
            // Create a new idea entry if it doesn't exist
            acc[ideaId] = {
              ...row.ideas,
              tags: [],
            };
          }
          // Add the tag if it exists
          if (row.tags && row.tags.id) {
            acc[ideaId].tags.push(row.tags);
          }
          return acc;
        }, {});

        // Convert the object to an array
        const ideasWithTags = Object.values(groupedIdeas);
        setIdeasData(ideasWithTags);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: name.toString(),
        }}
      />
      <MasonryFlashList
        contentInsetAdjustmentBehavior="automatic"
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => <Card idea={item} size={'auto'} />}
        estimatedItemSize={200}
        data={ideasData}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
});
