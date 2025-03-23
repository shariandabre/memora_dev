import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import PinterestLayout from '~/components/Pinterest';
import Card from '~/components/Notes';
import { folders } from '~/store/schema'; // Adjust the import to your schema file
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { FlashList } from '@shopify/flash-list';
const Folder = () => {
  const [foldersData, setFoldersData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  // Fetch folders from the database
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        // Query the folders table
        const result = await drizzleDb.select().from(folders);
        setFoldersData(result); // Update state with fetched folders
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchFolders();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={foldersData}
        numColumns={2}
        renderItem={({ item }) => <Card folder={item} size="folder" />}
        estimatedItemSize={50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 10,
  },
});

export default Folder;
