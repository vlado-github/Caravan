export type PagedViewModel<T> = {
  items: Array<T>;
  totalItemCount: number;
  pageCount: number;
  isLoading: boolean;
  count: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
}