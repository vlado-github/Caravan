import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "../queries/query-keys";
import type { DeclineAttendanceRequest } from "../requests/DeclineAttendanceRequest";

/**
 * Custom hook to decline RSVP for a Social Event using the Caravan API.
 * @param request The request payload for declining RSVP for a social event.
 */
export function useDeclineAttendance() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: DeclineAttendanceRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/decline`, {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                      queryClient.invalidateQueries({ queryKey: SocialEventQueryKeys.attendance });
                    }
                    else {
                      throw new Error(`${res.status} ${res.statusText}`);
                    }
                }).catch((error) => {
                    console.error('Error declining RSVP for social event:', error);
                    throw error; 
                });
            }
    });
}