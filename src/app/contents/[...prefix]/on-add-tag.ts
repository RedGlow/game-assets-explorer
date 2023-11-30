"use server";
import { revalidatePath } from 'next/cache';

import { tagFile, tagFiles } from '@/lib/tags';

import { getInvalidatePath } from './get-invalidate-path';

export async function onAddTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  await tagFile(fullName, tagKey, tagValue);
  const path = getInvalidatePath(fullName);
  revalidatePath(path);
}

export async function onAddTags(
  fullNames: string[],
  tagKey: string,
  tagValue: string
) {
  await tagFiles(fullNames, tagKey, tagValue);
  const path = getInvalidatePath(fullNames[0]);
  revalidatePath(path);
}
