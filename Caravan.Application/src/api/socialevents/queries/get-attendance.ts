import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "./query-keys";
import type { PagedQueryRequest } from "../../groups/requests/PagedQueryRequest";
import type { DataTableQueryResponse } from "../../base/responses/DataTableQueryResponse";
import type { AttendanceResponse } from "../responses/AttendanceResponse";

const urls = { 
  list: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/attendance`),
};

function useAttendanceListFetchUrl(request: PagedQueryRequest){
  const url = urls.list;
  url.searchParams.set('pageNumber', `${request.pageNumber}`);
  url.searchParams.set('pageSize', `${request.pageSize}`);
  return url.href;
}

function getAttendanceListPage(accessToken: string, fetchURL: string): Promise<DataTableQueryResponse<AttendanceResponse>> {
  return fetch(fetchURL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then((res) => res.json() as unknown as DataTableQueryResponse<AttendanceResponse>)
  .catch((error) => {
      console.error('Error fetching attendance:', error);
      throw error;
  });
};

export function useAttendancePagedQuery(request: PagedQueryRequest): UseQueryResult<DataTableQueryResponse<AttendanceResponse>, Error> {
  const auth = useAuth();
  const fetchURL = useAttendanceListFetchUrl(request);
  return useQuery<DataTableQueryResponse<AttendanceResponse>>({
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
      queryKey: [...SocialEventQueryKeys.attendance, fetchURL],
      queryFn: async () =>
      {
        if (!auth.user?.access_token) {
          throw new Error('No access token available');
        }
        return await getAttendanceListPage(auth.user?.access_token, fetchURL);
      }
  });
}

export default {SocialEventQueryKeys, useAttendancePagedQuery};