export function getInvalidatePath(fullName: string) {
  const parts = fullName.split("/").filter((x) => x);
  parts.pop();
  const path = `/contents/${parts.join("/")}`;
  // console.log("revalidating: " + path);
  return path;
}
