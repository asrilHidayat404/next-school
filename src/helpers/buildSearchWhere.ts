export function buildSearchWhere(base: object, searchQuery: string, fields: string[]) {
  if (!searchQuery) return base;

  const orConditions = fields.map((field) => {
    if (field.includes(".")) {
      // Tangani field relasi, misal "user.full_name"
      const [relation, subField] = field.split(".");
      return {
        [relation]: {
          [subField]: { contains: searchQuery },
        },
      };
    }

    // Field biasa
    return { [field]: { contains: searchQuery } };
  });

  return {
    ...base,
    OR: orConditions,
  };
}
