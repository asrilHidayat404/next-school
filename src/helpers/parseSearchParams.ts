export function parseSearchParams(searchParams?: { [key: string]: string | string[] | undefined }) {
  const pageParam = searchParams?.page;
  const searchParam = searchParams?.search;

  const currentPage = Array.isArray(pageParam)
    ? Number(pageParam[0]) || 1
    : Number(pageParam) || 1;

  const searchQuery = Array.isArray(searchParam)
    ? searchParam[0] || ""
    : searchParam || "";

  return {
    currentPage,
    searchQuery,
  };
}
