/**
 * Create a function that extracts the value of the given key from its parameter.
 * @param key The key to extract
 * @returns A function that extracts given key from its parameter.
 * @template TObject The type of the object to extract the key from
 * @template TKey The type of the key
 */
export function getter<TObject, TKey extends keyof TObject>(
  key: TKey
): (o: TObject) => TObject[TKey] {
  return (o) => o[key];
}
