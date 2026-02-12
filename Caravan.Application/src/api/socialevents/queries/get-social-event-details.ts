import type { SocialEventDetailsResponse } from "../responses/SocialEventDetailsResponse";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { SocialEventQueryKeys } from "./query-keys";
import { useAuth } from "react-oidc-context";

const urls = { 
  details: new URL(`${import.meta.env.VITE_CARAVAN_API_URL}/socialevent`),
};

function useSocialEventDetailsFetchUrl(socialEventId: string){
  const url = `${urls.details}/${socialEventId}`;
  return url;
}

function getSocialEventDetails(accessToken: string | undefined, fetchURL: string): Promise<SocialEventDetailsResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': accessToken ? `Bearer ${accessToken}` : ''
  };
  return fetch(fetchURL, {
          method: 'GET',
          headers: headers
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
        return await getSocialEventDetails(auth.user?.access_token, fetchURL);
      }
  });
}

export { useSocialEventDetails };