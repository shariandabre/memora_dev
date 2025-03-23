import { folders, ideas, tags, ideasToTags } from './schema'; // Adjust the import to your actual schema file

export default async function seedDatabase(db: any) {
  // Insert sample folders
  const folder1 = await db
    .insert(folders)
    .values({
      id: 'folder1',
      name: 'Work',
      is_synced: 1,
    })
    .returning();

  const folder2 = await db
    .insert(folders)
    .values({
      id: 'folder2',
      name: 'Personal',
      is_synced: 1,
    })
    .returning();

  // Insert sample ideas
  const idea1 = await db
    .insert(ideas)
    .values({
      id: 'idea1',
      title: 'Project Alpha',
      description: 'A new project idea',
      folderId: folder1[0].id,
      is_synced: 1,
    })
    .returning();

  const idea2 = await db
    .insert(ideas)
    .values({
      id: 'idea2',
      title: 'Vacation Plan',
      description: 'Plan for the next vacation',
      folderId: folder2[0].id,
      is_synced: 1,
    })
    .returning();

  // Insert sample tags
  const tag1 = await db
    .insert(tags)
    .values({
      id: 'tag1',
      name: 'Urgent',
      is_synced: 1,
    })
    .returning();

  const tag2 = await db
    .insert(tags)
    .values({
      id: 'tag2',
      name: 'Leisure',
      is_synced: 1,
    })
    .returning();

  // Insert sample ideasToTags relationships
  await db
    .insert(ideasToTags)
    .values({
      ideaId: idea1[0].id,
      tagId: tag1[0].id,
    })
    .execute();

  await db
    .insert(ideasToTags)
    .values({
      ideaId: idea2[0].id,
      tagId: tag2[0].id,
    })
    .execute();

  console.log('Database seeded successfully!');
}
