export function checkNoDirectories(...fullNames: string[]) {
  const dirs = fullNames.filter((e) => e.endsWith("/"));
  if (dirs.length > 0) {
    throw new Error(
      `tag operations cannot be performed on directories like: ${dirs.join(
        ", "
      )}`
    );
  }
}
