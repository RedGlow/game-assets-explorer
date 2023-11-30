"use server";

import { revalidatePath } from 'next/cache';

import { removeTag } from '@/lib/tags';

export async function onDeleteTag(
  fullName: string,
  tagKey: string,
  tagValue: string
) {
  await removeTag(fullName, tagKey, tagValue);
  const parts = fullName.split("/").filter((x) => x);
  parts.pop();
  const path = `/contents/${parts.join("/")}`;
  console.log("revalidating: " + path);
  revalidatePath(path);
}
