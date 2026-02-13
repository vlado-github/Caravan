import { createRoute, useSearch } from "@tanstack/react-router";
import { rootRoute, type RoutingContext } from "../../AppRouter";
import { useTranslation } from "react-i18next";
import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import AppModals from "../../components/Modals/AppModals";
import type { CreateGroupRequest } from "../../api/groups/requests/CreateGroupRequest";
import i18n from "../../i18n";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { SocialGroupResponse } from "../../api/groups/responses/SocialGroupResponse";
import DataTable from "../../components/Custom/DataTable/DataTable";
import { useQueryResult } from "./useQueryResult";
import type { PageSearchParam } from "../../components/Paging/PageSearchParam";
import { DefaultConsts } from "../../consts/DefaultConsts";
import type { UpdateGroupRequest } from "../../api/groups/requests/UpdateGroupRequest";
import { useAuth } from "react-oidc-context";

type RowActions = {
  onUpdate: (row: SocialGroupResponse) => void;
};

const columnHelper = createColumnHelper<SocialGroupResponse>();
const getColumns = ({onUpdate} : RowActions, userId: string) => 
[
  columnHelper.accessor('id', {
    header: i18n.t('ID'),
  }),
  columnHelper.accessor('name', {
    header: i18n.t('Name'),
  }),
  columnHelper.display({
    id: 'actions',
    header: i18n.t('Actions'),
    cell: ({ row }) => { 
      return (
        <Group justify='space'>
          {
            row.original.createdById === userId &&
            <Button
              size="xs"
              onClick={() => {
                onUpdate(row.original);
              }}
            >
              {i18n.t('Update')}
            </Button>
          }
        </Group>
      );
    },
  })
] as ColumnDef<SocialGroupResponse, unknown>[];

const Groups : React.FC = () => {
  const {t} = useTranslation();
  const searchParams = useSearch({from: groupsRoute.id});
  const result = useQueryResult(searchParams);
  const {user} = useAuth();

  const actions = (
    <Button onClick={() => {
        modals.openContextModal({
            modal: AppModals.modalKeys.createGroup,
            title: t('Create Group'),
            innerProps: {
                modalData:  {} as CreateGroupRequest
            }
        });
    }}>
        {t('Create')}
    </Button>
  );

  const openUpdateModal = (row: SocialGroupResponse) => {
    modals.openContextModal({
      modal: AppModals.modalKeys.updateGroup,
      title: i18n.t('Update Group'),
      innerProps: {
        modalData: {
          socialGroupId: row.id,
          socialGroupName: row.name, 
        } as UpdateGroupRequest
      }
    });
  };

  const columns = getColumns({onUpdate: openUpdateModal}, user?.profile.sub ?? '');

  return (
    <DataTable model={result} actions={actions} search={searchParams} columns={columns}/>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: Groups,
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

export default Groups;