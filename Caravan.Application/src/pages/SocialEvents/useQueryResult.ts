import { DefaultConsts } from "../../consts/DefaultConsts";
import { useSocialEventsInfiniteScrollQuery } from "../../api/socialevents/queries/get-social-events-list";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import type { InfiniteScrollQueryRequest } from "../../api/base/requests/InfiniteScrollQueryRequest";
import type { InfiniteScrollViewModel } from "../../components/Paging/InfiniteScrollViewModel";

export function useQueryResult(): InfiniteScrollViewModel<SocialEventResponse> {
  const request = {
    pageNumber: DefaultConsts.FirstPageIndex,
    pageSize: DefaultConsts.RowsPerPage
  } as InfiniteScrollQueryRequest;

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetching,
    isLoading,
    error: queryError
  } = useSocialEventsInfiniteScrollQuery(request);

  let records: SocialEventResponse[] = [];

  if (data?.pages) {
    const items = data.pages.flatMap(page => page.items ?? []);
    records = items.map(record => 
      {
        return  {
          id: record.id,
          title: record.title,
          startTime: record.startTime,
          description: record.description
        } as SocialEventResponse;
    });
  }

  const viewModel: InfiniteScrollViewModel<SocialEventResponse> = {
    items: records,
    onBottomReached: () => { fetchNextPage(); },
    error: queryError ? queryError.message : undefined,
    hasNextPage: hasNextPage,
    isFetching: isFetching,
    isLoading: isLoading,
  };
  return viewModel;
}