import React from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearch } from '../../components/Gallery/PageSearch';
import { useQueryResult } from './useQueryResult';
import GalleryLayout from '../../components/Gallery/GalleryLayout';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import AppModals from '../../components/Modals/AppModals';
import { useTranslation } from 'react-i18next';
import type { CreateSocialEventRequest } from '../../api/socialevents/requests/CreateSocialEventRequest';

const SocialEvents: React.FC = () => {
  const {t} = useTranslation();
  const result = useQueryResult();

  const actions = (
        <Button onClick={() => {
            modals.openContextModal({
                modal: AppModals.modalKeys.createSocialEvent,
                title: t('Create Social Event'),
                innerProps: {
                    modalData:  {} as CreateSocialEventRequest
                }
            });
        }}>
            {t('Create')}
        </Button>
    );

  return (
    <GalleryLayout viewModel={result} actions={actions} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const draftedSocialEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drafts",
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
