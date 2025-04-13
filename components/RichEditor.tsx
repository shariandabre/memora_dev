import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Container } from "~/components/Container";
import { useColorScheme } from "~/lib/useColorScheme";
import {
  CoreBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import { useEffect, useState } from "react";
import { IdeaWithTags } from "~/db/ideas";
import { H1, Large, Muted, P, Small, Title } from "./ui/typography";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { Link } from "~/lib/icons/Link";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";

export default function RichEditor({
  data,
  mutation,
  isEditing,
}: {
  data: IdeaWithTags;
  mutation: any;
  isEditing: boolean;
}) {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const { isDarkColorScheme } = useColorScheme();
  const customFont = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Montserrat', sans-serif;
color:${isDarkColorScheme ? "hsl(229.76 31.78% 74.71%)" : "hsl(222.2 84% 4.9%)"}
    }

    blockquote {
      border-left: 3px solid ${isDarkColorScheme ? "hsl(232.5 15.38% 30.59%)" : "hsl(214.3 31.8% 91.4%)"};
      padding-left: 1rem;
    }
    
    .highlight-background {
      background-color: ${isDarkColorScheme ? "hsl(232.5 15.44% 18.32%)" : "hsl(210 40% 96.1%)"};
    }
  `;

  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    if (data.image) {
      ImageManipulator.manipulateAsync(data.image)
        .then(({ width, height }) => {
          const screenWidth = Dimensions.get("window").width;
          const aspectRatio = width / height;
          setImageHeight(screenWidth / aspectRatio);
        })
        .catch(() => setImageHeight(300)); // Fallback height
    }
  }, [data.image]);

  const initial = JSON.parse(data.content);

  const editor = useEditorBridge({
    autofocus: false,
    initialContent: initial ? initial : "",
    editable: isEditing,
    avoidIosKeyboard: true,
    dynamicHeight: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFont), // Custom font
    ],
    theme: {
      toolbar: {
        toolbarBody: {
          borderTopColor: isDarkColorScheme
            ? "hsl(232.5 15.38% 30.59%)"
            : "hsl(214.3 31.8% 91.4%)",
          borderBottomColor: isDarkColorScheme
            ? "hsl(232.5 15.38% 30.59%)"
            : "hsl(214.3 31.8% 91.4%)",
          backgroundColor: isDarkColorScheme
            ? "hsl(234.55 17.46% 12.35%)"
            : "hsl(0 0% 100%)",
        },
        toolbarButton: {
          backgroundColor: isDarkColorScheme
            ? "hsl(234.55 17.46% 12.35%)"
            : "hsl(0 0% 100%)",
        },
        iconDisabled: {
          tintColor: isDarkColorScheme
            ? "hsl(233.79 11.37% 50%)"
            : "hsl(215.4 16.3% 46.9%)",
        },
        iconWrapperActive: {
          backgroundColor: isDarkColorScheme
            ? "hsl(225.45 71.22% 72.75%)"
            : "hsl(210 40% 96.1%)",
        },
        iconWrapper: {
          borderRadius: 4,
          backgroundColor: isDarkColorScheme
            ? "hsl(234.55 17.46% 12.35%)"
            : "hsl(0 0% 100%)",
        },
        hidden: {
          display: "none",
        },
        icon: {
          tintColor: isDarkColorScheme
            ? "hsl(229.76 31.78% 74.71%)"
            : "hsl(222.2 84% 4.9%)",
        },
        linkBarTheme: {
          addLinkContainer: {
            backgroundColor: isDarkColorScheme
              ? "hsl(234.55 17.46% 12.35%)"
              : "hsl(0 0% 100%)",
            borderTopColor: isDarkColorScheme
              ? "hsl(232.5 15.38% 30.59%)"
              : "hsl(214.3 31.8% 91.4%)",
            borderBottomColor: isDarkColorScheme
              ? "hsl(232.5 15.38% 30.59%)"
              : "hsl(214.3 31.8% 91.4%)",
          },
          linkInput: {
            backgroundColor: isDarkColorScheme
              ? "hsl(234.55 17.46% 12.35%)"
              : "hsl(0 0% 100%)",
            color: isDarkColorScheme
              ? "hsl(229.76 31.78% 74.71%)"
              : "hsl(222.2 84% 4.9%)",
          },
          placeholderTextColor: isDarkColorScheme
            ? "hsl(233.79 11.37% 50%)"
            : "hsl(215.4 16.3% 46.9%)",
          doneButton: {
            backgroundColor: isDarkColorScheme
              ? "hsl(0 0% 82.75%)"
              : "hsl(220.47 98.26% 36.08%)",
          },
          doneButtonText: {
            color: isDarkColorScheme ? "hsl(0 0% 20%)" : "hsl(210 40% 98%)",
          },
          linkToolbarButton: {},
        },
      },
      colorKeyboard: {
        keyboardRootColor: isDarkColorScheme
          ? "hsl(240 13.73% 10%)"
          : "hsl(0 0% 100%)",
        colorSelection: [
          {
            name: "Primary",
            value: isDarkColorScheme
              ? "hsl(0 0% 82.75%)"
              : "hsl(220.47 98.26% 36.08%)",
          },
          {
            name: "Secondary",
            value: isDarkColorScheme
              ? "hsl(225.45 71.22% 72.75%)"
              : "hsl(210 40% 96.1%)",
          },
          {
            name: "Accent",
            value: isDarkColorScheme
              ? "hsl(234.55 17.83% 9.47%)"
              : "hsl(210 40% 96.1%)",
          },
          {
            name: "Destructive",
            value: isDarkColorScheme
              ? "hsl(1.58 47.5% 52.94%)"
              : "hsl(0 92.99% 56.11%)",
          },
        ],
      },
      webview: {
        backgroundColor: isDarkColorScheme
          ? "hsl(240 13.73% 10%)"
          : "hsl(0 0% 100%)",
      },
    },
  });

  const content = useEditorContent(editor, {
    debounceInterval: 1000,
    type: "json",
  });

  useEffect(() => {
    mutation.mutate(JSON.stringify(content));
  }, [content]);

  return (
    <View className="flex-1">
      <View className="flex-1">
        <ScrollView className="flex-1">
          <Container>
            <View className="flex flex-col w-full h-auto gap-4">
              {!isEditing ? (
                <H1>{data.title}</H1>
              ) : (
                <Textarea
                  numberOfLines={2}
                  style={{
                    fontFamily: "Montserrat_800ExtraBold",
                    fontSize: 36,
                    lineHeight: 40,
                  }}
                  className="bg-background border-0 border-none"
                  value={data.title}
                />
              )}
              {data.image && (
                <Image
                  style={[styles.image, { height: imageHeight }]}
                  className="border-border border"
                  source={data.image}
                  placeholder={{ blurhash }}
                  contentFit="fill"
                  transition={1000}
                />
              )}

              {data.link && (
                <View className="flex justify-start items-center  flex-row gap-2">
                  <Link size={12} className="text-muted-foreground" />
                  {!isEditing ? (
                    <P numberOfLines={2} className="text-muted-foreground">
                      {data.link}
                    </P>
                  ) : (
                    <Input
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 16,
                        lineHeight: 24,
                      }}
                      className="bg-background text-muted-foreground border-0 border-none"
                      value={data.link}
                    />
                  )}
                </View>
              )}
              {data.description && (
                <>
                  {!isEditing ? (
                    <P className="text-muted-foreground">{data.description}</P>
                  ) : (
                    <Textarea
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 16,
                        lineHeight: 24,
                      }}
                      className="bg-background text-muted-foreground border-0 border-none"
                      value={data.description}
                    />
                  )}
                </>
              )}
              {data.tags && (
                <ScrollView horizontal className="flex w-full flex-row gap-2">
                  {data.tags.map((tag, idx) => (
                    <Small
                      key={tag?.id || idx}
                      className="mx-1 rounded-2xl bg-primary px-3 py-1 text-primary-foreground"
                    >
                      #{tag?.name}
                    </Small>
                  ))}
                </ScrollView>
              )}
            </View>
            <RichText scrollEnabled={false} editor={editor} />
            <View style={{ height: 60 }} />
          </Container>
        </ScrollView>

        <Separator orientation="horizontal" decorative={true} />
      </View>
      {/* Toolbar as an absolutely positioned element */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.toolbarContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: "100%",
    borderRadius: 6,
    resizeMode: "cover",
  },
  toolbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
