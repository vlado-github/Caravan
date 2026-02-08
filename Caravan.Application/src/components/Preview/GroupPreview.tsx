import { Text, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useJoinGroup } from "../../api/groups/commands/join-group";
import { useLeaveGroup } from "../../api/groups/commands/leave-group";
import { modals } from "@mantine/modals";
import AppModals from "../Modals/AppModals";
import i18n from "../../i18n";
import type { JoinGroupRequest } from "../../api/groups/requests/JoinGroupRequest";
import { notifications } from "@mantine/notifications";
import type { LeaveGroupRequest } from "../../api/groups/requests/LeaveGroupRequest";
import { useAuth } from "react-oidc-context";

type GroupPreviewProps = {
  socialGroupId: string;
  isSocialGroupMember: boolean;
  socialGroupName: string;
};

const GroupPreview: React.FC<GroupPreviewProps> = ({ socialGroupId, isSocialGroupMember, socialGroupName }) => {
  const { t } = useTranslation(); 
  const auth = useAuth();
  const { mutate: mutateJoin } = useJoinGroup();
  const { mutate: mutateLeave } = useLeaveGroup();
  const [isMember, setIsMember] = useState(isSocialGroupMember ?? false);
 
  useEffect(() => {
    setIsMember(isSocialGroupMember);
  }, [isSocialGroupMember]);

  const openJoinModal = () => {
    modals.openConfirmModal({
      id: AppModals.modalKeys.joinGroup,
      title: i18n.t('Join Social Group'),
      centered: true,
      children: (
        <Text>
          {i18n.t('Are you sure you want to join')}{" "}
          <strong>{socialGroupName}</strong> {t('group')}?
        </Text>
      ),
      labels: { confirm: i18n.t('Join'), cancel: i18n.t('Cancel') },
      onCancel: () => {
        modals.close(AppModals.modalKeys.joinGroup); 
      },
      onConfirm: () => {
          mutateJoin({
            socialGroupId: socialGroupId,
          } as JoinGroupRequest,{
          onSuccess: () => {
            modals.close(AppModals.modalKeys.joinGroup); 
            setIsMember(true);
            notifications.show({
              title: t('Success'),
              color: 'green',
              autoClose: 3000,
              message: t('Group joined successfully'),
            });    
          },
          onError: (error: Error) => {
            notifications.show({
              title: t('Error'),
              color: 'red',
              message: `${t('Failed to join group')}: ${error.message}`,
            });
          },
        });
      },
    });
  };

  const openLeaveModal = () => {
    modals.openConfirmModal({
      id: AppModals.modalKeys.leaveGroup,
      title: i18n.t('Publish Social Event'),
      centered: true,
      children: (
        <Text>
          {i18n.t('Are you sure you want to leave')}{" "}
          <strong>{socialGroupName}</strong> {t('group')}?
        </Text>
      ),
      labels: { confirm: i18n.t('Leave'), cancel: i18n.t('Cancel') },
      onCancel: () => {
        modals.close(AppModals.modalKeys.leaveGroup); 
      },
      onConfirm: () => {
          mutateLeave({
            socialGroupId: socialGroupId,
          } as LeaveGroupRequest,{
          onSuccess: () => {
            modals.close(AppModals.modalKeys.leaveGroup); 
            setIsMember(false);
            notifications.show({
              title: t('Success'),
              color: 'green',
              autoClose: 3000,
              message: t('Group left successfully'),
            });    
          },
          onError: (error: Error) => {
            notifications.show({
              title: t('Error'),
              color: 'red',
              message: `${t('Failed to leave group')}: ${error.message}`,
            });
          },
        });
      },
    });
  };

  const handleSignin = async () => {
    await auth.signinRedirect({ ui_locales: i18n.language });
  };

  return(
    <div>
      {
        socialGroupId ?
        <div>
          {t("Group")} : {socialGroupName} 
          <div>
            {
              isMember
              ? <Button onClick={async () => auth.isAuthenticated ? openLeaveModal() : await handleSignin()}>{t("Leave")}</Button>
              : <Button onClick={async () => auth.isAuthenticated ? openJoinModal() : await handleSignin()}>{t("Join")}</Button>
            }
          </div>
        </div>
        :
        <Text>{t("No group")}</Text>
      }
    </div>);
}

export default GroupPreview;