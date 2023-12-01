"use server";

import { revalidatePath } from 'next/cache';

import { removeTag, removeTags } from '@/lib/tags';

import { getInvalidatePath } from '../../app/contents/[...prefix]/get-invalidate-path';

export async function onDeleteTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  await removeTag(fullName, tagKey, tagValue);
  const path = getInvalidatePath(fullName);
  revalidatePath(path);
}

export async function onDeleteTags(fullNames: string[]) {
  await removeTags(fullNames);
  const path = getInvalidatePath(fullNames[0]);
  revalidatePath(path);
}
