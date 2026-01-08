import type { PagedQueryRequest } from "../../api/groups/requests/PagedQueryRequest";
import { useDraftedSocialEventsPagedQuery } from "../../api/socialevents/queries/get-drafted-social-events-list";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import type { PagedViewModel } from "../../components/Paging/PagedViewModel";
import { DefaultConsts } from "../../consts/DefaultConsts";
import type { DataTableSearch } from "../../components/DataTable/DataTableSearch";

export function useQueryResult(search: DataTableSearch): PagedViewModel<SocialEventResponse> {
  const request = {
    pageNumber: search?.start ?? DefaultConsts.FirstPageIndex,
    pageSize: search?.size ?? 10
  } as PagedQueryRequest;

  const { data, isLoading } = useDraftedSocialEventsPagedQuery(request);

  const viewModel: PagedViewModel<SocialEventResponse> = {
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