import { Group, Text, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import AppModals from "../Modals/AppModals";
import i18n from "../../i18n";
import { notifications } from "@mantine/notifications";
import { useAuth } from "react-oidc-context";
import { useDeclineAttendance } from "../../api/socialevents/commands/decline-attendance";
import type { SubmitAttendnanceRequest } from "../../api/socialevents/requests/SubmitAttendanceRequest";
import type { DeclineAttendanceRequest } from "../../api/socialevents/requests/DeclineAttendanceRequest";

type RsvpPreviewProps = {
  socialEventId: string;
  isAttending: boolean;
  title: string;
  startTime: Date;
};

const RsvpPreview: React.FC<RsvpPreviewProps> = ({ socialEventId, isAttending, title, startTime }) => {
  const { t } = useTranslation(); 
  const auth = useAuth();
  const { mutate: mutateDecline } = useDeclineAttendance();
  const [isRsvp, setIsRsvp] = useState(isAttending ?? false);
 
  useEffect(() => {
    setIsRsvp(isAttending);
  }, [isAttending]);

  const openAttendModal = () => {
    modals.openContextModal({
        modal: AppModals.modalKeys.submitAttendance,
        title: t('RSVP'),
        innerProps: {
            modalData:  {
              socialEventId: socialEventId,
              title: title,
              startTime: startTime,
            } as SubmitAttendnanceRequest,
            onSuccess: () => setIsRsvp(true),
        },
    });
  };

   const openDeclineModal = () => {
    modals.openConfirmModal({
      id: AppModals.modalKeys.declineAttendance,
      title: i18n.t('Decline RSVP'),
      centered: true,
      children: (
        <Text>
          {i18n.t('Are you sure you want to decline your RSVP for')}{" "}
          <strong>{title}</strong> {t('event')}?
        </Text>
      ),
      labels: { confirm: i18n.t('Yes'), cancel: i18n.t('Cancel') },
      onCancel: () => {
        modals.close(AppModals.modalKeys.declineAttendance); 
      },
      onConfirm: () => {
          mutateDecline({
            socialEventId: socialEventId,
          } as DeclineAttendanceRequest,{
          onSuccess: () => {
            modals.close(AppModals.modalKeys.declineAttendance); 
            setIsRsvp(false);
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

  const handleSignin = async () => {
    await auth.signinRedirect({ ui_locales: i18n.language });
  };

  return(
    <div>
      {
        socialEventId ?
        <Group>
          <div>
            {
              isRsvp
              ? <Button color="red" onClick={async () => auth.isAuthenticated ? openDeclineModal() : await handleSignin()}>{t("Decline")}</Button>
              : <Button color="blue"  onClick={async () => auth.isAuthenticated ? openAttendModal() : await handleSignin()}>{t("Attend")}</Button>
            }
          </div>
        </Group>
        :
        null
      }
    </div>);
}

export default RsvpPreview;