import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { SocialEventResponse } from "../responses/SocialEventResponse";
import { useAuth, type AuthContextProps } from "react-oidc-context";
import { SocialEventQueryKeys } from "./query-keys";
import type { PagedQueryRequest } from "../requests/PagedQueryRequest";
import type { DataTableQueryResponse } from "../responses/DataTableQueryResponse";

const urls = { 
  list: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/list`),
};

function useSocialEventsListFetchUrl(request: PagedQueryRequest){
  const url = `${urls.list}/${request.pageNumber}/${request.pageSize}`;
  return url;
}

function getSocialEventsListPage(auth: AuthContextProps, fetchURL: string): Promise<DataTableQueryResponse<SocialEventResponse>> {
    return fetch(fetchURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user?.access_token}`
            }
        })
        .then((res) => res.json() as unknown as DataTableQueryResponse<SocialEventResponse>)
        .catch((error) => {
            console.error('Error fetching companies:', error);
            throw error; // Re-throw the error to be handled by the query
        });
};

export function useSocialEventsPagedQuery(request: PagedQueryRequest): UseQueryResult<DataTableQueryResponse<SocialEventResponse>, Error> {
    const auth = useAuth();
    const fetchURL = useSocialEventsListFetchUrl(request);

    return useQuery<DataTableQueryResponse<SocialEventResponse>>({
        staleTime: 1000 * 30, // 30 seconds
        placeholderData: keepPreviousData,
        queryKey: [...SocialEventQueryKeys.paging, fetchURL],
        queryFn: async () =>
        {
            return getSocialEventsListPage(auth, fetchURL);
        }
    });
}

export default {SocialEventQueryKeys, useSocialEventsPagedQuery};