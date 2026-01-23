import React from 'react';
import { createRoute, useSearch } from '@tanstack/react-router';
import { rootRoute, type RoutingContext } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearch } from '../../components/Paging/PageSearch';
import { useQueryResult } from './useQueryResult';
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import AppModals from '../../components/Modals/AppModals';
import { useTranslation } from 'react-i18next';
import type { CreateSocialEventRequest } from '../../api/socialevents/requests/CreateSocialEventRequest';
import i18n from '../../i18n';
import DataTable from '../../components/DataTable/DataTable';
import type { SocialEventResponse } from '../../api/socialevents/responses/SocialEventResponse';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { getAllSocialEventStatus } from '../../api/base/enums/SocialEventStatus';
import { usePublishSocialEvent } from '../../api/socialevents/commands/publish-social-event';
import type { PublishSocialEventRequest } from '../../api/socialevents/requests/PublishSocialEventRequest';
import { notifications } from "@mantine/notifications";

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
  columnHelper.accessor('status', {
    header: i18n.t('Status'),
    cell: info => i18n.t(getAllSocialEventStatus()[info.getValue()].label),
  }),
  
] as ColumnDef<SocialEventResponse, unknown>[];

const DraftedSocialEvents: React.FC = () => {
  const {t} = useTranslation();
  const searchParams = useSearch({from: draftedSocialEventsRoute.id});
  const result = useQueryResult(searchParams);
  const { mutate } = usePublishSocialEvent();

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

  columns.push(
    columnHelper.display({
      id: 'actions',
      header: i18n.t('Actions'),
      cell: ({ row }) => { 
        return (
          <div>
            <Button size="xs" onClick={() => {
              console.log(`Edit event with ID: ${row.original.id}`);
            }}>{i18n.t('Edit')}</Button>
           <Button
              size="xs"
              onClick={() => {
                modals.openConfirmModal({
                  id: AppModals.modalKeys.publishSocialEvent,
                  title: t('Publish Social Event'),
                  centered: true,
                  children: (
                    <Text>
                      {t('Are you sure you want to publish')}{" "}
                      <strong>{row.original.title}</strong> {t('event')}?
                    </Text>
                  ),
                  labels: { confirm: t('Publish'), cancel: t('Cancel') },
                  onCancel: () => {
                    modals.close(AppModals.modalKeys.publishSocialEvent); 
                  },
                  onConfirm: () => {
                      mutate({
                        socialEventId: row.original.id,
                      } as PublishSocialEventRequest,{
                      onSuccess: () => {
                        modals.close(AppModals.modalKeys.publishSocialEvent); 
                        notifications.show({
                          title: t('Success'),
                          color: 'green',
                          autoClose: 3000,
                          message: t('Event published successfully'),
                        });    
                      },
                      onError: (error: Error) => {
                        notifications.show({
                          title: t('Error'),
                          color: 'red',
                          message: `${t('Failed to publish event')}: ${error.message}`,
                        });
                      },
                    });
                  },
                });
              }}
            >
              {t('Publish')}
            </Button>
          </div>
        );
      },
    }),
  )

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
