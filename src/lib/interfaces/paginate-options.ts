type SortBy = "plate" | "created_at" | "price";
type SortDirection = "ASC" | "DESC";

export interface PaginateOptions {
  page?: number;
  searchTerm?: string;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}
