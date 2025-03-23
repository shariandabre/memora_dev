import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// Define the folders table
export const folders = sqliteTable('folders', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  is_synced: integer('is_synced', { mode: 'boolean' }).notNull(),
  last_updated: text('last_updated')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  is_deleted: integer('is_deleted', { mode: 'boolean' })
    .notNull()
    .default(sql`0`),
});

// Define the ideas table
export const ideas = sqliteTable('ideas', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  link: text('link'),
  content: text('content'),
  image: text('image'),
  last_updated: text('last_updated')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  is_deleted: integer('is_deleted', { mode: 'boolean' })
    .notNull()
    .default(sql`0`),
  is_synced: integer('is_synced', { mode: 'boolean' }).notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  folderId: text('folderId')
    .notNull()
    .references(() => folders.id),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  taskId: text('task_id')
    .notNull()
    .references(() => ideas.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body'),
  notificationTime: integer('notification_time').notNull(),
  recurrenceType: text('recurrence_type').$type<RecurrenceType>().notNull().default('none'),
  notificationId: text('notification_id'), // Expo notification identifier
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// Define the tags table
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  is_deleted: integer('is_deleted', { mode: 'boolean' })
    .notNull()
    .default(sql`0`),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  last_updated: text('last_updated')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  is_synced: integer('is_synced', { mode: 'boolean' }).notNull(),
});

// Define the many-to-many relationship between ideas and tags
// Using the correct approach for composite primary key
export const ideasToTags = sqliteTable(
  'ideas_to_tags',
  {
    ideaId: text('idea_id')
      .notNull()
      .references(() => ideas.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => ({
    pk: primaryKey(table.ideaId, table.tagId),
  })
);
