import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { CreateSocialEventRequest } from "../requests/CreateSocialEventRequest";
import { SocialEventQueryKeys } from "../queries/query-keys";

/**
 * Custom hook to create a Social Event using the Caravan API.
 * @param request The request payload for creating a social event.
 * @returns The social event's Id.
 */
export function useCreateSocialEvent() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: CreateSocialEventRequest) =>
            {
              console.log('Creating draft social event with request:', JSON.stringify(request));
              return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent`, {
                  method: 'POST',
                  body: JSON.stringify(request),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${auth.user?.access_token}`
                  }
              }).then((res) => {
                  if (res.ok) {
                      queryClient.invalidateQueries({ queryKey: SocialEventQueryKeys.drafts });
                  }
                  return res.json() as unknown as number;
              }).catch((error) => {
                  console.error('Error creating draft social event:', error);
                  throw error; 
              });
            }
    });
}