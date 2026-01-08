import { useSearch } from "@tanstack/react-router";
import type { PagedQueryRequest } from "../../api/groups/requests/PagedQueryRequest";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useSocialEventsPagedQuery } from "../../api/socialevents/queries/get-social-events-list";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { socialEventsRoute } from "./SocialEvents";
import type { PagedViewModel } from "../../components/Paging/PagedViewModel";

export function useQueryResult(): PagedViewModel<SocialEventResponse> {
    const search = useSearch({from: socialEventsRoute.id});

    const request = {
      pageNumber: search?.start ?? DefaultConsts.FirstPageIndex,
      pageSize: search?.size ?? DefaultConsts.RowsPerPage
    } as PagedQueryRequest;

    const { data, isLoading } = useSocialEventsPagedQuery(request);

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
      lastItemOnPage: data?.lastItemOnPage ?? 0
    };
    return viewModel;
}