/**
 * Creates a stable slug-like identifier from a human-readable name and a sample of an id.
 *
 * This is intended for user-facing URLs where you want something readable but still unique-ish.
 *
 * @param params - Input object.
 * @param params.id - Entity id (string or string-like).
 * @param params.varName - Human readable name to slugify (spaces become `-`).
 * @returns A string in the form `<name-with-dashes>-<first-8-of-id>`.
 */
export const createSlug = ({
  id,
  varName,
}: {
  id: string;
  varName: string;
}) => {
  const idString =
    typeof id === 'string' ? id : ((id as string)?.toString() ?? '');

  const splitEntityName = varName?.split(' ');
  //  const filteredWords = splitEntityName?.filter(
  //    (word) => word != "the" && word != "and",
  //  );
  const uuidSample = idString?.slice(0, 8);

  const newName = splitEntityName?.join('-');
  const entityUniqueName = newName + '-' + uuidSample;
  return entityUniqueName;
};

/**
 * Normalizes a nullable string or string array into a de-duplicated string array.
 *
 * @param value - A single string, a string array, or null/undefined.
 * @returns A string array (possibly empty). If a string is provided, it will be split by commas/whitespace.
 */
export const ensureArray = (
  value: string | string[] | null | undefined,
): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return parseDelimitedString(value);
};

/**
 * Splits a string (or recursively flattens an array of strings) into a de-duplicated list.
 *
 * Splits on commas and/or whitespace, trims items, removes empties, and removes duplicates.
 *
 * @param value - A string, an array of strings, or null/undefined.
 * @returns De-duplicated list of tokens.
 */
export const parseDelimitedString = (
  value: string | string[] | null | undefined,
): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => parseDelimitedString(item))
      .filter((item, index, self) => self.indexOf(item) === index);
  }
  return value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item, index, self) => self.indexOf(item) === index);
};
