export type InfiniteScrollViewModel<T> = {
  items: Array<T>;
  error?: string;
  hasNextPage?: boolean,
  isFetching?: boolean,
  isLoading?: boolean,
  onBottomReached: () => void;
};