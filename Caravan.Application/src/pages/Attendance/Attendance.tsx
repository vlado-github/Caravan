import React from 'react';
import { createRoute, useSearch } from '@tanstack/react-router';
import { rootRoute, type RoutingContext } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import type { PageSearchParam } from '../../components/Paging/PageSearchParam';
import { useQueryResult } from './useQueryResult';
import { Button, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import AppModals from '../../components/Modals/AppModals';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import DataTable from '../../components/Custom/DataTable/DataTable';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { notifications } from "@mantine/notifications";
import type { AttendanceResponse } from '../../api/socialevents/responses/AttendanceResponse';
import type { DeclineAttendanceRequest } from '../../api/socialevents/requests/DeclineAttendanceRequest';
import { getAllAttendanceStatus } from '../../api/base/enums/AttendanceStatus';
import { useDeclineAttendance } from '../../api/socialevents/commands/decline-attendance';

type RowActions = {
  onDecline: (row: AttendanceResponse) => void;
};

const columnHelper = createColumnHelper<AttendanceResponse>()
const getColumns = ({onDecline} : RowActions) => 
[
  columnHelper.accessor('eventId', {
    header: i18n.t('ID'),
  }),
  columnHelper.accessor('title', {
    header: i18n.t('Title'),
  }),
  columnHelper.accessor('startTime', {
    header: i18n.t('Start Time'),
    cell: info => new Date(info.getValue()).toLocaleString(i18n.language),
  }),
  columnHelper.accessor('attendanceStatus', {
    header: i18n.t('RSVP'),
    cell: info => i18n.t(getAllAttendanceStatus()[info.getValue()].label),
  }),
  columnHelper.display({
    id: 'actions',
    header: i18n.t('Actions'),
    cell: ({ row }) => { 
      return (
        <Group justify='space'>
          <Button size="xs" onClick={() => {
            onDecline(row.original);
          }}>{i18n.t('Decline')}</Button>
        </Group>
      );
    },
  })
] as ColumnDef<AttendanceResponse, unknown>[];

const Attendance: React.FC = () => {
  const {t} = useTranslation();
  const searchParams = useSearch({from: attendanceRoute.id});
  const result = useQueryResult(searchParams);
  const { mutate } = useDeclineAttendance();

  const openDeclineModal = (row: AttendanceResponse) => {
    modals.openConfirmModal({
      id: AppModals.modalKeys.declineAttendance,
      title: i18n.t('Decline RSVP'),
      centered: true,
      children: (
        <Text>
          {i18n.t('Are you sure you want to decline your RSVP for')}{" "}
          <strong>{row.title}</strong> {t('event')}?
        </Text>
      ),
      labels: { confirm: i18n.t('Yes'), cancel: i18n.t('Cancel') },
      onCancel: () => {
        modals.close(AppModals.modalKeys.declineAttendance); 
      },
      onConfirm: () => {
          mutate({
            socialEventId: row.eventId,
          } as DeclineAttendanceRequest,{
          onSuccess: () => {
            modals.close(AppModals.modalKeys.declineAttendance); 
            notifications.show({
              title: t('Success'),
              color: 'green',
              autoClose: 3000,
              message: t('RSVP declined successfully'),
            });    
          },
          onError: (error: Error) => {
            notifications.show({
              title: t('Error'),
              color: 'red',
              message: `${t('Failed to decline RSVP')}: ${error.message}`,
            });
          },
        });
      },
    });
  };

  const columns = getColumns({ onDecline: openDeclineModal});

  return (
    <DataTable model={result} search={searchParams} columns={columns}/>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attending",
  component: Attendance,
  beforeLoad: async ({context} : {context : RoutingContext}) => {
    if (!context.auth.isAuthenticated) {
      await context.auth.signinRedirect({ ui_locales: i18n.language });
    }
  },
  validateSearch: (search: Record<string, unknown>): PageSearchParam => {
    if (Object.keys(search).length === 0)
    {
        return {
          start: DefaultConsts.FirstPageIndex,
          size: DefaultConsts.RowsPerTable,
        };
    }
    return {
      start: Number(search?.start ?? DefaultConsts.FirstPageIndex),
      size: Number(search?.size ?? DefaultConsts.RowsPerTable),
    };
  },
});

export default Attendance;
