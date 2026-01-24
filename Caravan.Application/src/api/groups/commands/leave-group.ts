import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { LeaveGroupRequest } from "../requests/LeaveGroupRequest";
import { GroupQueryKeys } from "../queries/query-keys";

/**
 * Custom hook to leave a Group using the Caravan API.
 * @param request The request payload for leaving a group.
 */
export function useLeaveGroup() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: LeaveGroupRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup/leave`, {
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
                    else {
                      throw new Error(`${res.status} ${res.statusText}`);
                    }
                }).catch((error) => {
                    console.error('Error leaving group:', error);
                    throw error; 
                });
            }
    });
}