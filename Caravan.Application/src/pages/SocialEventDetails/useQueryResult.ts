import { useSearch } from "@tanstack/react-router";
import type { PagedQueryRequest } from "../../api/groups/requests/PagedQueryRequest";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useSocialEventsPagedQuery } from "../../api/socialevents/queries/get-social-events-list";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { socialEventsRoute } from "./SocialEvents";
import type { GalleryViewModel } from "../../components/Gallery/GalleryViewModel";
import { useSocialEventDetails } from "../../api/socialevents/queries/get-social-event-details";

export function useQueryResult(): GalleryViewModel<SocialEventResponse> {
    const search = useSearch({from: socialEventsRoute.id});

    const { data, isLoading } = useSocialEventDetails(search?.id ?? '');

    const viewModel: GalleryViewModel<SocialEventResponse> = {
      items: data?.items ?? [],
      totalItemCount: data?.totalItemCount ?? 0,
      pageCount: data?.pageCount ?? 0,
      isLoading: isLoading
    };
    return viewModel;
}