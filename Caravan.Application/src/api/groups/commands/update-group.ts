import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { GroupQueryKeys } from "../../socialevents/queries/query-keys";
import type { UpdateGroupRequest } from "../requests/UpdateGroupRequest";

/**
 * Custom hook to update a Group using the Caravan API.
 * @param request The request payload for updating a group.
 */
export function useUpdateGroup() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: UpdateGroupRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup`, {
                    method: 'PUT',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                      queryClient.invalidateQueries({ queryKey: [GroupQueryKeys.list ] });
                    }
                }).catch((error) => {
                    console.error('Error updating group:', error);
                    throw error; 
                });
            }
    });
}