import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "../queries/query-keys";
import type { ArchiveSocialEventRequest } from "../requests/ArchiveSocialEventRequest";

/**
 * Custom hook to archive a Social Event using the Caravan API.
 * @param request The request payload for archiving a social event.
 */
export function useCancelSocialEvent() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: ArchiveSocialEventRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/archive`, {
                    method: 'PUT',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                        queryClient.invalidateQueries({ queryKey: SocialEventQueryKeys.paging });
                    }
                }).catch((error) => {
                    console.error('Error cancelling social event:', error);
                    throw error; 
                });
            }
    });
}