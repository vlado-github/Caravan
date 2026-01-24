import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../AppRouter";
import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import AppModals from "../../components/Modals/AppModals";
import type { CreateGroupRequest } from "../../api/groups/requests/CreateGroupRequest";

const Groups : React.FC = () => {
  const {t} = useTranslation();

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
  return (
    <>
      {actions}
      <div>Groups Page</div>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: Groups,
});

export default Groups;