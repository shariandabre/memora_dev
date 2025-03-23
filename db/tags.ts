import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { tags } from '~/store/schema';
import { v7 as uuidv7 } from 'uuid';
import 'react-native-get-random-values';
export async function getAllTages(expoDb: SQLiteDatabase) {
  const db = drizzle(expoDb);
  const result = await db
    .select({ name: tags.name, id: tags.id })
    .from(tags)
    .where(eq(tags.is_deleted, false));
  return result;
}

export async function createTag(expoDb: SQLiteDatabase, tag: string) {
  const newId = uuidv7();
  const db = drizzle(expoDb);
  await db.insert(tags).values({ id: newId, name: tag, is_synced: false });
}
