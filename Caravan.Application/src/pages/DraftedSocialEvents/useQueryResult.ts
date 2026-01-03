import { useSearch } from "@tanstack/react-router";
import type { PagedQueryRequest } from "../../api/groups/requests/PagedQueryRequest";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useDraftedSocialEventsPagedQuery } from "../../api/socialevents/queries/get-drafted-social-events-list";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { draftedSocialEventsRoute } from "./DraftedSocialEvents";
import type { GalleryViewModel } from "../../components/Gallery/GalleryViewModel";

export function useQueryResult(): GalleryViewModel<SocialEventResponse> {
    const search = useSearch({from: draftedSocialEventsRoute.id});

    const request = {
      pageNumber: search?.start ?? DefaultConsts.FirstPageIndex,
      pageSize: search?.size ?? DefaultConsts.RowsPerPage
    } as PagedQueryRequest;

    const { data, isLoading } = useDraftedSocialEventsPagedQuery(request);

    const viewModel: GalleryViewModel<SocialEventResponse> = {
      items: data?.items ?? [],
      totalItemCount: data?.totalItemCount ?? 0,
      pageCount: data?.pageCount ?? 0,
      isLoading: isLoading
    };
    return viewModel;
}