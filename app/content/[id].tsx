import { useMutation, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { fetchIdeaById, saveContent } from "~/db/ideas";
import RichEditor from "~/components/RichEditor";
import { Save } from "~/lib/icons/Save";
import { Pencil } from "~/lib/icons/Pencil";
import { Suspense, useRef, useState } from "react";

export default function Content() {
  const { id, editable } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: (content: string) => saveContent(db, content, id.toString()),
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["content", id],
    queryFn: () => fetchIdeaById(db, id.toString()),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      <Stack.Screen
        options={{
          title: data?.title.toString(),
          headerRight(props) {
            return (
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                disabled={isSaving}
                style={{ opacity: isSaving ? 0.5 : 1 }}
              >
                {!isEditing ? (
                  <Pencil size={20} className={"text-foreground"} />
                ) : isSaving ? (
                  <ActivityIndicator size="small" className="text-foreground" />
                ) : (
                  <Save size={20} className="text-foreground" />
                )}
              </TouchableOpacity>
            );
          },
        }}
      />
      <Suspense
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator className="text-foreground" size="large" />
          </View>
        }
      >
        <RichEditor isEditing={isEditing} data={data} mutation={mutation} />
      </Suspense>
    </>
  );
}
