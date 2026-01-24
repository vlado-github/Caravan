import React from 'react';
import { createRoute, useSearch } from '@tanstack/react-router';
import { rootRoute, type RoutingContext } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearch } from '../../components/Paging/PageSearch';
import { useQueryResult } from './useQueryResult';
import { Button, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import AppModals from '../../components/Modals/AppModals';
import { useTranslation } from 'react-i18next';
import type { CreateSocialEventRequest } from '../../api/socialevents/requests/CreateSocialEventRequest';
import i18n from '../../i18n';
import DataTable from '../../components/DataTable/DataTable';
import type { SocialEventResponse } from '../../api/socialevents/responses/SocialEventResponse';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { getAllSocialEventStatus, SocialEventStatus } from '../../api/base/enums/SocialEventStatus';
import { usePublishSocialEvent } from '../../api/socialevents/commands/publish-social-event';
import type { PublishSocialEventRequest } from '../../api/socialevents/requests/PublishSocialEventRequest';
import { notifications } from "@mantine/notifications";
import type { RescheduleSocialEventRequest } from '../../api/socialevents/requests/RescheduleSocialEventRequest';

const rowsPerPage = 10;

type RowActions = {
  onPublish: (row: SocialEventResponse) => void;
  onReschedule: (row: SocialEventResponse) => void;
};

const columnHelper = createColumnHelper<SocialEventResponse>()
const getColumns = ({onPublish, onReschedule} : RowActions) => 
[
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
  columnHelper.accessor('endTime', {
    header: i18n.t('End Time'),
    cell: info => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleString(i18n.language) : '-';
    },
  }),
  columnHelper.accessor('status', {
    header: i18n.t('Status'),
    cell: info => i18n.t(getAllSocialEventStatus()[info.getValue()].label),
  }),
  columnHelper.display({
    id: 'actions',
    header: i18n.t('Actions'),
    cell: ({ row }) => { 
      return (
        <Group justify='space'>
          <Button size="xs" onClick={() => {
            onReschedule(row.original);
          }}>{i18n.t('Reschedule')}</Button>
          {
            row.original.status === SocialEventStatus.Draft &&
            <Button
              size="xs"
              onClick={() => {
                onPublish(row.original);
              }}
            >
              {i18n.t('Publish')}
            </Button>
          }
        </Group>
      );
    },
  })
] as ColumnDef<SocialEventResponse, unknown>[];

const DraftedSocialEvents: React.FC = () => {
  const {t} = useTranslation();
  const searchParams = useSearch({from: draftedSocialEventsRoute.id});
  const result = useQueryResult(searchParams);
  const { mutate } = usePublishSocialEvent();

  const dataTableActions = (
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

  const openRescheduleModal = (row: SocialEventResponse) => {
    modals.openContextModal({
      modal: AppModals.modalKeys.rescheduleSocialEvent,
      title: i18n.t('Reschedule Social Event'),
      innerProps: {
        modalData: {
          socialEventId: row.id,
          startTime: row.startTime ? new Date(row.startTime) : new Date(),
          endTime: row.endTime ? new Date(row.endTime) : null,
        } as RescheduleSocialEventRequest,
      },
    });
  };

  
  const openPublishModal = (row: SocialEventResponse) => {
    modals.openConfirmModal({
      id: AppModals.modalKeys.publishSocialEvent,
      title: i18n.t('Publish Social Event'),
      centered: true,
      children: (
        <Text>
          {i18n.t('Are you sure you want to publish')}{" "}
          <strong>{row.title}</strong> {t('event')}?
        </Text>
      ),
      labels: { confirm: i18n.t('Publish'), cancel: i18n.t('Cancel') },
      onCancel: () => {
        modals.close(AppModals.modalKeys.publishSocialEvent); 
      },
      onConfirm: () => {
          mutate({
            socialEventId: row.id,
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
  };

  const columns = getColumns({onPublish: openPublishModal, onReschedule: openRescheduleModal});

  return (
    <DataTable model={result} actions={dataTableActions} search={searchParams} columns={columns}/>
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
