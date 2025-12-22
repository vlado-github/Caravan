import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { GroupQueryKeys } from "../../socialevents/queries/query-keys";
import type { JoinGroupRequest } from "../requests/JoinGroupRequest";

/**
 * Custom hook to join user to a Group using the Caravan API.
 * @param request The request payload for joining to a group.
 */
export function useJoinGroup() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: JoinGroupRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup/join`, {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                      queryClient.invalidateQueries({ queryKey: [GroupQueryKeys.mygroups ] });
                    }
                }).catch((error) => {
                    console.error('Error joining group:', error);
                    throw error; 
                });
            }
    });
}