import { eq } from 'drizzle-orm';
import 'react-native-get-random-values';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { v7 as uuidv7 } from 'uuid';
import { folders } from '~/store/schema';

export async function getAllFolders(expoDb: SQLiteDatabase) {
  const db = drizzle(expoDb);
  const result = await db
    .select({ name: folders.name, id: folders.id })
    .from(folders)
    .where(eq(folders.is_deleted, false));
  return result;
}

export async function createFolder(expoDb: SQLiteDatabase, folder: string) {
  const newId = uuidv7();
  const db = drizzle(expoDb);
  await db.insert(folders).values({ name: folder, id: newId, is_synced: false });
}
