import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "../queries/query-keys";
import type { RescheduleSocialEventRequest } from "../requests/RescheduleSocialEventRequest";

/**
 * Custom hook to reschedule a Social Event using the Caravan API.
 * @param request The request payload for rescheduling a social event.
 */
export function usePublishSocialEvent() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: RescheduleSocialEventRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/reschedule`, {
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
                    console.error('Error rescheduling social event:', error);
                    throw error; 
                });
            }
    });
}