export type DataTableQueryResponse<T> = {
  items: Array<T>;
  totalItemCount: number;
  pageCount: number;
  pageSize: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
}