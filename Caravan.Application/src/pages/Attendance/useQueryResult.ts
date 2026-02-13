import type { PagedQueryRequest } from "../../api/groups/requests/PagedQueryRequest";
import type { PagedViewModel } from "../../components/Paging/PagedViewModel";
import { DefaultConsts } from "../../consts/DefaultConsts";
import type { DataTableSearch } from "../../components/Custom/DataTable/DataTableSearch";
import type { AttendanceResponse } from "../../api/socialevents/responses/AttendanceResponse";
import { useAttendancePagedQuery } from "../../api/socialevents/queries/get-attendance";

export function useQueryResult(search: DataTableSearch): PagedViewModel<AttendanceResponse> {
  const request = {
    pageNumber: search?.start ?? DefaultConsts.FirstPageIndex,
    pageSize: search?.size ?? DefaultConsts.RowsPerTable
  } as PagedQueryRequest;

  const { data, isLoading } = useAttendancePagedQuery(request);

  const viewModel: PagedViewModel<AttendanceResponse> = {
    items: data?.items ?? [],
    totalItemCount: data?.totalItemCount ?? 0,
    pageCount: data?.pageCount ?? 0,
    isLoading: isLoading,
    count: data?.count ?? 0,
    pageNumber: request.pageNumber ?? 0,
    pageSize: data?.pageSize ?? 0,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    hasNextPage: data?.hasNextPage ?? false,
    isFirstPage: data?.isFirstPage ?? false,
    isLastPage: data?.isLastPage ?? false,
    firstItemOnPage: data?.firstItemOnPage ?? 0,
    lastItemOnPage: data?.lastItemOnPage ?? 0,
  };
  return viewModel;
}