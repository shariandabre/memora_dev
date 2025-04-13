import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useColorScheme } from "~/lib/useColorScheme";
import { NAV_THEME } from "~/lib/constants";
import FolderOpenIcon from "~/lib/icons/folderIcon";
import { Muted, P, Small } from "./ui/typography";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { Image } from "expo-image";
import FolderMenu from "./dialogmenu";

function AlertDialogScreen({ open, setOpen, id }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete the folder?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            folder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => setOpen(false)}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Text>Continue</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const Notes = ({
  size,
  folder,
  idea,
}: {
  size: string;
  folder?: any;
  idea?: any;
}) => {
  const { isDarkColorScheme } = useColorScheme();

  if (size === "folder") {
    return (
      <>
        <Card
          className="border-0 bg-background"
          style={[styles.card, styles[size]]}
        >
          <CardContent className="m-0 flex h-full w-full flex-1 items-center justify-center p-0">
            <TouchableOpacity
              onPress={() => {
                router.setParams({ id: folder.id });
                router.push(`/folder/${folder.name}?id=${folder.id}`);
              }}
              style={styles.touchable}
            >
              <FolderOpenIcon
                size={130}
                color={
                  isDarkColorScheme
                    ? NAV_THEME.dark.primary
                    : NAV_THEME.light.primary
                }
              />
            </TouchableOpacity>
          </CardContent>
          <CardFooter className="flex w-full flex-row items-center justify-between">
            <P>{folder.name}</P>
            <FolderMenu />
          </CardFooter>

          {/*<AlertDialogScreen open={open} setOpen={setOpen} id={folder.id} />*/}
        </Card>
      </>
    );
  } else {
    const blurhash =
      "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
    return (
      <Card className="rounded-2xl p-2 " style={[styles.card, styles[size]]}>
        <TouchableOpacity
          onPress={() => {
            router.setParams({ editable: 0, title: idea?.title });
            router.push(`/content/${idea?.id}?editable=0&title=${idea?.title}`);
          }}
          className="h-full w-full flex-1"
        >
          <CardHeader className="p-0" style={{ paddingVertical: 24 }}>
            <CardTitle numberOfLines={2}>{idea?.title}</CardTitle>
          </CardHeader>
          <CardContent
            className="flex flex-col gap-2 p-0"
            style={{ paddingBottom: 24 }}
          >
            {idea?.image && (
              <Image
                style={styles.image}
                source={idea.image}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            )}
            {idea?.link && <P numberOfLines={2}>{idea.link}</P>}
            {idea?.description && (
              <CardDescription numberOfLines={5}>
                {idea.description}
              </CardDescription>
            )}
          </CardContent>
          <CardFooter
            className="flex flex-col items-end justify-end p-0"
            style={{ paddingBottom: 24 }}
          >
            {idea?.tags && (
              <ScrollView
                horizontal={true}
                className="flex w-full flex-row gap-2"
              >
                {idea.tags.map((tag, idx) => (
                  <Small
                    key={tag?.id || idx}
                    className="mx-1 rounded-2xl bg-primary px-3 py-1 text-primary-foreground"
                  >
                    #{tag?.name}
                  </Small>
                ))}
              </ScrollView>
            )}
            <FolderMenu />
          </CardFooter>
        </TouchableOpacity>
      </Card>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    width: "95%",
    margin: 5,
  },
  small: {
    height: 260,
  },
  medium: {
    height: 330,
  },
  large: {
    height: 450,
  },
  auto: {
    height: "auto",
  },
  folder: {
    aspectRatio: 1,
    height: "auto",
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
  },
});

export default Notes;
