import React from 'react';
import { createRoute, useSearch } from '@tanstack/react-router';
import { rootRoute } from '../../AppRouter';
import { useAuth } from 'react-oidc-context';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearch } from '../../components/Gallery/PageSearch';
import { useQueryResult } from './useQueryResult';
import GalleryLayout from '../../components/Gallery/GalleryLayout';


const SocialEvents: React.FC = () => {
  const auth = useAuth();
  const search = useSearch({from: socialEventsRoute.id});
  const result = useQueryResult();
  console.log('Auth in Home:', auth);
  return (<>
      <div>Home Page: {auth.user?.profile.email}</div>
      <div>Search Params: start={search.start}, size={search.size}</div>
      <GalleryLayout viewModel={result} />
    </>);
}

// eslint-disable-next-line react-refresh/only-export-components
export const socialEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: SocialEvents,
  validateSearch: (search: Record<string, unknown>): PageSearch => {
        if (Object.keys(search).length === 0)
        {
            return {
              start: DefaultConsts.FirstPageIndex,
              size: DefaultConsts.RowsPerPage,
            };
        }
        return {
          start: Number(search?.start ?? DefaultConsts.FirstPageIndex),
          size: Number(search?.size ?? DefaultConsts.RowsPerPage),
        };
    },
});

export default SocialEvents;
