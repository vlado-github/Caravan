import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { SocialEventResponse } from "../responses/SocialEventResponse";
import { SocialEventQueryKeys } from "./query-keys";
import type { InfiniteScrollQueryRequest } from "../../base/requests/InfiniteScrollQueryRequest";
import type { InfiniteScrollQueryResponse } from "../../base/responses/InfiniteScrollQueryResponse";
import { DefaultConsts } from "../../../consts/DefaultConsts";

const urls = { 
  list: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/list`),
};

function useSocialEventsListFetchUrl(request: InfiniteScrollQueryRequest){
  const url = urls.list;
  url.searchParams.set('pageNumber', `${request.pageNumber}`);
  url.searchParams.set('pageSize', `${request.pageSize}`);
  return url.href;
}

function getSocialEventsListPage(fetchURL: string): Promise<InfiniteScrollQueryResponse<SocialEventResponse>> {
  return fetch(fetchURL, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then((res) => res.json() as unknown as InfiniteScrollQueryResponse<SocialEventResponse>)
      .catch((error) => {
          console.error('Error fetching social events:', error);
          throw error;
      });
};

export function useSocialEventsInfiniteScrollQuery(request: InfiniteScrollQueryRequest): UseInfiniteQueryResult<InfiniteData<InfiniteScrollQueryResponse<SocialEventResponse>, unknown>, Error> {
  const fetchURL = useSocialEventsListFetchUrl(request);

  return useInfiniteQuery<InfiniteScrollQueryResponse<SocialEventResponse>>({
    staleTime: 1000 * 30, // 30 seconds
    queryKey: [...SocialEventQueryKeys.list, fetchURL],
    initialPageParam: DefaultConsts.FirstPageIndex,
    getNextPageParam: (lastPage, allPages) => 
    {
      const nextPageNumber = allPages.length + 1;
      if (nextPageNumber >= lastPage.totalItemCount) {
          return undefined
      }
      return allPages.length + 1; // Use the length of all pages as the next page number
    },
    queryFn: async ({ pageParam = 0 }) => {
      const url = urls.list; // Use the infinite URL for infinite scroll queries
      url.searchParams.set('pageNumber', `${pageParam}`);
      url.searchParams.set('pageSize', `${request.pageSize}`);
      return await getSocialEventsListPage(url.href);
    }
  });
}

export default {SocialEventQueryKeys, useSocialEventsInfiniteScrollQuery};