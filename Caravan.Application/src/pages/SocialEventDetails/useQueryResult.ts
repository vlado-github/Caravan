import { useParams } from "@tanstack/react-router";
import { socialEventDetailsRoute } from "./SocialEventDetails";
import { useSocialEventDetails } from "../../api/socialevents/queries/get-social-event-details";
import type { PreviewViewModel } from "../../components/Preview/PreviewViewModel";

export function useQueryResult(): PreviewViewModel {
    const params = useParams({from: socialEventDetailsRoute.id});

    const { data, isLoading } = useSocialEventDetails(params?.eventId ?? '');

    if (!data) {
      return {} as PreviewViewModel;
    }
    
    const viewModel: PreviewViewModel = {
      ...data,
      isLoading: isLoading
    }
    return viewModel;
}