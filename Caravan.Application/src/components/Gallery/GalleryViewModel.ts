export type GalleryViewModel<T> = {
  items: Array<T>;
  totalItemCount: number;
  pageCount: number;
  isLoading: boolean;
}