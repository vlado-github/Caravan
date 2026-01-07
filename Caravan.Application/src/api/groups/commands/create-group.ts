import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { CreateGroupRequest } from "../requests/CreateGroupRequest";
import { GroupQueryKeys } from "../../groups/queries/query-keys";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to create a Group using the Caravan API.
 * @param request The request payload for creating a group.
 * @returns The group's Id.
 */
export function useCreateGroup() {
    const auth = useAuth();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (request: CreateGroupRequest) =>
            {
                return fetch(`${import.meta.env.VITE_CARAVAN_API_URL}/socialgroup`, {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user?.access_token}`
                    }
                }).then((res) => {
                    if (res.ok) {
                        queryClient.invalidateQueries({ queryKey: GroupQueryKeys.list });
                    }
                    else {
                      throw new Error(`${res.status} ${res.statusText}`);
                    }
                    return res.json() as unknown as number;
                }).catch((error) => {
                    console.error(t('Error creating group:'), error);
                    throw error; 
                });
            }
    });
}