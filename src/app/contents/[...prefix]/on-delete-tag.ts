"use server";

import { revalidatePath } from 'next/cache';

import { removeTag } from '@/lib/tags';

import { getInvalidatePath } from './get-invalidate-path';

export async function onDeleteTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  await removeTag(fullName, tagKey, tagValue);
  const path = getInvalidatePath(fullName);
  revalidatePath(path);
}
