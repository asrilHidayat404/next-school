export function buildSearchWhere(base: object, searchQuery: string, fields: string[]) {
  return {
    ...base,
    ...(searchQuery
      ? { OR: fields.map((f) => ({ [f]: { contains: searchQuery } })) }
      : {}),
  };
}
