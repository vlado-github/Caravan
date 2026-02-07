import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { DataTableQueryResponse } from "../../base/responses/DataTableQueryResponse";
import type { PagedQueryRequest } from "../requests/PagedQueryRequest";
import type { SocialGroupResponse } from "../responses/SocialGroupResponse";
import { useAuth } from "react-oidc-context";
import { GroupQueryKeys } from "./query-keys";

const urls = { 
  list: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup/list`),
};

function useSocialGroupsListFetchUrl(request: PagedQueryRequest){
  const url = urls.list;
  url.searchParams.set('pageNumber', `${request.pageNumber}`);
  url.searchParams.set('pageSize', `${request.pageSize}`);
  return url.href;
}

function getSocialGroupsListPage(accessToken: string, fetchURL: string): Promise<DataTableQueryResponse<SocialGroupResponse>> {
  return fetch(fetchURL, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          }
      })
      .then((res) => res.json() as unknown as DataTableQueryResponse<SocialGroupResponse>)
      .catch((error) => {
          console.error('Error fetching social groups:', error);
          throw error;
      });
};

export function useSocialGroupsPagedQuery(request: PagedQueryRequest): UseQueryResult<DataTableQueryResponse<SocialGroupResponse>, Error> {
  const auth = useAuth();
  const fetchURL = useSocialGroupsListFetchUrl(request);
  return useQuery<DataTableQueryResponse<SocialGroupResponse>>({
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
      queryKey: [...GroupQueryKeys.list, fetchURL],
      queryFn: async () =>
      {
        if (!auth.user?.access_token) {
          throw new Error('No access token available');
        }
        return await getSocialGroupsListPage(auth.user?.access_token, fetchURL);
      }
  });
}

export default {GroupQueryKeys, useSocialGroupsPagedQuery};