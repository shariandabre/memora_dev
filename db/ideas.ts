import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { v7 as uuidv7 } from 'uuid';
import { ideas, ideasToTags, notifications, tags } from '~/store/schema';
import { Idea } from '~/lib/types';
import { scheduleNotification } from '~/services/notificationService';
import { eq, sql } from 'drizzle-orm';
import 'react-native-get-random-values';

export async function createIdea(expoDb: SQLiteDatabase, idea: Idea) {
  const db = drizzle(expoDb);

  await db.transaction(async (tx) => {
    const ideasId = uuidv7();

    // Create idea
    await tx.insert(ideas).values({
      title: idea.title,
      image: idea.image,
      link: idea.link,
      description: idea.description,
      folderId: idea.folder_id,
      id: ideasId,
      is_synced: false,
    });

    // Handle tags
    if (idea.tags) {
      for (const tag of idea.tags) {
        await tx.insert(ideasToTags).values({ ideaId: ideasId, tagId: tag });
      }
    }

    // Handle notification
    if (idea.notification) {
      const notificationId = uuidv7();
      const notificationTime = idea.notification.date;

      // Create notification record
      await tx.insert(notifications).values({
        id: notificationId,
        taskId: ideasId,
        title: `Reminder: ${idea.title}`,
        body: idea.description || 'Check your idea',
        notificationTime,
        recurrenceType: idea.notification.recurrence,
      });

      // Schedule the notification
      await scheduleNotification({
        id: notificationId,
        taskId: ideasId,
        title: `Reminder: ${idea.title}`,
        body: idea.description || 'Check your idea',
        time: notificationTime,
        recurrenceType: idea.notification.recurrence,
      });
    }
  });
}

export const fetchRecentIdeas = async (expoDb: SQLiteDatabase) => {
  const db = drizzle(expoDb);
  //const { content, is_synced, is_deleted, last_updated, ...rest } = getTableColumns(ideas);
  const result = await db
    .select()
    .from(ideas)
    .where(sql`datetime(${ideas.created_at}) >= datetime('now', '-7 days')`)
    .orderBy(ideas.created_at)
    .leftJoin(ideasToTags, eq(ideas.id, ideasToTags.ideaId))
    .leftJoin(tags, eq(tags.id, ideasToTags.tagId));

  const groupedIdeas = result.reduce((acc, row) => {
    const ideaId = row.ideas.id;
    if (!acc[ideaId]) {
      acc[ideaId] = {
        ...row.ideas,
        tags: [],
      };
    }
    if (row.tags && row.tags.id) {
      acc[ideaId].tags.push(row.tags);
    }
    return acc;
  }, {});

  return Object.values(groupedIdeas);
};

export const fetchContentFromId = async (expoDb: SQLiteDatabase, id: string) => {
  const drizzleDb = drizzle(expoDb);
  const result = await drizzleDb
    .select({ content: ideas.content })
    .from(ideas)
    .where(eq(ideas.id, id.toString()));
  return result;
};

export const saveContent = async (expoDb: SQLiteDatabase, content: string, id: string) => {
  const drizzleDb = drizzle(expoDb);
  await drizzleDb
    .update(ideas)
    .set({ content: content?.toString(), is_synced: false })
    .where(eq(ideas.id, id.toString()));
};
