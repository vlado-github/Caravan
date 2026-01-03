import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "../queries/query-keys";
import type { PublishSocialEventRequest } from "../requests/PublishSocialEventRequest";

/**
 * Custom hook to publish a Social Event using the Caravan API.
 * @param request The request payload for publishing a social event.
 */
export function usePublishSocialEvent() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: PublishSocialEventRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/publish`, {
                    method: 'PUT',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                      queryClient.invalidateQueries({ queryKey: [SocialEventQueryKeys.list ] });
                    }
                }).catch((error) => {
                    console.error('Error publishing social event:', error);
                    throw error; 
                });
            }
    });
}