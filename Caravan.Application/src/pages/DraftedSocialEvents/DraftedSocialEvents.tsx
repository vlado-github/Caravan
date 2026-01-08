import React from 'react';
import { createRoute, useSearch } from '@tanstack/react-router';
import { rootRoute, type RoutingContext } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearch } from '../../components/Paging/PageSearch';
import { useQueryResult } from './useQueryResult';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import AppModals from '../../components/Modals/AppModals';
import { useTranslation } from 'react-i18next';
import type { CreateSocialEventRequest } from '../../api/socialevents/requests/CreateSocialEventRequest';
import i18n from '../../i18n';
import DataTable from '../../components/DataTable/DataTable';
import type { SocialEventResponse } from '../../api/socialevents/responses/SocialEventResponse';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

const rowsPerPage = 10;

const columnHelper = createColumnHelper<SocialEventResponse>()
const columns = [
  columnHelper.accessor('id', {
    header: i18n.t('ID'),
  }),
  columnHelper.accessor('title', {
    header: i18n.t('Title'),
  }),
  columnHelper.accessor('startTime', {
    header: i18n.t('Start Time'),
    cell: info => new Date(info.getValue()).toLocaleString(i18n.language),
  }),
] as ColumnDef<SocialEventResponse, unknown>[];

const DraftedSocialEvents: React.FC = () => {
  const {t} = useTranslation();
  const searchParams = useSearch({from: draftedSocialEventsRoute.id});
  const result = useQueryResult(searchParams);

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
    <DataTable model={result} actions={actions} search={searchParams} columns={columns} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const draftedSocialEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drafts",
  component: DraftedSocialEvents,
  beforeLoad: async ({context} : {context : RoutingContext}) => {
    if (!context.auth.isAuthenticated) {
      await context.auth.signinRedirect({ ui_locales: i18n.language });
    }
  },
  validateSearch: (search: Record<string, unknown>): PageSearch => {
        if (Object.keys(search).length === 0)
        {
            return {
              start: DefaultConsts.FirstPageIndex,
              size: rowsPerPage,
            };
        }
        return {
          start: Number(search?.start ?? DefaultConsts.FirstPageIndex),
          size: Number(search?.size ?? rowsPerPage),
        };
    },
});

export default DraftedSocialEvents;
