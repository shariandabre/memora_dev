import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, StyleSheet } from "react-native";
import Card from "~/components/Notes";
import { folders } from "~/store/schema"; // Adjust the import to your schema file
import { useSQLiteContext } from "expo-sqlite";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { getAllFolders } from "~/db/folder";

const Folder = () => {
  const db = useSQLiteContext();

  const {
    data: foldersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFolders"],
    queryFn: () => getAllFolders(db),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    width: "100%",
    height: "100%",
    padding: 10,
  },
});

export default Folder;
