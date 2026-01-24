import React from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import { useQueryResult } from './useQueryResult';
import GalleryLayout from '../../components/Gallery/GalleryLayout';


const SocialEvents: React.FC = () => {
  const result = useQueryResult();

  return (
    <GalleryLayout viewModel={result} maxItemDescriptionLength={DefaultConsts.MaxDescriptionLengthInGallery} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const socialEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: SocialEvents,
});

export default SocialEvents;
