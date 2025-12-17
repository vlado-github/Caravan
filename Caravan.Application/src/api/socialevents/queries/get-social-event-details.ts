import type { AuthContextProps } from "react-oidc-context";
import type { SocialEventDetailsResponse } from "../responses/SocialEventDetailsResponse";
import { useAuth } from "react-oidc-context";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { SocialEventQueryKeys } from "./query-keys";

const urls = { 
  details: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent`),
};

function useSocialEventDetailsFetchUrl(socialEventId: string){
  const url = `${urls.details}/${socialEventId}`;
  return url;
}

function getSocialEventDetails(auth: AuthContextProps, fetchURL: string): Promise<SocialEventDetailsResponse> {
  return fetch(fetchURL, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.user?.access_token}`
          }
      })
      .then((res) => res.json() as unknown as SocialEventDetailsResponse)
      .catch((error) => {
          console.error('Error fetching social event details:', error);
          throw error;
      });
};

function useSocialEventDetails(socialEventId: string): UseQueryResult<SocialEventDetailsResponse> {
  const auth = useAuth();
  const fetchURL = useSocialEventDetailsFetchUrl(socialEventId);  

  return useQuery<SocialEventDetailsResponse>({
      queryKey: [...SocialEventQueryKeys.details, socialEventId],
      queryFn: async () =>
      {
          return await getSocialEventDetails(auth, fetchURL);
      }
  });
}

export { useSocialEventDetails };