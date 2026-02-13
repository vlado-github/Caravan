import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { InfiniteScrollQueryRequest } from "../../base/requests/InfiniteScrollQueryRequest";
import type { InfiniteScrollQueryResponse } from "../../base/responses/InfiniteScrollQueryResponse";
import { DefaultConsts } from "../../../consts/DefaultConsts";
import type { SocialGroupResponse } from "../responses/SocialGroupResponse";
import { GroupQueryKeys } from "./query-keys";
import { useAuth } from "react-oidc-context";

const urls = { 
  selection: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup/selection`),
};

function useSocialGroupsSelectionListFetchUrl(request: InfiniteScrollQueryRequest){
  const url = urls.selection;
  url.searchParams.set('pageNumber', `${request.pageNumber}`);
  url.searchParams.set('pageSize', `${request.pageSize}`);
  url.searchParams.set('searchTerm', `${request.searchTerm ?? ''}`);
  return url.href;
}

function getSocialGroupsSelectionListPage(accessToken: string, fetchURL: string): Promise<InfiniteScrollQueryResponse<SocialGroupResponse>> {
  return fetch(fetchURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })
      .then((res) => res.json() as unknown as InfiniteScrollQueryResponse<SocialGroupResponse>)
      .catch((error) => {
          console.error('Error fetching social groups for selection:', error);
          throw error;
      });
};

export function useSocialGroupsSelectionInfiniteScrollQuery(request: InfiniteScrollQueryRequest): UseInfiniteQueryResult<InfiniteData<InfiniteScrollQueryResponse<SocialGroupResponse>, unknown>, Error> {
  const fetchURL = useSocialGroupsSelectionListFetchUrl(request);
  const auth = useAuth();

  return useInfiniteQuery<InfiniteScrollQueryResponse<SocialGroupResponse>>({
    staleTime: 1000 * 30, // 30 seconds
    queryKey: [...GroupQueryKeys.selection, fetchURL],
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
      if (!auth.user?.access_token) {
        throw new Error('No access token available');
      }
      const url = urls.selection; // Use the infinite URL for infinite scroll queries
      url.searchParams.set('pageNumber', `${pageParam}`);
      url.searchParams.set('pageSize', `${request.pageSize}`);
      url.searchParams.set('searchTerm', `${request.searchTerm ?? ''}`);
      
      return await getSocialGroupsSelectionListPage(auth.user?.access_token, url.href);
    }
  });
}

export default {useSocialGroupsSelectionInfiniteScrollQuery};