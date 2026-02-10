export const queryKeys = {
  all: ['supabase'] as const,
  tables: (table: string) => [...queryKeys.all, 'table', table] as const,
  tableRow: (table: string, id: string | number) =>
    [...queryKeys.tables(table), id] as const,
  showtimes: {
    all: ['showtimes'] as const,
    byTheater: (theater: string) => ['showtimes', 'theater', theater] as const,
  },
}
