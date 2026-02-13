import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SocialEventQueryKeys } from "../queries/query-keys";
import type { SubmitAttendnanceRequest } from "../requests/SubmitAttendanceRequest";

/**
 * Custom hook to submit RSVP for attending a Social Event using the Caravan API.
 * @param request The request payload for submitting RSVP for attending a social event.
 */
export function useAttendSocialEvent() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: SubmitAttendnanceRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent/attend`, {
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
                    console.error('Error sumbitting RSVP for social event:', error);
                    throw error; 
                });
            }
    });
}