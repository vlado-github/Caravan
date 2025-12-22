export type InfiniteScrollQueryResponse<T> = {
  items: Array<T>;
	totalItemCount: number;
  pageCount: number;
}