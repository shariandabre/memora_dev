import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import useStore from "~/store/store";
import { Plus } from "~/lib/icons/Plus";
import { MasonryFlashList } from "@shopify/flash-list";
import Card from "~/components/Notes";
import { useSQLiteContext } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";
import { Text } from "~/components/ui/text";
import { fetchRecentIdeas } from "~/db/ideas";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const { openBottomSheet } = useStore();
  const db = useSQLiteContext();

  const insets = useSafeAreaInsets();
  const {
    data: ideasData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recentIdeas"],
    queryFn: () => fetchRecentIdeas(db),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator className="text-foreground" size="large" />
      </View>
    );
  }

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  if (error) {
    console.log(error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading ideas</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={ideasData || []}
        numColumns={2}
        renderItem={({ item }) => <Card idea={item} size={"auto"} />}
        estimatedItemSize={200}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text className="text-muted-foreground" style={styles.emptyText}>
              No ideas created in the last 7 days
            </Text>
          </View>
        )}
        onRefresh={refetch}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.createButton}
        className="bg-primary"
        onPress={openBottomSheet}
      >
        <Plus size={24} className="text-primary-foreground" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
    paddingBottom: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default Home;
