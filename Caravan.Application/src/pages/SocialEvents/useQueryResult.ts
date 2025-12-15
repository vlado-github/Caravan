import { useSearch } from "@tanstack/react-router";
import type { PagedQueryRequest } from "../../api/requests/PagedQueryRequest";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useSocialEventsPagedQuery } from "../../api/queries/get-social-events-list";
import type { SocialEventResponse } from "../../api/responses/SocialEventResponse";
import { socialEventsRoute } from "./SocialEvents";
import type { GalleryViewModel } from "../../components/Gallery/GalleryViewModel";

export function useQueryResult(): GalleryViewModel<SocialEventResponse> {
    const search = useSearch({from: socialEventsRoute.id});

    const request = {
      pageNumber: search?.start ?? DefaultConsts.FirstPageIndex,
      pageSize: search?.size ?? DefaultConsts.RowsPerPage
    } as PagedQueryRequest;

    const { data, isLoading } = useSocialEventsPagedQuery(request);

    const viewModel: GalleryViewModel<SocialEventResponse> = {
      items: data?.items ?? [],
      totalItemCount: data?.totalItemCount ?? 0,
      pageCount: data?.pageCount ?? 0,
      isLoading: isLoading
    };
    return viewModel;
}