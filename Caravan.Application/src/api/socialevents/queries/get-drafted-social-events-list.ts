import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { SocialEventResponse } from "../responses/SocialEventResponse";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "./query-keys";
import type { PagedQueryRequest } from "../../groups/requests/PagedQueryRequest";
import type { DataTableQueryResponse } from "../../base/responses/DataTableQueryResponse";

const urls = { 
  list: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/drafts`),
};

function useDraftedSocialEventsListFetchUrl(request: PagedQueryRequest){
  const url = urls.list;
  url.searchParams.set('pageNumber', `${request.pageNumber}`);
  url.searchParams.set('pageSize', `${request.pageSize}`);
  return url.href;
}

function getDraftedSocialEventsListPage(accessToken: string, fetchURL: string): Promise<DataTableQueryResponse<SocialEventResponse>> {
  return fetch(fetchURL, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          }
      })
      .then((res) => res.json() as unknown as DataTableQueryResponse<SocialEventResponse>)
      .catch((error) => {
          console.error('Error fetching drafted social events:', error);
          throw error;
      });
};

export function useDraftedSocialEventsPagedQuery(request: PagedQueryRequest): UseQueryResult<DataTableQueryResponse<SocialEventResponse>, Error> {
  const auth = useAuth();
  const fetchURL = useDraftedSocialEventsListFetchUrl(request);

  return useQuery<DataTableQueryResponse<SocialEventResponse>>({
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
      queryKey: [...SocialEventQueryKeys.drafts, fetchURL],
      queryFn: async () =>
      {
        if (!auth.user?.access_token) {
          throw new Error('No access token available');
        }
        return await getDraftedSocialEventsListPage(auth.user?.access_token, fetchURL);
      }
  });
}

export default {SocialEventQueryKeys, useDraftedSocialEventsPagedQuery};